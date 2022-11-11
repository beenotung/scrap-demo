#!/bin/bash
set -e
set -o pipefail

npx knex migrate:latest
npx auto-migrate db.sqlite3 < erd.txt
npx knex migrate:latest
npx erd-to-proxy < erd.txt > proxy.ts
