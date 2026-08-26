
## Install development (Mac)
- brew install deno (only once)
- Copy .env.sample to supabase/functions as .env and enter any required API keys if necessary.


## Clean install @supabase
- max row changed from 1000 to 10000 in production (in dashboard) and local (in config.toml)
- serve/run in test and deploy to production edge function ld_setlist
- serve/run in test and deploy to production edge function ld_setlist_upcoming
- serve/run in test and deploy to production edge function ld_youtube
- serve/run in test and deploy to production edge function bm_concert
- serve/run in test and deploy to production edge function bm_videos
- create API Keys for the jobs (in production)
- setup cron jobs for the edge functions with custom header cron-job-id and API Key (in production)

## Documenmtation URL
https://supabase.com/docs/guides/functions/quickstart


## Needed Visual Studio Extensions
- Deno
- Deno-vscode
- Deno VS Code Extension Pack
- Deno Standard Library Snippets
- Optional: Code Runner (for starting shell script from ide)

## Needed Jetbrains plugins
- Deno

## Commands
- yarn serv  
Script shortcut for "yarn supabase functions serve --no-verify-jwt"      
Makes all functions in the functions folder available for calls.   
Run test scripts in the main project ide

- yarn supabase functions deploy --no-verify-jwt
Script shortcut for "yarn supabase functions deploy".    
Deploys all functions to production   

- yarn supabase secrets list
Shows which env variables are available in the project.  
You can also set the variables individually in the dashboard under "Project Settings" -> "Edge Functions".   
Or all at once with the command: 

- yarn supabase secrets set --env-file <e.g. filename: .env in project root directory>

- deno check index.ts 
  This allows additional checks to be carried out. Run in the function directory.

## Edge Function Calls
Example calls:
- GET call in the browser in development-env
  http://localhost:54321/functions/v1/hello?name=demo_job

- GET call in the browser in development-env
  http://<supabase_url>/functions/v1/hello?name=demo_job

- For the test environment, there are test scripts in the script folder that start the call with curl (better approach than in the browser)

In the supabase project dashboard, there is more info after a deploy and the functions can also be deleted there and the logs (from console.log) can be viewed there:


## Known Issues
Open IDE in supabase/functions folder. Do not use in IDE at root folder.
 