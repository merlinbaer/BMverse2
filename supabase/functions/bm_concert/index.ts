import {insertNews,insertUntypedData, selectAllRows, triggerSync, updateUntypedData} from "shared/global.ts";
import Job from "shared/joblib.ts";

// -- Sync BABYMETAL concerts, performed songs and year statistics from ld tables & view into bm tables --

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

    let insertedConcerts = 0;
    let insertedUpcomingConcerts = 0;
    let insertedSongs = 0;
    let updatedConcerts = 0;
    let updatedOldSongs = 0;
    let updatedNewSongs = 0;
    let deletedConcerts = 0;
    let deletedUpcomingConcerts = 0;
    let deletedSongs = 0;
    // deno-lint-ignore no-explicit-any
    let setlist: any[] =[];
    // deno-lint-ignore no-explicit-any
    let setlistSongs: any[] =[];
    // deno-lint-ignore no-explicit-any
    let concert: any[] =[];
    // deno-lint-ignore no-explicit-any
    let concertSongs: any[] =[];

    // load concerts and performed songs from ld and bm tables
    try {
        setlist = await selectAllRows('ld_setlist', '*', job.db);
        setlistSongs = await selectAllRows('ld_setlist_songs', '*', job.db);
        concert = await selectAllRows('bm_event_concert', '*', job.db);
        concertSongs = await selectAllRows('bm_event_concert_songs', '*', job.db);
        job.log(`#bm_event_concert: ${concert.length}; #ld_setlist: ${setlist.length};`);
        job.log(`#bm_event_concert_songs: ${concertSongs.length}; #ld_setlist_songs: ${setlistSongs.length};`);
    } catch (err) {
        job.error(`Error: Reading concerts and song data failed: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Concerts and songs loading failed" , { status: 500 });
    }

    // check if ld tables have enough data
    if (setlist.length < 400) {
        job.error(`Error: Amount of setlists in ld table is less than 400`);
        return new Response("Error in JOB:" + job.name + " - Not enough setlist data" , { status: 500 });
    }
    if (setlistSongs.length < 4000) {
        job.error(`Error: Amount of setlist songs in ld table is less than 4000`);
        return new Response("Error in JOB:" + job.name + " - Not enough song data" , { status: 500 });
    }

    // Insert missing concerts and performed songs from ld tables into bm tables 
    try {
        const missingSetlist = missingBySetlistId(setlist, concert)
        job.log('Missing concerts in bm: ' + missingSetlist.length)
        if (missingSetlist.length > 0) {
            insertedConcerts = await insertUntypedData(missingSetlist, 'bm_event_concert', job.db)
        }
        const missingSongs = missingBySetlistId(setlistSongs, concertSongs)
        job.log('Missing songs in bm: ' + missingSongs.length)
        if (missingSongs.length > 0) {
            insertedSongs = await insertUntypedData(missingSongs, 'bm_event_concert_songs', job.db)
        }
    } catch (err) {
        job.error(`Error: Concerts and song insert failed: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Insert concerts and songs failed", { status: 500 });
    }

    // Soft delete concerts from bm tables when data is missing in ld tables
    try {
        const missingSetlist = missingBySetlistId(concert, setlist)
        job.log('Missing concerts in ld: ' + missingSetlist.length)
        if (missingSetlist.length > 0) {
            for (const row of missingSetlist) {
                row.deleted = true
                const updatedRow = await updateUntypedData('bm_event_concert', row, 'setlist_id', job.db)
                deletedConcerts = deletedConcerts + updatedRow;
            }
        }
    } catch (err) {
        job.error(`Error: Only ${deletedConcerts} concert soft deleted: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Delete concert failed.", { status: 500 });
    }

    // Soft delete songs from bm tables when data is missing in ld tables
    try {
        const missingSetlistSongs = missingBySetlistId(concertSongs, setlistSongs)
        job.log('Missing songs in ld: ' + missingSetlistSongs.length)
        if (missingSetlistSongs.length > 0) {
            for (const row of missingSetlistSongs) {
                row.deleted = true
                const updatedRow = await updateUntypedData('bm_event_concert_songs', row, 'setlist_id', job.db)
                deletedSongs = deletedSongs + updatedRow;
            }
        }
    } catch (err) {
        job.error(`Error: Only ${deletedConcerts} song soft deleted: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Delete song failed.", { status: 500 });
    }

    // Updating concerts and songs
    try {
        // Update concert and soft delete songs when version changed
        const changedSetlist = changedVersion(setlist, concert)
        job.log('Changed concerts: ' + changedSetlist.length)
        if (changedSetlist.length > 0) {
            for (const row of changedSetlist) {
                const updatedRow = await updateUntypedData('bm_event_concert', row, 'setlist_id', job.db);
                updatedConcerts = updatedConcerts + updatedRow;
                // Changed version of setlist will soft delete all songs of a certain setlist
                // The missing songs of that setlist will be inserted later with a new version from the ld table
                const songRow = { setlist_id: row.setlist_id, deleted : true };
                const deletedSongRows = await updateUntypedData('bm_event_concert_songs', songRow, 'setlist_id', job.db);
                updatedOldSongs = updatedOldSongs + deletedSongRows;
                job.log('Changed old songs: ' + updatedOldSongs)
            }
        }
    } catch (err) {
        job.error(`Error: Only ${updatedConcerts} concerts and ${updatedOldSongs} songs updated: ${JSON.stringify(err, null, 2)}`);
        return new Response("Error in JOB:" + job.name + " - Concert update failed" , { status: 500 });
    }
    try {
        // reload performed songs of bm song table
        job.log('Reloading Songs:');
        concertSongs = await selectAllRows('bm_event_concert_songs', '*', job.db);
        job.log(`#bm_event_concert_songs: ${concertSongs.length}; #ld_setlist_songs: ${setlistSongs.length};`);
    } catch (err) {
        job.error(`Error: Reloading song data detailed: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Song reloading failed" , { status: 500 });
    }
    try {
        // Insert missing songs with new version from ld tables into bm tables 
        const missingSongs = missingBySetlistId(setlistSongs, concertSongs)
        if (missingSongs.length > 0) {
            updatedNewSongs = await insertUntypedData(missingSongs, 'bm_event_concert_songs', job.db)
            job.log(`#Old songs before update: ${updatedOldSongs}; #New songs after update: ${updatedNewSongs};`);
        }
    } catch (err) {
        job.error(`Error: Insert of updated songs failed: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Insert updated songs failed", { status: 500 });
    }

    setlist =[];
    concert = [];
    // Sync upcoming concert and year table
    // Upcoming concerts should not need an update in version changes. It will come to bm concert table when performed
    try {
        // load upcoming concerts in ld and bm tables
        setlist = await selectAllRows('ld_setlist_upcoming', '*', job.db);
        concert = await selectAllRows('bm_event_concert_upcoming', '*', job.db);
        job.log(`#bm_event_concert_upcoming: ${concert.length}; #ld_setlist_upcoming: ${setlist.length};`);
    } catch (err) {
        job.error(`Error: Reading upcoming concerts data failed: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Upcoming concerts loading failed" , { status: 500 });
    }
    // Check ld table. Usually only one concerts less per day
    if (setlist.length < concert.length - 1) {
        job.log(`WARNING: ld table seems to have not enough rows. Check table ld concert upcoming.`);
    }
    try {
        // Insert missing upcoming concerts from ld table into bm table 
        const missingSetlist = missingBySetlistId(setlist, concert)
        job.log('Missing upcoming concerts in bm: ' + missingSetlist.length)
        if (missingSetlist.length > 0) {
            insertedUpcomingConcerts = await insertUntypedData(missingSetlist, 'bm_event_concert_upcoming', job.db)
            void await insertNews('New tour data in upcoming concerts', job.db)
        }
    } catch (err) {
        job.error(`Error: Upcoming concerts insert failed: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Insert upcoming concerts failed", { status: 500 });
    }
    try {
        // Soft delete upcoming concerts from bm tables when data is missing in ld tables
        const missingSetlist = missingBySetlistId(concert, setlist)
        job.log('Missing upcoming concerts in ld: ' + missingSetlist.length)
        if (missingSetlist.length > 0) {
            for (const row of missingSetlist) {
                row.deleted = true
                const updatedRow = await updateUntypedData('bm_event_concert_upcoming', row, 'setlist_id', job.db)
                deletedUpcomingConcerts = deletedUpcomingConcerts + updatedRow;
            }
        }
    } catch (err) {
        job.error(`Error: Only ${deletedUpcomingConcerts} upcoming concerts soft deleted: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Delete upcoming concerts failed.", { status: 500 });
    }
    if (
        insertedConcerts > 0 ||
        insertedUpcomingConcerts > 0 ||
        insertedSongs > 0 ||
        updatedConcerts > 0 ||
        updatedOldSongs > 0 ||
        updatedNewSongs > 0 ||
        deletedConcerts > 0 ||
        deletedUpcomingConcerts > 0 ||
        deletedSongs > 0
    ) {
        void await triggerSync(job.db);
    }

    await job.end(`Concerts inserted: ${insertedConcerts}; Songs inserted: ${insertedSongs}; Updated concerts: ${updatedConcerts}; Updated old songs(deleted): ${updatedOldSongs}; Updated new songs(inserted): ${updatedNewSongs}; Concerts deleted: ${deletedConcerts}; Songs deleted: ${deletedSongs}; Upcoming concerts inserted: ${insertedUpcomingConcerts}; Upcoming concerts deleted: ${deletedUpcomingConcerts};`)
    return new Response(`Job-${job.name}: OK`, { status: 200 });
})


// --------- Helper Functions ----------------------------------------------

// deno-lint-ignore no-explicit-any
function missingBySetlistId(aData: any[], bData: any[]) {
    const bIds = bData.map(row => row.setlist_id)
      // Find rows in a that don't exist in b by setlist_id
    return aData.filter(row => !bIds.includes(row.setlist_id))
  }

// deno-lint-ignore no-explicit-any
function changedVersion(tableAData: any[], tableBData: any[]) {
    const differences = []
    // Check if the version of a certain setlist_id has changed
    for (const rowA of tableAData) {
        const rowB = tableBData.find(row => row.setlist_id === rowA.setlist_id)
        if (rowB) {
            if (rowA.setlist_versionid !== rowB.setlist_versionid) {
                differences.push(rowA);
            }
        }
    }
    return differences
}
