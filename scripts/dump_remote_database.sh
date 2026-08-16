#!/bin/zsh

cd "$(dirname "$0")/.." || exit

mkdir -p ./supabase/.dump

yarn supabase db dump --schema public --file ./supabase/.dump/bmverse-remote-ddl-$(date +"%Y-%m-%d").dmp
yarn supabase db dump --data-only --schema public --file ./supabase/.dump/bmverse-remote-data-$(date +"%Y-%m-%d").dmp
