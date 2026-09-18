#!/bin/bash
#
# build_special_ios.sh
#
# Performs a special iOS production build (Apple Store) with temporary
# configuration values in app.json. Original values are guaranteed to be
# restored via trap upon success, failure, or interruption.
#

set -eo pipefail

# Determine project root and navigate there
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")/.." && pwd)"
cd "$PROJECT_ROOT" || exit 1

APP_JSON="$PROJECT_ROOT/app.json"

# Validate requirements
if [ ! -f "$APP_JSON" ]; then
  echo "❌ Error: $APP_JSON not found!" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "❌ Error: 'jq' command is required to parse and update app.json, but was not found." >&2
  exit 1
fi

# 1. Read and remember the three current values from app.json
ORIG_SLUG=$(jq -r '.expo.slug // empty' "$APP_JSON")
ORIG_BUNDLE_ID=$(jq -r '.expo.ios.bundleIdentifier // empty' "$APP_JSON")
ORIG_PROJECT_ID=$(jq -r '.expo.extra.eas.projectId // empty' "$APP_JSON")

if [ -z "$ORIG_SLUG" ] || [ -z "$ORIG_BUNDLE_ID" ] || [ -z "$ORIG_PROJECT_ID" ]; then
  echo "❌ Error: Failed to read required configuration values from $APP_JSON" >&2
  echo "   slug:                 ${ORIG_SLUG:-<missing>}" >&2
  echo "   ios.bundleIdentifier: ${ORIG_BUNDLE_ID:-<missing>}" >&2
  echo "   extra.eas.projectId:  ${ORIG_PROJECT_ID:-<missing>}" >&2
  exit 1
fi

echo "=========================================================="
echo "📱 iOS Special Production Build"
echo "=========================================================="
echo ""
echo "📋 Original app.json configuration:"
echo "   - slug:                 $ORIG_SLUG"
echo "   - ios.bundleIdentifier: $ORIG_BUNDLE_ID"
echo "   - extra.eas.projectId:  $ORIG_PROJECT_ID"

# Special-build values
SPECIAL_SLUG="BMverse"
SPECIAL_BUNDLE_ID="eu.bruu.bmverse2"
SPECIAL_PROJECT_ID="0a7070ee-efe5-4511-a358-2c25eb910808"

# Create a secure temporary backup of the original app.json
APP_JSON_BACKUP=$(mktemp "${TMPDIR:-/tmp}/app.json.bak.XXXXXX")
cp "$APP_JSON" "$APP_JSON_BACKUP"

CLEANED_UP=0
cleanup() {
  local exit_code=$?
  set +e
  if [ "$CLEANED_UP" -eq 1 ]; then
    return
  fi
  CLEANED_UP=1

  echo ""
  echo "=========================================================="
  echo "🔄 Restoring original configuration in $APP_JSON..."
  echo "=========================================================="

  if [ -n "$APP_JSON_BACKUP" ] && [ -f "$APP_JSON_BACKUP" ]; then
    cp "$APP_JSON_BACKUP" "$APP_JSON"
    rm -f "$APP_JSON_BACKUP"
  else
    # Fallback restoration using remembered original values
    local tmp_restore
    tmp_restore=$(mktemp "${TMPDIR:-/tmp}/app.json.restore.XXXXXX")
    jq --arg slug "$ORIG_SLUG" \
       --arg bundleId "$ORIG_BUNDLE_ID" \
       --arg projectId "$ORIG_PROJECT_ID" \
       '.expo.slug = $slug | .expo.ios.bundleIdentifier = $bundleId | .expo.extra.eas.projectId = $projectId' \
       "$APP_JSON" > "$tmp_restore" && mv "$tmp_restore" "$APP_JSON"
  fi

  # Verify and display restored values
  local restored_slug restored_bundle_id restored_project_id
  restored_slug=$(jq -r '.expo.slug' "$APP_JSON" 2>/dev/null || true)
  restored_bundle_id=$(jq -r '.expo.ios.bundleIdentifier' "$APP_JSON" 2>/dev/null || true)
  restored_project_id=$(jq -r '.expo.extra.eas.projectId' "$APP_JSON" 2>/dev/null || true)

  echo "   - slug:                 $restored_slug"
  echo "   - ios.bundleIdentifier: $restored_bundle_id"
  echo "   - extra.eas.projectId:  $restored_project_id"
  echo "✅ Original configuration restored successfully."
  echo "=========================================================="

  exit "$exit_code"
}

# Trap exit and interruption signals to guarantee restoration
trap 'cleanup' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
trap 'exit 129' HUP

# 2. Temporarily replace them with the special-build values in app.json
echo ""
echo "🔧 Applying temporary special-build configuration to $APP_JSON:"
echo "   - slug:                 $SPECIAL_SLUG"
echo "   - ios.bundleIdentifier: $SPECIAL_BUNDLE_ID"
echo "   - extra.eas.projectId:  $SPECIAL_PROJECT_ID"

TMP_MODIFIED=$(mktemp "${TMPDIR:-/tmp}/app.json.mod.XXXXXX")
jq --arg slug "$SPECIAL_SLUG" \
   --arg bundleId "$SPECIAL_BUNDLE_ID" \
   --arg projectId "$SPECIAL_PROJECT_ID" \
   '.expo.slug = $slug | .expo.ios.bundleIdentifier = $bundleId | .expo.extra.eas.projectId = $projectId' \
   "$APP_JSON" > "$TMP_MODIFIED"

mv "$TMP_MODIFIED" "$APP_JSON"

# Verify temporary values were applied correctly
CURRENT_SLUG=$(jq -r '.expo.slug' "$APP_JSON")
CURRENT_BUNDLE_ID=$(jq -r '.expo.ios.bundleIdentifier' "$APP_JSON")
CURRENT_PROJECT_ID=$(jq -r '.expo.extra.eas.projectId' "$APP_JSON")

if [ "$CURRENT_SLUG" != "$SPECIAL_SLUG" ] || \
   [ "$CURRENT_BUNDLE_ID" != "$SPECIAL_BUNDLE_ID" ] || \
   [ "$CURRENT_PROJECT_ID" != "$SPECIAL_PROJECT_ID" ]; then
  echo "❌ Error: Failed to apply temporary values to $APP_JSON!" >&2
  exit 1
fi
echo "✅ Temporary configuration verified."

# 3. Run: npx --yes eas-cli build -p ios --profile production --clear-cache
echo ""
echo "=========================================================="
echo "🚀 Starting EAS build..."
echo "   Command: npx --yes eas-cli build -p ios --profile production --clear-cache"
echo "=========================================================="
echo ""

set +e
echo "Print version"
npx eas-cli build:version:get -p ios
echo "Start Build. Do not abort, else submit will fail"
npx --yes eas-cli build -p ios --profile production --clear-cache "$@"
BUILD_EXIT_CODE=$?
set -e

if [ "$BUILD_EXIT_CODE" -eq 0 ]; then
  echo ""
  echo "🎉 EAS build completed successfully!"
else
  echo ""
  echo "⚠️ EAS build finished with exit code $BUILD_EXIT_CODE."
  # 4. Cleanup trap will execute on script exit and restore original configuration
  exit "$BUILD_EXIT_CODE"
fi

set +e
npx --yes eas-cli build -p ios --profile production --clear-cache "$@"
SUBMIT_EXIT_CODE=$?
set -e

if [ "$SUBMIT_EXIT_CODE" -eq 0 ]; then
  echo ""
  echo "🎉 EAS submit completed successfully!"
else
  echo ""
  echo "⚠️ EAS submit finished with exit code $SUBMIT_EXIT_CODE."
fi


# 4. Cleanup trap will execute on script exit and restore original configuration
exit "$SUBMIT_EXIT_CODE"

