#!/bin/zsh
curl -v -X GET https://kqehjqspszhtcikfdodd.supabase.co/functions/v1/demo_job \
  -H "Authorization: Bearer 1234verylong" \
  -H "Content-Type: application/json" \
  -H "cron-job-id:1234"
