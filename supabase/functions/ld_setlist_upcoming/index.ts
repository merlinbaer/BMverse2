import {
    delay,
    deleteAllRows,
    filterObject,
    flattenObj,
    insertUntypedData,
    selectAllRows,
    updateUntypedData
} from "../_shared/global.ts";
import Job from '../_shared/joblib.ts';

// -- Loading BABYMETAL upcoming concerts from setlist.fm --
// There is no API call for upcoming concerts. 
// A manual table is needed to enter the upcoming setlist id manually

Deno.serve(async (req: Request) => {
    const job = new Job(req)
    try {
        if (job.isValid) {
            await job.start()
        } else {
            return new Response('Invalid call.', { status: 401 });
        }     
    } catch(err) {
        job.log("Fatal error in job initialization: " + JSON.stringify(err, null, 2))
        return new Response("Fatal error: job initialization.", { status: 500 });
    }

    let deletedUpcomingConcerts = 0;
    // deno-lint-ignore no-explicit-any
    let setlistArray: any[] =[];
    // deno-lint-ignore no-explicit-any
    let setlistUpcoming: any[] =[];
    // load driver table for getting upcoming events (insert and update are manual work)
    try {
        setlistUpcoming = await selectAllRows('ld_upcoming_concerts', '*', job.db)
        job.log("# upcoming event: " + setlistUpcoming.length)
    } catch (err) {
        job.error(`Error reading driver table: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Data load upcoming failed." , { status: 500 });
    }

    // Soft delete old upcoming concerts
    try {
        const oldUpcomingConcerts = getOlderSetlists(setlistUpcoming)
        job.log("# upcoming concerts to be deleted because they are to old: " + oldUpcomingConcerts.length)
        for (const row of oldUpcomingConcerts) {
            row.deleted = true
            job.log("Old upcoming concerts to remove: " + row.setlist_eventdate)
            const updatedRow = await updateUntypedData('ld_upcoming_concerts', row, 'setlist_id', job.db)
            deletedUpcomingConcerts = deletedUpcomingConcerts + updatedRow;
        }
    } catch (err) {
        job.error(`Error removing old upcoming concerts: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Removing old upcoming concerts" , { status: 500 });
    }

    // reload driver table for getting upcoming events
    try {
        setlistUpcoming = await selectAllRows('ld_upcoming_concerts', '*', job.db)
        job.log("# upcoming event: " + setlistUpcoming.length)
    } catch (err) {
        job.error(`Error reading driver tables: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Data load upcoming failed." , { status: 500 });
    }

    // load ld table
    try {
        // fetch API data
        const fetchedData = await fetchUpcomingSetlists(setlistUpcoming)
        job.log("Fetched data from upcoming event: " + fetchedData.length)
        setlistArray = transformToSetlist(fetchedData);

        // Copy setlist_tickets from source table data (setlistUpcoming) to the transformed array
        for (const item of setlistArray) {
            const sourceRow = setlistUpcoming.find(row => row.setlist_id === item.setlist_id);
            if (sourceRow) {
                item.setlist_tickets = sourceRow.setlist_tickets;
            }
        }

        // insert API data
        const deletedRows = await deleteAllRows('ld_setlist_upcoming', job.db)
        job.log(`${deletedRows} rows deleted from table ld_setlist_upcoming`)

        const inserted_Rows = await insertUntypedData(setlistArray, 'ld_setlist_upcoming', job.db)
        job.log(`${inserted_Rows} rows inserted in table ls_setlist_upcoming`)

    } catch (err) {
        job.error(`Error fetching API data: { fetched_setlists: ${setlistArray.length}; ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name, { status: 500 });
    }

    await job.end(`total upcoming setlists: ${setlistArray.length}; deleted old upcoming setlists: ${deletedUpcomingConcerts};`)
    return new Response(`Job-${job.name}: OK`, { status: 200 });
})



// deno-lint-ignore no-explicit-any
async function fetchUpcomingSetlists( setlists : any[] ) {
    const url = 'https://api.setlist.fm/rest/1.0/setlist/'; 
    const apiKey = Deno.env.get('API_SETLIST_FM') ;
    // deno-lint-ignore no-explicit-any
    const retArray: any[] =[]

    for (const setlist of setlists) {
        await delay(1200); //needed due to api fetch requirements
        try {
            const response = await fetch(url + setlist.setlist_id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-API-Key': apiKey === undefined ? "" : apiKey
            }
          });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            retArray.push(data)
            console.log("Setlist_id: " + data.id + " fetched.")
        } catch (error) {
            console.log('Error fetching API data: ' +  error);
            throw error
        }
    }
    return retArray
}

// deno-lint-ignore no-explicit-any
function transformToSetlist(fetchedArray : any []) : any[] { 
    // deno-lint-ignore no-explicit-any
    const setlistPageArray : any[] =[]
    for (let obj of fetchedArray) {
        obj = filterObject(obj, 'sets');
        obj = filterObject(obj, 'disambiguation');
        obj = flattenObj(obj, 'setlist');
        const { fullDate, year } = changeDateFormat(obj.setlist_eventdate)
        obj.setlist_eventdate = fullDate
        obj.setlist_eventyear = year
        obj.setlist_artwork = 'https://flagsapi.com/' + obj.setlist_venue_city_country_code + '/shiny/64.png'
        setlistPageArray.push(obj)
    }
    return setlistPageArray
}


function changeDateFormat(dateStr: string) {
    // Check if the date string matches the expected "DD-MM-YYYY" format
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (!regex.test(dateStr)) {
        throw new Error("Invalid input date format. 'DD-MM-YYYY' expected.");
    }
    // Split and rearrange the date
    const [aDay, aMonth, aYear] = dateStr.split('-');
    const fullDate = `${aYear}-${aMonth}-${aDay}`
    const year = parseInt(aYear, 10)
    return { fullDate, year };
}

// deno-lint-ignore no-explicit-any
function getOlderSetlists(upcomingArray : any []) : any[] { 
    const today = new Date();   // Get today's date
    today.setHours(0, 0, 0, 0); // Set today's time to 00:00:00 for comparison

    return upcomingArray.filter((item) => {
        const itemDate = new Date(item.setlist_eventdate);  // Convert date string to Date object
        itemDate.setHours(0, 0, 0, 0);        // Set the item's time to 00:00:00 for accurate comparison
        return itemDate <= today;                                 // Check if the item date is older than today
    })
}
