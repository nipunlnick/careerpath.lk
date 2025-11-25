#!/bin/bash
# Railway Deployment Script for CareerPath.lk Backend
# Run this script to deploy your backend to Railway

set -e  # Exit on any error

echo "🚀 Starting CareerPath.lk Backend Deployment to Railway"
echo "=================================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed"
fi

# Check if logged in
echo "🔐 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    echo "Please log in to Railway:"
    railway login
fi

echo "✅ Railway authentication successful"

# Initialize or link project
echo "📦 Setting up Railway project..."
read -p "Do you have an existing Railway project? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your Railway project ID: " PROJECT_ID
    railway link $PROJECT_ID
else
    echo "Creating new Railway project..."
    railway init
fi

# Set environment variables
echo "🔧 Setting up environment variables..."
echo "Please provide the following information:"

read -p "MongoDB Connection URI: " MONGODB_URI
read -p "Gemini API Key: " GEMINI_API_KEY  
read -p "Admin Key (leave empty to generate): " ADMIN_KEY
read -p "Frontend Domain (e.g., https://careerpath.lk): " FRONTEND_DOMAIN

# Generate admin key if not provided
if [ -z "$ADMIN_KEY" ]; then
    ADMIN_KEY="admin-$(date +%s)-$(openssl rand -hex 8)"
    echo "Generated admin key: $ADMIN_KEY"
fi

# Set environment variables
echo "Setting environment variables..."
railway env set NODE_ENV=production
railway env set MONGODB_URI="$MONGODB_URI"
railway env set MONGODB_DB=careerpath_lk
railway env set GEMINI_API_KEY="$GEMINI_API_KEY"
railway env set ADMIN_KEY="$ADMIN_KEY"
railway env set CORS_ORIGIN="$FRONTEND_DOMAIN,http://localhost:3000,http://localhost:5173"

echo "✅ Environment variables configured"

# Deploy the application
echo "🚀 Deploying application..."
railway up --detach

echo "⏳ Waiting for deployment to complete..."
sleep 30

# Get deployment URL
DEPLOYMENT_URL=$(railway domain | head -n 1)
echo "🌐 Deployment URL: $DEPLOYMENT_URL"

# Test health endpoint
echo "🏥 Testing health endpoint..."
if curl -f "$DEPLOYMENT_URL/health" > /dev/null 2>&1; then
    echo "✅ Health check passed!"
    echo "🎉 Deployment successful!"
    echo ""
    echo "Next steps:"
    echo "1. Test your API endpoints: $DEPLOYMENT_URL"
    echo "2. Update your frontend to use: $DEPLOYMENT_URL"
    echo "3. Initialize database: railway run tsx scripts/initDb.ts"
    echo "4. Seed sample data: railway run tsx scripts/seedData.ts"
    echo ""
    echo "Admin key for analytics: $ADMIN_KEY"
    echo "Save this key securely!"
else
    echo "❌ Health check failed. Check logs: railway logs"
fi

echo "=================================================="
echo "Deployment script completed!"