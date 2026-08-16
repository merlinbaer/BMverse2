#!/bin/bash
# Script runs at webserver for creating a file with ios installations and web calls to workbox

# Konfiguration
LOG_FILES="/readonly/touchpi/logs/access_log /readonly/touchpi/logs/access_log.1"
TARGET_FILE_IOS="/signature"
TARGET_FILE_WEB="/workbox-window"
OUTPUT_FILE="/home/touchpi/bmverse/daily_install.txt"
WHICH_DAY="yesterday"

# 1. Apache-Suchformat (für grep): DD/Mon/YYYY
DATE_GREP=$(date -d "$WHICH_DAY" +"%d/%b/%Y")

# 2. Ausgabedatum: DD-MM-YYYY
DATE_OUTPUT=$(date -d "$WHICH_DAY" +"%d-%m-%Y")

# 3. Zugriff IOS zählen
COUNT_IOS=$(grep "$TARGET_FILE_IOS" $LOG_FILES | grep "app.bmverse.bruu.eu" | grep "$DATE_GREP" | wc -l)
COUNT_WEB=$(grep "$TARGET_FILE_WEB" $LOG_FILES | grep "bmverse2.bruu.eu" | grep "$DATE_GREP" | wc -l)

# 4.Ergebnis anhängen im Format: 12-07-2025,21,IOS
echo "$DATE_OUTPUT,$COUNT_IOS,IOS" >> "$OUTPUT_FILE"
echo "$DATE_OUTPUT,$COUNT_WEB,WEB" >> "$OUTPUT_FILE"
