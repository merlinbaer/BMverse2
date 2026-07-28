// import { selectAllRows, selectRows } from "../_shared/global.ts";
import Job from '../_shared/joblib.ts'
import { SupabaseClient } from '@supabase/supabase-js'

// -- Demo of using the joblib library --
// Job-edge functions were called from cron (a supabase integration tool)
// A custom header has to be set in cron with a secret id
// The secret has to be set in production in the Project settings -> Edge Functions 
// The function is deployed with --no-verify-jwt, the tables are enabled with row level security and appropriate anon role policies.
// Jobs start with a new Job and a validation. Jobs end with await job.end(). Messages were logged with job.log(message).
// Errors are written with await job.error(message)
// For every started job, a row is inserted into the table "gl_jobs" with the status "STARTING".
// If the job ends fine, the entry is updated to the status OK. In case of an error, the entry is updated to the status ERROR.
// Logs are displayed in the edge functions log

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


    let data = null;
    try {
        data = await selectJobs(job.db);
        job.log("Success - " + data + " rows of table jobs selected")
    } catch (err) {
        await job.error("Error selecting data: " + JSON.stringify(err));
        return new Response("ERROR in Job-" + job.name, { status: 500 });
    }


    await job.end(`#Jobs: ${data}`)
    return new Response(`Job-${job.name}: OK`, { status: 200 });
})


async function selectJobs(connect: SupabaseClient) {
    const { data, error } = await connect
    .from('gl_jobs')
    .select('updated_at, name')         
    .order('updated_at', { ascending: false }); 
    if (error) {
        throw error;
    }
    return data.length;
}