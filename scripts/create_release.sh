#!/bin/zsh

set -e  # Script bei Fehler abbrechen

# Change to the project root directory
cd "$(dirname "$0")/.." || exit

# Verzeichnis mit ZIP-Dateien
ZIP_DIR="deploy/releases"

# 1. Change to the base directory
cd "$ZIP_DIR" || exit 1

# 2. Find the most recently modified folder (youngest directory)
youngest_folder=$(find . -type d -maxdepth 1 -mindepth 1 -print0 \
    | xargs -0 stat -f "%m %N" \
    | sort -rn \
    | head -n1 \
    | cut -d' ' -f2-)

# Remove leading ./ if present
youngest_folder=${youngest_folder#./}

# Check if the folder exists
if [ -z "$youngest_folder" ] || [ ! -d "$youngest_folder" ]; then
    echo "❌ No valid folder found."
    exit 1
fi

# Define output zip filename
ZIP_FILE="${youngest_folder}.zip"

# 3. Create the zip archive
echo "📦 Zipping folder: $youngest_folder -> $ZIP_FILE"
zip -r "$ZIP_FILE" "$youngest_folder"

echo "ZIP-Datei: $ZIP_FILE"

# 4. Expo Version aus app.json lesen
cd ../..
APP_JSON="app.json"
APP_VERSION=$(jq -r '.expo.version' "$APP_JSON")
echo "Version aus $APP_JSON gelesen: $APP_VERSION"

# 5. Letzten iOS BuildNumber von EAS holen
echo "Hole letzten iOS BuildNumber von EAS Build List..."

BUILD_INFO=$(eas build:list \
  --platform ios \
  --status finished \
  --limit 1 \
  --json \
  --non-interactive)

IOS_BUILD_NUMBER=$(echo "$BUILD_INFO" | jq -r '.[0].appBuildVersion')

if [ "$IOS_BUILD_NUMBER" = "null" ] || [ -z "$IOS_BUILD_NUMBER" ]; then
  echo "Kein iOS BuildNumber gefunden, benutze nur Version als Tag."
  TAG_NAME="v$APP_VERSION"
else
  echo "Gefundene iOS BuildNumber: $IOS_BUILD_NUMBER"
  TAG_NAME="v${APP_VERSION}-${IOS_BUILD_NUMBER}"
fi

RELEASE_NAME="Release $TAG_NAME"
RELEASE_BODY="Automatisches Release für Version $APP_VERSION mit iOS BuildNumber $IOS_BUILD_NUMBER"

# 6. Prüfen ob Tag existiert, sonst erstellen und pushen
echo "Geplanter Git Tag: $TAG_NAME"

if git rev-parse "$TAG_NAME" >/dev/null 2>&1; then
  echo "❌ Tag $TAG_NAME existiert bereits. Bitte Fehler prüfen"
  echo "Tag in Repo und Lokal ggf. loeschen"
  rm $ZIP_FILE
  exit 1
else
  echo "Erstelle neuen Git Tag $TAG_NAME"
  git tag "$TAG_NAME"
  git push origin "$TAG_NAME"
fi

# 7. Release mit GitHub CLI erstellen und ZIP hochladen
echo "Erstelle GitHub Release $RELEASE_NAME mit Datei $ZIP_FILE"

gh release create "$TAG_NAME" "$ZIP_DIR/$ZIP_FILE" \
  --title "$RELEASE_NAME" \
  --notes "$RELEASE_BODY"

# 8. ZIP file loeschen
rm $ZIP_DIR/$ZIP_FILE

# Done
echo "Release $TAG_NAME erfolgreich erstellt."
