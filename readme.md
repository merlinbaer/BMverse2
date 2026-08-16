# Welcome to BMVerse

This is an [Expo](https://expo.dev) project with BMverse 2 BMVerse 1 is at https://github.com/merlinbaer/BMverse

## Get started

Fresh install:

- Globally - only one time: sudo yarn eas-cli
- Globally - only one time: eas login
- git clone ...
- optional: delete yarn.lock
- yarn install
- yarn fix

## Enviromnment variables

### /.env (for developing environment)

create .env from .env.sample and get values from local docker supabase

### /.env.production (only needed for web production build)

create .env.production from .env.sample and get values from remote supabase dashboard

### EAS production build

The environment variables are in expo.dev dashboard (see commands for managing in Terminal)
Some variables are needed for supabase edge functions. Values are in keypass

### /supabase/functions/.env (for supabase edge functions)

create .env from .env.sample and get values from keypass

## Development IDE Setup

- This is a repository with two development environments.
- Open an IDE at the project root for the main development with TypeScript and supabase DDL.
- Open an IDE at supabase/functions for supabase edge function development.
- Both IDE environments will share the same git repo.

### Main Typescript environment (node)

- /package.json
- /tsconfig.json
- /babel.config.js
- /app.json
- /eas.json
- /metro.config.js

### Supabase edge function environment (deno)

You need a separate IDE in /supabase/functions. Setup is determined with deno.json config files.

## Important EAS commands

### Calling eas cli

eas will be called now locally (no global install/always newest version): "npx eas-cli ..." instead of "eas ..."

### 1. Build iOS for TestFlight

npx eas-cli build -p ios --profile production

### 2. Submit to TestFlight

npx eas-cli submit -p ios --profile production

### 3. Build web

yarn expo export --platform web --clear

### 4. Build and submit an expo go version to TestFlight (not the same as in simulator)

npx eas-cli go

## Commands

### Generate supabase types

/scripts/update_db_types.sh

### Build a development build and run on default (Simulator)

yarn ios

### Just start the development server

yarn start

### Create a development build and upload it to a connected iPhone

yarn iphone

### Managing environment variables with cli (better use the dashboard):

npx eas-cli env:list, eas env:create, eas env:update, eas env:delete and eas env:pull commands.

### Upload environment variables as secrets to the project (depreceated):

npx eas-cli secret:push --scope project --env-file .env

### Build in eas cloud for preparation uploading to Appstore or Testflight:

npx eas-cli build --platform ios

### If you want to build an ipa locally, then use (Note: env only works via eas.json then, not .env or eas vault):

npx eas-cli build -p ios --local

## Upgrades

- check installation with: yarn outdated
- control installed packages with: yarn list --depth=0
- Do very carfully upgrades with: yarn upgrade <package_name>
- Do downgrades to compatibilty with: yarn fix

## Deploy

### IOS

- Check compatibility with: yarn doctor
- Save ipa file from expo as backup.
- run ./get_download_url.sh in the terminal
- Download ADP folder with files in Safari Browser into Download folder with Download URL.
- Move folder structure to deploy/releases (don't change any file)
- Add a new version with in deploy/Merlin Baer (Metal).json. Use https://altstudio.app to import and check new file.
  Don't use export. There is a Bug in altstudio.app!!! Patreon keys (there are 2) ar put in the json after export.
- Copy deploy/Merlin Baer (Metal).json to index.html
- Sync the folder deploy with Remote Web Server
- Commit and push last commit of this release (with new index.html)

### Web

- yarn expo export --platform web --clear
- Sync /dist folder with Remote Web Server

## Release

- Run ./create_release_ios.sh
- Run ./create_release_web.sh
