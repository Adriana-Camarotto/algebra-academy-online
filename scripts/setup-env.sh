#!/bin/bash

# 🔒 Secure Environment Setup Script
# This script helps configure environment variables safely

echo "🔒 Setting up secure environment configuration..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📋 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ .env.local created"
    echo "⚠️  Please edit .env.local with your actual keys"
else
    echo "✅ .env.local already exists"
fi

# Validate required environment variables
echo "🔍 Validating environment variables..."

required_vars=(
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY"
    "VITE_STRIPE_PUBLISHABLE_KEY"
    "STRIPE_SECRET_KEY"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env.local 2>/dev/null || grep -q "^$var=.*_HERE" .env.local 2>/dev/null; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
    echo "✅ All required environment variables are configured"
else
    echo "❌ Missing or incomplete environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "📝 Please configure these variables in .env.local:"
    echo "   1. Get Supabase keys from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api"
    echo "   2. Get Stripe keys from: https://dashboard.stripe.com/apikeys"
fi

# Check gitignore
if ! grep -q ".env.local" .gitignore 2>/dev/null; then
    echo "⚠️  Adding .env.local to .gitignore for security"
    echo ".env.local" >> .gitignore
fi

echo "🛡️  Security check complete!"
echo "📖 Next steps:"
echo "   1. Edit .env.local with your real API keys"
echo "   2. Never commit .env.local to version control"
echo "   3. Use .env.example for sharing configuration templates"