#!/bin/sh
set -e

echo "🔄  Generating Prisma Client..."
npx prisma generate

echo "🔄  Syncing database schema..."
npx prisma db push

echo "🌱  Seeding demo data (idempotent)..."
npx tsx prisma/seed.ts

if [ "$NODE_ENV" = "production" ]; then
  echo "🚀  Starting production server..."
  exec node server.js
else
  echo "🛠️   Starting development server..."
  exec npm run dev
fi
