import {insertNews, triggerSync, insertUntypedData, selectAllRows, updateUntypedData} from "shared/global.ts";
import Job from "shared/joblib.ts";

// -- Sync BABYMETAL videos from ld tables into bm tables --

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

    let insertedVideos = 0;
    let deletedVideos = 0;
    let updatedVideos = 0;
    // deno-lint-ignore no-explicit-any
    let youtube: any[] =[];
    // deno-lint-ignore no-explicit-any
    let videos: any[] =[];

    // load videos from ld and bm table
    try {
        youtube = await selectAllRows('ld_youtube', '*', job.db);
        videos = await selectAllRows('bm_videos', '*', job.db);
        job.log(`#bm_videos: ${videos.length}; #ld_youtube: ${youtube.length};`);
    } catch (err) {
        job.error(`Error: Reading videos failed: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Videos loading failed" , { status: 500 });
    }

    // check if ld tables have enough data
    if (youtube.length < 30) {
        job.error(`Error: Amount of videos in ld table is less than 30`);
        return new Response("Error in JOB:" + job.name + " - Not enough videos" , { status: 500 });
    }

    // Insert missing videos from ld table into bm table 
    try {
        const missingVideos = missingByVideoId(youtube, videos)
        job.log('Missing videos in bm: ' + missingVideos.length)
        if (missingVideos.length > 0) {
            insertedVideos = await insertUntypedData(missingVideos, 'bm_videos', job.db)
            const insertNewsMessage = insertedVideos === 1
                ? `New video available. ${missingVideos[0].video_title}`
                : `${insertedVideos} new videos available.`
            void await insertNews(insertNewsMessage, job.db)
        }
    } catch (err) {
        job.error(`Error: Videos insert failed: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Insert videos failed", { status: 500 });
    }

    // Soft delete videos when data is missing in ld tables
     try {
        const missingVideos = missingByVideoId(videos, youtube)
        job.log('Missing videos in ld: ' + missingVideos.length)
        if (missingVideos.length > 0) {
            for (const row of missingVideos) {
                row.deleted = true
                const updatedRow = await updateUntypedData('bm_videos', row, 'video_id', job.db)
                deletedVideos = deletedVideos + updatedRow;
            }
            void await triggerSync(job.db)
        }
    } catch (err) {
        job.error(`Error: Only ${deletedVideos} videos soft deleted: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Delete videos failed.", { status: 500 });
    }

    // Updating changed videos
    try {
        const changedVideos = collectDifferentRows(youtube, videos)
        job.log('Changed videos: ' + changedVideos.length)
        if (changedVideos.length > 0) {
            for (const row of changedVideos) {
                const updatedRow = await updateUntypedData('bm_videos', row, 'video_id', job.db);
                updatedVideos = updatedVideos + updatedRow;
            }
            void await triggerSync(job.db)
        }
    } catch (err) {
        job.error(`Error: Only ${updatedVideos} videos updated: ${JSON.stringify(err, null, 2)}`);
        return new Response("Error in JOB:" + job.name + " - Video update failed" , { status: 500 });
    }


    await job.end(`Videos inserted: ${insertedVideos}; Updated videos: ${updatedVideos}; Videos deleted: ${deletedVideos};`)
    return new Response(`Job-${job.name}: OK`, { status: 200 });
})


// --------- Helper Functions ----------------------------------------------

// deno-lint-ignore no-explicit-any
function missingByVideoId(aData: any[], bData: any[]) {
    const bIds = bData.map(row => row.video_id)
      // Find rows in a that don't exist in b by video_id
    return aData.filter(row => !bIds.includes(row.video_id))
  }


// deno-lint-ignore no-explicit-any
function collectDifferentRows(tableAData: any[], tableBData: any[]) {
    // deno-lint-ignore no-explicit-any
    const differences: any[] = []
    for (const rowA of tableAData) {
        const rowB = tableBData.find(row => row.video_id === rowA.video_id)
        if (rowB) {
            const keys = Object.keys(rowB);
            for (const key of keys) {
                if (rowB[key] !== rowA[key]) {
                    differences.push(rowA);
                    break;
                }    
            }
        }
    }
    return differences
}

