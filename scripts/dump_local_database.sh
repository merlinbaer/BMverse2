#!/bin/zsh

cd "$(dirname "$0")/.." || exit

mkdir -p ./supabase/.dump

yarn supabase db dump --local --schema public --file ./supabase/.dump/bmverse-ddl-$(date +"%Y-%m-%d").dmp
yarn supabase db dump --local --data-only --schema public --file ./supabase/.dump/bmverse-data-$(date +"%Y-%m-%d").dmp
