#!/bin/bash

echo "🚀 Attempting to deploy updated create-payment function..."

# Try different deployment methods
echo "Method 1: Direct Supabase CLI deployment"
npx supabase functions deploy create-payment --project-ref rnhibdbxfbminqseayos

echo "Method 2: Alternative deployment approach"
cd supabase/functions
npx supabase functions deploy create-payment

echo "✅ Deployment attempts completed"
echo "If deployment failed, the function may need to be manually updated via Supabase Dashboard"
