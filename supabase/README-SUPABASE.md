# Setup
- yarn supabase init
- yarn supabase login
- yarn add supabase
- yarn supabase link --project-ref <your-project-ref>  

## Edit Config.toml 
- update ports if there are more than one database 
- [db.seed]
- enabled = true
- sql_paths = ['./seeds/*.sql']  

## Start Database first time, should run migrations and seeds
yarn supabase start
or
yarn supabase start

## Check Supabase Setup with
yarn supabase status

## Current Setup
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

# Workflow
## Develop schema files
Write DDL Script in the folder ./supabase/schemas

## Develop seed files
Write DML Script in the folder ./supabase/seeds

## Create a migration step / file
yarn supabase migration new <name_migration>

## Edit migration file for creating DDL
Das leere Migration Scriptfile editieren mit create statements aus schema 

## Execute in local DB
yarn supabase migration up

## Edit migration file for changing Schame Objects with alter DDL Statements
Das leere Migration Scriptfile editieren mit Alter statements. Danach in den schema files die schema Objekte in der endgültigen Form beschreiben.

## Check status of migration files in local and remote
yarn supabase migration list 

## Compare local DB with migration files
yarn supabase db diff 

## Create migration file from difference
- yarn supabase db diff -f <your-migration-name-here>

## Apply migration file to remote 
yarn supabase migration up --linked   

## To reset local database
- Es wird alles zurückgesetzt und alle Migrations Files in der Reihenfolge und danach alle Seed Files werden ausgeführt.
- yarn supabase db reset

## Where the Migrations info is stored in the db
SELECT * FROM supabase_migrations.schema_migrations;