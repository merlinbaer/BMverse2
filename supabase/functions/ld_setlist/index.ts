import {delay, deleteAllRows, filterObject, flattenObj, insertUntypedData, selectAllRows} from "../_shared/global.ts";
import Job from '../_shared/joblib.ts';

// -- Loading BABYMETAL concerts and performed songs from setlist.fm --

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


    let pages = 0
    // deno-lint-ignore no-explicit-any
    let setlistArray: any[] =[]
    // deno-lint-ignore no-explicit-any
    let setlistSongsArray: any[] =[]
    // deno-lint-ignore no-explicit-any
    let songsMapping: any[] =[]
    // deno-lint-ignore no-explicit-any
    let songsArray: any[] =[]

    // load mapping tables
    try {
        songsMapping = await selectAllRows('ld_song_mapping', 'song_name_original, song_title', job.db)
        songsArray = await selectAllRows('bm_songs', 'song_title, song_artwork_small', job.db)
    } catch (err) {
        job.error(`Error reading mapping tables: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Data mapping" , { status: 500 });
    }

    // load ld tables
    try {
        // get API data
        pages = await getPages()
        if (pages >= 24){
            for (let i = 1; i <= pages; i++) {
                const fetchedData = await fetchSetlist(i)
                job.log("Fetched data from page: " + i)
                setlistArray = [...setlistArray, ...transformToSetlist(fetchedData.setlist)];
                setlistSongsArray = [...setlistSongsArray, ...transformToSongs(fetchedData.setlist, songsMapping, songsArray)];
            }
        } else {
            throw new Error("API error - not enough pages.");
        }
        // insert API data
        let deletedRows = await deleteAllRows('ld_setlist', job.db)
        job.log(`${deletedRows} rows deleted from table ld_setlist`)
        deletedRows = await deleteAllRows('ld_setlist_songs', job.db)
        job.log(`${deletedRows} rows deleted from table ld_setlist_songs`)

        let inserted_Rows = await insertUntypedData(setlistArray, 'ld_setlist', job.db)
        job.log(`${inserted_Rows} rows inserted in table ls_setlist`)
        inserted_Rows = await insertUntypedData(setlistSongsArray, 'ld_setlist_songs', job.db)
        job.log(`${inserted_Rows} rows inserted in table ls_setlist_songs`)

    } catch (err) {
        job.error(`Error fetching API data: { total pages: ${pages}; fetched_setlists: ${setlistArray.length}; fetched_songs: ${setlistSongsArray.length} }; ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name, { status: 500 });
    }

    await job.end(`total_setlists: ${setlistArray.length}; total_songs: ${setlistSongsArray.length}`)
    return new Response(`Job-${job.name}: OK`, { status: 200 });
})


async function getPages() : Promise<number> {
    try {
        const metadata = await fetchSetlist(1)
        const total = metadata.total

    return (Math.ceil(total / 20))

    } catch (_err) {
        return 0        
    }
}

async function fetchSetlist(page:number) {
    const url = 'https://api.setlist.fm/rest/1.0/artist/27e2997f-f7a1-4353-bcc4-57b9274fa9a4/setlists?p=' + String(page); 
    const apiKey = Deno.env.get('API_SETLIST_FM') ;
    await delay(1000); //needed due to api fetch requirements
    try {
        const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-API-Key': apiKey === undefined ? "" : apiKey
        }
      });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
        return await response.json()
    } catch (error) {
        console.log('Error fetching API data: ' +  error);
        throw error
    }
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

// deno-lint-ignore no-explicit-any
function transformToSongs(fetchedArray: any [], songsMapping : any [], songsArray : any []) : any[] { 
    // deno-lint-ignore no-explicit-any
    const songsPageArray : any[] =[]
    for (const obj of fetchedArray) {
        let song_nr = 0
        for (const set of obj.sets.set) {
            const encore = set.encore === undefined ? false : true
            for (const song of set.song) {
                const tape = song.tape === undefined ? false : song.tape
                if (!(tape && song.name !== "Megitsune")) {
                    const info = song.info === undefined ? "" : song.info
                    const mappedSongObject = songsMapping.find(obj => obj['song_name_original'] === song.name)
                    const mappedSongName = mappedSongObject ? mappedSongObject.song_title : song.name
                    const songObject = songsArray.find(obj => obj['song_title'] === mappedSongName)
                    const songArtwork = songObject ? songObject.song_artwork_small : "unknown"
                    songsPageArray.push({
                        'setlist_id': obj.id,
                        'setlist_versionid': obj.versionId,
                        'song_nr': song_nr,
                        'song_name_original': song.name,
                        'song_name': mappedSongName,
                        'song_encore': encore,
                        'song_info': info,
                        'song_artwork': songArtwork
                    })
                }
                song_nr = song_nr + 1
            }
        }
    }
    return songsPageArray
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
