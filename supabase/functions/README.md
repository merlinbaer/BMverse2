
## Install development (Mac)
- brew install deno (nur einmal)
- yarn supabase init (nur beim erstenmal)
- yarn supabase login (wenn repo neu aufgesetzt wird)
- yarn supabase link (wenn repo neu aufgesetzt wird)
- yarn supabase start (nur beim erstenmal, oder wenn docker runtergefahren wurde)
  (dauert beim erstenmal. Einfach in der Docker GUI verfolgen was passiert)
- .env.sample nach supabase/functions als .env kopieren und ggf. benötigte API Keys eintragen.


## Clean install @supabase
- max row changed from 1000 to 10000 in production (in dashboard) and local (in config.toml)
- serve/run in test and deploy to production edge function ld_setlist
- serve/run in test and deploy to production edge function ld_setlist_upcoming
- serve/run in test and deploy to production edge function ld_youtube
- serve/run in test and deploy to production edge function bm_concert
- serve/run in test and deploy to production edge function bm_videos
- create API Keys for the jobs (in production)
- setup cron jobs for the edge functions with custom header cron-job-id and API Key (in production)


## supabase local development setup
🔧 Development Tools                 
 Studio  │ http://127.0.0.1:54333     
 Mailpit │ http://127.0.0.1:54334     
 MCP     │ http://127.0.0.1:54331/mcp   

🌐 APIs                                              
 Project URL    │ http://127.0.0.1:54331              
 REST           │ http://127.0.0.1:54331/rest/v1      
 GraphQL        │ http://127.0.0.1:54331/graphql/v1   
 Edge Functions │ http://127.0.0.1:54331/functions/v1  

⛁ Database                                                    
 URL │ postgresql://postgres:postgres@127.0.0.1:54332/postgres  


📦 Storage (S3)                                                               
 URL        │ http://127.0.0.1:54331/storage/v1/s3                             
 Region     │ local                                                            

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

## Kommandos
- yarn serv  

  Scriptkürzel für "yarn supabase functions serve --no-verify-jwt"  
  Stellt alle functions im functions folder für Aufrufe zur Verfügung.

- yarn supabase functions deploy --no-verify-jwt

  Scriptkürzel fürr "yarn supabase functions deploy".
  Deployed alle functions nach production

- yarn supabase secrets list

  Zeigt welche env variablen im Projekt zur Verfügung stehen. Mann kann die Variablen einzeln auch im Dashboard in "Project Settings" -> " Edge Functions" setzen. Oder auf einen Schlag mit dem Befehl: 

- yarn supabase secrets set --env-file <z.B. filename: .env im project hauptverzeichnis>

- deno check index.ts 
  Damit können zusätzliche Checks durchgeführt werden . Im Verzeichnis der Function aufrufen.

## Edge Function Aufrufe
Beispielaufrufe:
- GET Aufruf im Browser in development-env
  http://localhost:54321/functions/v1/hello?name=demo_job

- GET Aufruf im Browser in development-env
  http://<supabase_url>/functions/v1/hello?name=demo_job

- Für die Testumgebung gibt es test scripte im script folder welche den Aufruf mit curl starten (besseres Vorgehen als im Browser)

Im supabase project dashboard gibt e nach einem deploy mehr Infos und die functions können auch dort gelöscht werden und die logs (von console.log) können dort eingesehen werden:


## Known Issues
Open IDE in supabase/functions folder. Do not use in IDE at root folder.
 