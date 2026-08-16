#!/bin/zsh

# Prompt the user for input
read "input_value?Enter the ADP ID from Apple connect to append to the URL: "

# Base URL (no trailing slash unless needed)
BASE_URL="https://api.altstore.io/adps/"

# Construct the full URL
FULL_URL="${BASE_URL}${input_value}"

# Fetch JSON and extract the downloadURL key
download_url=$(curl -s "$FULL_URL" | jq -r '.downloadURL')

# Remove all backslashes
clean_url="${download_url//\\}"

# Output the final cleaned URL
echo "Download URL:"
echo "$clean_url"
