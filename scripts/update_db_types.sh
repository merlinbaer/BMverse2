#!/bin/bash

# Navigate to the directory where the script is located, then go up one level to the project root
cd "$(dirname "$0")/.." || exit

# Define the target file path relative to project root
TARGET_FILE="./src/types/database.types.ts"
TMP_FILE="./src/types/database.types.ts.tmp"

echo "Generating Supabase types in $(pwd)..."

# 1. Run the command and capture output in a temporary file
yarn supabase gen types typescript --local > "$TMP_FILE"

if [ $? -eq 0 ]; then
    # 2. Extract content starting from the first 'export type Json'
    # This strips the CLI logs from the beginning of the file
    sed -n '/export type Json/,$p' "$TMP_FILE" | grep -vE "^Done|^yarn" > "$TARGET_FILE"
    
    # Clean up
    rm "$TMP_FILE"
    
    echo "✅ Database types updated successfully in $TARGET_FILE"
else
    echo "❌ Error: Failed to generate types."
    rm -f "$TMP_FILE"
    exit 1
fi
