#!/bin/bash

echo "🏗️  Building Angular app..."
yarn build:ssr

echo "🔧 Installing functions dependencies..."
cd functions
yarn install

echo "🏗️  Building functions..."
yarn build
cd ..

echo "🔑 Setting OpenAI API key..."
firebase functions:config:set openai.api_key="$OPENAI_API_KEY"

echo "🚀 Deploying to Firebase..."
firebase deploy

echo "✅ Deployment complete!"

