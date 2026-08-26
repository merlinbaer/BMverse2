# Setup

- yarn add supabase (install package)
- yarn supabase init (create project structure and config.toml)

- yarn supabase login (login in cloud environment, needed for linking)
- yarn supabase link --project-ref <your-project-ref>
- After starting the first time, migrations and seeds run automatically.   
  Add to .env EXPO_PUBLIC_SUPABASE_URL=http://<local_ip>:54321  
  Add to .env EXPO_PUBLIC_SUPABASE_KEY=
- max row changed from 1000 to 10.000 in production (in dashboard) and local (in config.toml)

## Edit Config.toml

- update ports if there are more than one database
- [db.seed]
- enabled = true
- sql_paths = ['./seeds/*.sql']

## Start Database first time, should run migrations and seeds

yarn supabase start or yarn supabase start

## Check Supabase Setup with

yarn supabase status

## Current Setup

🔧 Development Tools                 
Studio │ http://127.0.0.1:54323     
Mailpit │ http://127.0.0.1:54324     
MCP │ http://127.0.0.1:54321/mcp  
🌐 APIs                                              
Project URL │ http://127.0.0.1:54321              
REST │ http://127.0.0.1:54321/rest/v1      
GraphQL │ http://127.0.0.1:54321/graphql/v1   
Edge Functions │ http://127.0.0.1:54321/functions/v1  
⛁ Database                                                    
URL │ postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Workflow

## Develop schema files

Write DDL Script in the folder ./supabase/schemas

## Develop seed files

Write DML Script in the folder ./supabase/seeds

## Create a migration step / file

yarn supabase migration new <name_migration>

## Edit migration file for creating DDL

Edit the empty migration script file with create statements from schema

## Execute in local DB

yarn supabase migration up

## Edit the migration file for changing Schame Objects with alter DDL Statements

Edit the empty migration script file with Alter statements. Then describe the schema objects in their final form in the
schema files.

## Check the status of migration files in local and remote

yarn supabase migration list

## Compare local DB with migration files

yarn supabase db diff

## Create a migration file from a difference

- yarn supabase db diff -f <your-migration-name-here>

## Apply migration file to remote

yarn supabase migration up --linked

## To reset the local database

- Everything will be reset, and all migration files will be executed in order, followed by all seed files.
- yarn supabase db reset

## Where the Migrations info is stored in the db

SELECT * FROM supabase_migrations.schema_migrations;

## Reset Production

- Check Backups first
- yarn supabase db reset --linked

## Authentication / Emails / Confirm signup || Magic link or OTP || Reauthentication

<h2>Confirm your signup</h2>

<p>Enter this code to confirm your user:</p>
<p> {{ .Token }}</p>
<p></p>

<h2>Confirm your signin</h2>

<p>Enter this code to confirm your login:</p>
<p> {{ .Token }}</p>
<p></p>

<h2>Confirm reauthentication</h2>

<p>Enter the code: {{ .Token }}</p>
