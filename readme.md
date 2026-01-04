# Welcome to my BABYMETAL world (myBMworld)

This is an [Expo](https://expo.dev) project.

Generate supabase types:
yarn supabase gen types typescript --project-id kqehjqspszhtcikfdodd > ./database.types.ts

Build a development build and run on default (Simulator):
yarn expo run:ios

Just start the development server:
yarn expo start

Create a full development build and upload it to a connected iPhone:
yarn expo run:ios --configuration Release --device

Managing environment variables with cli (better use the dashboard):
eas env:list, eas env:create, eas env:update, eas env:delete and eas env:pull commands.

Upload environment variables as secrets to the project (depreceated):
eas secret:push --scope project --env-file .env

Build in eas cloud for preparation uploading to Appstore or Testflight:
eas build --platform ios

Falls man ein ipa lokal builden möchte, dann mit (Achtung env funktioniert dann nur über das eas.json, nicht .env oder eas vault):
eas build -p ios --local

Submit to Appstore or Testflight:
eas submit --platform ios

## Get started

Fresh install:

- Globally - only one time: sudo yarn eas-cli
- Globally - only one time: eas login
- git clone ...
- optional: delete yarn.lock
- yarn install
- eas env:pull and add keys
- Sync the folder deploy with "Remote -> Local" with SFTP extension (configuration in .vscode sftp.json)

## Upgrades

- check installation with: yarn outdated
- control installed packages with: yarn list --depth=0
- Do very carfully upgrades with: yarn upgrade <package_name>
- Do downgrades to compatibilty with: yarn expo install --fix

## Deploy

- Save ipa file from expo as backup.
- run ./get_download_url.sh in the terminal
- Download ADP folder with files in Safari Browser into Download folder with Download URL.
- Move folder structure to deploy/releases (don't change any file)
- Add a new version with in deploy/Merlin Baer (Metal).json. Use https://altstudio.app to import and check new file. Don't use export. There is a Bug in altstudio.app!!! Patreon keys (there are 2) ar put in the json after export.
- Copy deploy/Merlin Baer (Metal).json to index.html
- Sync the folder deploy with "Local -> Remote" with SFTP extension (configuration in .vscode sftp.json)
- Commit and push last commit of this release (with new index.html)

## Release

- Run ./create_release.sh
