#!/bin/zsh
# run before npx eas-cli, so that it is available in the cache

set -e  # Abort script on error

# Change to the project root directory
cd "$(dirname "$0")/.." || exit

# Directory with ZIP files
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

echo "ZIP file: $ZIP_FILE"

# 4. Read Expo Version from app.json
cd ../..
APP_JSON="app.json"
APP_VERSION=$(jq -r '.expo.version' "$APP_JSON")
echo "Version read from $APP_JSON: $APP_VERSION"

# 5. Get last iOS BuildNumber from EAS
echo "Fetching last iOS BuildNumber from EAS build list..."

BUILD_INFO=$(npx eas-cli build:list \
  --platform ios \
  --status finished \
  --limit 1 \
  --json \
  --non-interactive)

IOS_BUILD_NUMBER=$(echo "$BUILD_INFO" | jq -r '.[0].appBuildVersion')

if [ "$IOS_BUILD_NUMBER" = "null" ] || [ -z "$IOS_BUILD_NUMBER" ]; then
  echo "No iOS BuildNumber found, using version only as tag."
  TAG_NAME="v$APP_VERSION"
else
  echo "Found iOS BuildNumber: $IOS_BUILD_NUMBER"
  TAG_NAME="v${APP_VERSION}-${IOS_BUILD_NUMBER}"
fi

RELEASE_NAME="Release-IOS $TAG_NAME"
RELEASE_BODY="Automatic release for version $APP_VERSION with iOS BuildNumber $IOS_BUILD_NUMBER"

# 6. Check if tag exists, otherwise create and push
echo "Planned Git Tag: $TAG_NAME"

if git rev-parse "$TAG_NAME" >/dev/null 2>&1; then
  echo "❌ Tag $TAG_NAME already exists. Please check for errors"
  echo "Delete tag in repo and locally if necessary"
  rm $ZIP_FILE
  exit 1
else
  echo "Creating new Git tag $TAG_NAME"
  git tag "$TAG_NAME"
  git push origin "$TAG_NAME"
fi

# 7. Create release with GitHub CLI and upload ZIP archive
echo "Creating GitHub Release $RELEASE_NAME with file $ZIP_FILE"

gh release create "$TAG_NAME" "$ZIP_DIR/$ZIP_FILE" \
  --title "$RELEASE_NAME" \
  --notes "$RELEASE_BODY"

# 8. Delete ZIP file
rm $ZIP_DIR/$ZIP_FILE

# Done
echo "Release $TAG_NAME successfully created."
