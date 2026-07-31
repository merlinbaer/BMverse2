import {delay, deleteAllRows, insertUntypedData, selectAllRows} from "shared/global.ts";
import Job from "shared/joblib.ts"

// -- Load YouTube BABYMETAL video data --

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

    let deletedRows = 0;
    let inserted_Rows = 0;
    // deno-lint-ignore no-explicit-any
    let videoArray: any[] =[]

    // load video input tables, load API Data and transform to target table data
    try {
        const channelTable = await selectAllRows('ld_video_channels', 'channel_id', job.db);
        const channelList = channelTable.map(channel => channel.channel_id).join(',');
        const channelApi = await fetchYoutubeApi("https://www.googleapis.com/youtube/v3/channels?&part=id,snippet", channelList);
        const channelArray = transformChannelData(channelApi.items);

        const videoTable = await selectAllRows('ld_video_selection', '*', job.db);
        const videoList = videoTable.map(video => video.video_id).join(',');
        const videoApi = await fetchYoutubeApi("https://www.googleapis.com/youtube/v3/videos?part=id,contentDetails,snippet,statistics", videoList);
        videoArray = transformVideoData(videoApi.items, videoTable, channelArray);
    } catch (err) {
        job.error(`Error: Reading video input: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Reading video input" , { status: 500 });
    }

    // check data 

    // insert API data
    try {
        deletedRows = await deleteAllRows('ld_youtube', job.db)
        job.log(`${deletedRows} rows deleted from table ld_youtube`)
        inserted_Rows = await insertUntypedData(videoArray, 'ld_youtube', job.db)
        job.log(`${inserted_Rows} rows inserted in table ld_youtube`)
    } catch (err) {
        job.error(`Error: Insert video data: ${JSON.stringify(err, null, 2)} `);
        return new Response("Error in JOB:" + job.name + " - Insert video data" , { status: 500 });
    }

    await job.end(`#Jobs: Deleted rows in ld_youtube ${deletedRows}; Inserted rows in ld_youtube ${inserted_Rows}`);
    return new Response(`Job-${job.name}: OK`, { status: 200 });
})

// ---------- Helper functions --------------------------------------------------

async function fetchYoutubeApi(url : string, id : string) {
    const apiKey = Deno.env.get('API_YOUTUBE');
    const extendedUrl = url + `&key=${apiKey}&id=${id}`
    await delay(100); //needed due to api fetch requirements
    try {
        const response = await fetch(extendedUrl, {
        method: 'GET',
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
function transformChannelData(fetchedArray : any []) : any[] { 
    // deno-lint-ignore no-explicit-any
    const youtubeArray : any[] =[]
    for (const obj of fetchedArray) {
        // deno-lint-ignore no-explicit-any
        const channel : Record<string, any> = {}
        channel.channel_id = obj.id;
        channel.channel_title = obj.snippet.title;
        channel.channel_decription = obj.snippet.description;
        channel.channel_customurl = obj.snippet.customUrl;
        channel.channel_artwork = obj.snippet.thumbnails.medium.url;
        youtubeArray.push(channel)
    }
    return youtubeArray
}

// deno-lint-ignore no-explicit-any
function transformVideoData(fetchedArray : any [], tableArray : any [], channelArray : any []) : any[] { 
    // deno-lint-ignore no-explicit-any
    const youtubeArray : any[] =[]
    for (const obj of fetchedArray) {
        // deno-lint-ignore no-explicit-any
        const video : Record<string, any> = {}
        video.video_id = obj.id;
        video.channel_id = obj.snippet.channelId;
        video.channel_title = findObject(channelArray,'channel_id', obj.snippet.channelId).channel_title;
        video.channel_decription = findObject(channelArray,'channel_id', obj.snippet.channelId).channel_decription;
        video.channel_customurl = findObject(channelArray,'channel_id', obj.snippet.channelId).channel_customurl;
        video.channel_type = findObject(tableArray,'video_id', obj.id).channel_type;
        video.channel_artwork = findObject(channelArray,'channel_id', obj.snippet.channelId).channel_artwork;
        video.video_title_original = obj.snippet.title;
        const title_edited = findObject(tableArray,'video_id', obj.id).video_title_edited; 
        video.video_title = title_edited ? title_edited : obj.snippet.title;
        video.video_publishedat = obj.snippet.publishedAt;
        video.video_description = obj.snippet.description;
        video.video_duration = formatDuration(obj.contentDetails.duration);
        video.video_viewcount = roundDown(obj.statistics.viewCount);
        video.video_likecount = roundDown(obj.statistics.likeCount);
        video.video_commentcount = roundDown(obj.statistics.commentCount);
        video.video_artwork = obj.snippet.thumbnails.standard.url;
        video.video_song = findObject(tableArray,'video_id', obj.id).video_song;
        youtubeArray.push(video)
    }
    return youtubeArray
}

function findObject<T, K extends keyof T>(array: T[], key: K, value: T[K]): T | undefined {
    return array.find(item => item[key] === value);
}

function roundDown(value: string): number {
    const num = Number(value)
    if (num < 1000) {
        return 999
    }
    // Determine the scale factor based on the number of digits
    const factor = Math.pow(10, Math.floor(Math.log10(num)) - 1);
      // Divide by factor, floor it, then multiply back
    return Math.floor(num / factor) * factor
}

function formatDuration(duration: string): string {
    // Regex to match and extract hours, minutes, and seconds
    const regex = /^PT(\d+H)?(\d+M)?(\d+S)?$/;
    const matches = regex.exec(duration);
  
    // Extract hours, minutes, and seconds (if present)
    const hours = matches?.[1] ? parseInt(matches[1].replace('H', '')) : 0;
    const minutes = matches?.[2] ? parseInt(matches[2].replace('M', '')) : 0;
    const seconds = matches?.[3] ? parseInt(matches[3].replace('S', '')) : 0;
  
    // Construct a human-readable string better than Googles used ISO8601 format
    let formatted = '';
    if (hours > 0) {
        if (minutes === 0 && seconds === 0) {
            formatted += `${hours}h`;
        } else {
            formatted += `${hours}h:`;
        }
    }
    if (minutes > 0) {
        if (seconds === 0) {
            formatted += `${minutes}m`;
        } else {
            formatted += `${minutes}m:`;
        }
    }
    if (seconds > 0) {
      formatted += `${seconds}s`;
    }
  
    return formatted.trim();
}