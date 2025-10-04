# 🔒 Security Configuration Guide

## Overview

This guide explains how to securely configure API keys and sensitive data in the Algebra Academy project.

## 🛡️ Security Principles

### Never Commit Secrets
- API keys, database URLs, and project IDs should NEVER be committed to version control
- Use environment variables for all sensitive configuration
- Use `.env.example` for sharing configuration templates

### Environment Variables
All sensitive data is managed through environment variables:

```bash
# Frontend (Vite)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Backend/Edge Functions
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
```

## 📋 Setup Process

### 1. Copy Environment Template
```bash
cp .env.example .env.local
```

### 2. Get Your API Keys

#### Supabase Keys
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings > API
4. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - Anon/Public key → `VITE_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`

#### Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy:
   - Publishable key → `VITE_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

### 3. Configure Edge Functions

In Supabase Dashboard > Edge Functions > Environment Variables:
```bash
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 🔍 Validation

### Automatic Setup Script
Run the setup script to validate your configuration:
```bash
bash scripts/setup-env.sh
```

### Manual Validation
Check that all variables are configured:
```bash
# Check frontend variables
echo $VITE_SUPABASE_URL
echo $VITE_STRIPE_PUBLISHABLE_KEY

# Check if .env.local exists and has real keys
grep -v "_HERE" .env.local
```

## 🚨 Security Checklist

### ✅ Required Security Measures
- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys in source code
- [ ] All keys use environment variables
- [ ] `.env.example` has placeholder values only
- [ ] Supabase config uses placeholders
- [ ] Deployment scripts use environment variables

### ❌ Security Violations to Avoid
- ❌ Hardcoded API keys in code
- ❌ Project IDs in repository files
- ❌ Real keys in documentation
- ❌ Committing `.env.local`
- ❌ Sharing keys in chat/email

## 🔧 Troubleshooting

### Environment Variables Not Loading
1. Restart development server: `npm run dev`
2. Check file name is exactly `.env.local`
3. Verify variables start with `VITE_` for frontend use
4. Check for syntax errors in .env file

### Keys Not Working
1. Verify keys are correct in Supabase/Stripe dashboard
2. Check for extra spaces or quotes
3. Ensure test keys for development environment
4. Verify Supabase project is active

### Deployment Issues
1. Set environment variables in production platform
2. Use production keys for production deployment
3. Verify Edge Function environment variables
4. Check CORS settings for production domain

## 📚 Best Practices

### Development
- Use test keys for all development
- Regularly rotate API keys
- Use different projects for dev/staging/production
- Never share development environment files

### Production
- Use production API keys only in production
- Set up proper monitoring and alerts
- Use secret management services when possible
- Implement key rotation policies

### Team Collaboration
- Share `.env.example` instead of real env files
- Document required environment variables
- Use team password managers for key sharing
- Set up proper access controls in API dashboards