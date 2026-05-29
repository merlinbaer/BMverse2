#!/bin/zsh

# Ensure the script exits on error
set -e

# Change to the project root directory
cd "$(dirname "$0")/.." || exit

# Create the seeds directory if it doesn't exist
mkdir -p ./supabase/seeds

# 1. Find the newest data dump file
LATEST_DUMP=$(ls -t ./supabase/.dump/bmverse-data-*.dmp | head -n 1)

if [ -z "$LATEST_DUMP" ]; then
  echo "Error: No dump file found in ./supabase/.dump/"
  exit 1
fi

echo "Extracting all INSERT blocks from: $LATEST_DUMP"

# List of tables to extract
TABLES=(
  "bm_event_concert"
  "bm_event_concert_songs"
  "bm_event_concert_upcoming"
  "bm_news"
  "bm_songs"
  "bm_videos"
)

for table in "${TABLES[@]}"; do
  echo "Processing $table..."

  # awk logic:
  # - Find lines matching the INSERT header for the table.
  # - Collect lines until we find a line ending EXACTLY with a semicolon (ignore whitespace).
  # - The regexp /;[[:space:]]*$/ ensures we don't stop on semicolons inside strings.
  awk "/INSERT INTO \"public\"\.\"${table}\"/,/;[[:space:]]*$/ {print}" "$LATEST_DUMP" > "./supabase/seeds/${table}.sql" || true

  # Check if the file is empty or only contains comments
  if [ ! -s "./supabase/seeds/${table}.sql" ]; then
    echo "Warning: No data found for $table."
    echo "-- No data found in dump for $table" > "./supabase/seeds/${table}.sql"
  fi
done

echo "Attempting to prettify seed files..."
# Ignore failures if prettier doesn't have an SQL plugin
yarn prettier --write "./supabase/seeds/*.sql" || echo "Prettier: Skipping formatting."

echo "Done! Seeds extracted to ./supabase/seeds/"