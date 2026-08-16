#!/bin/zsh
# Release script for web

set -e  # Abort script on error

# Change to the project root directory
cd "$(dirname "$0")/.." || exit

# Directory with the web build
DIST_DIR="dist"
# Directory for temporary ZIP files
ZIP_DIR="deploy/releases"
mkdir -p "$ZIP_DIR"

# 1. Read Expo version from app.json
APP_JSON="app.json"
APP_VERSION=$(jq -r '.expo.version' "$APP_JSON")
echo "Version read from $APP_JSON: $APP_VERSION"

# Set tag name (version only as requested)
TAG_NAME="v$APP_VERSION"
ZIP_FILE="web-release-$APP_VERSION.zip"
RELEASE_NAME="Release-Web $TAG_NAME"
RELEASE_BODY="Automatic release for web version $APP_VERSION"

# 2. Create ZIP archive from /dist
if [ ! -d "$DIST_DIR" ]; then
    echo "❌ Directory /dist not found. Please create web build first."
    exit 1
fi

echo "📦 Zipping content of $DIST_DIR -> $ZIP_DIR/$ZIP_FILE"
(cd "$DIST_DIR" && zip -r "../$ZIP_DIR/$ZIP_FILE" .)

# 3. Check if tag exists, otherwise create and push
echo "Planned Git tag: $TAG_NAME"

if git rev-parse "$TAG_NAME" >/dev/null 2>&1; then
  echo "❌ Tag $TAG_NAME already exists. Please increase version in app.json or delete tag."
  rm "$ZIP_DIR/$ZIP_FILE"
  exit 1
else
  echo "Creating new Git tag $TAG_NAME"
  git tag "$TAG_NAME"
  git push origin "$TAG_NAME"
fi

# 4. Create release with GitHub CLI and upload ZIP archive
echo "Creating GitHub release $RELEASE_NAME with file $ZIP_FILE"

gh release create "$TAG_NAME" "$ZIP_DIR/$ZIP_FILE" \
  --title "$RELEASE_NAME" \
  --notes "$RELEASE_BODY"

# 5. Delete ZIP file
rm "$ZIP_DIR/$ZIP_FILE"

# Done
echo "Release $TAG_NAME successfully created."
