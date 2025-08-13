#!/bin/bash

# Vercel 배포 스크립트
# Usage: ./deploy.sh [project-name] [environment]
# Example: ./deploy.sh nohdolweb production

PROJECT=$1
ENV=${2:-preview}

if [ -z "$PROJECT" ]; then
    echo "❌ Error: Project name is required"
    echo "Usage: ./deploy.sh [project-name] [environment]"
    echo "Available projects:"
    for dir in */; do
        if [ -f "$dir/package.json" ] && [ "$dir" != "node_modules/" ]; then
            echo "  - ${dir%/}"
        fi
    done
    exit 1
fi

if [ ! -d "$PROJECT" ]; then
    echo "❌ Error: Project directory '$PROJECT' not found"
    exit 1
fi

echo "🚀 Deploying $PROJECT to $ENV environment..."

# 환경변수 체크
if [ ! -f "$PROJECT/.env.local" ] && [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: No .env.local file found"
    echo "Make sure environment variables are set in Vercel dashboard"
fi

# Vercel CLI 체크
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
fi

# 배포 실행
if [ "$ENV" = "production" ] || [ "$ENV" = "prod" ]; then
    echo "🏭 Deploying to production..."
    npm run deploy:$PROJECT:prod
else
    echo "👁️ Deploying preview..."
    npm run deploy:$PROJECT
fi

echo "✅ Deployment initiated for $PROJECT"