# Deployment Guide

## Initial Setup

1. **Install Firebase CLI** (if not installed):

```bash
yarn global add firebase-tools
```

2. **Login to Firebase**:

```bash
firebase login
```

3. **Initialize Firebase** (if not done):

```bash
firebase init
```

Select:

- Functions
- Hosting

## Setting OpenAI API Key

### Production

```bash
export OPENAI_API_KEY="sk-proj-your-key-here"
firebase functions:config:set openai.api_key="$OPENAI_API_KEY"
```

### Verify config

```bash
firebase functions:config:get
```

## Deployment

### Deploy Everything (App + Functions)

```bash
export OPENAI_API_KEY="sk-proj-your-key-here"
./deploy.sh
```

### Deploy Only Functions

```bash
export OPENAI_API_KEY="sk-proj-your-key-here"
./deploy-functions.sh
```

### Deploy Only Hosting

```bash
yarn build
firebase deploy --only hosting
```

## Local Development

1. **Update environment.ts** with local URL:

```typescript
export const Environment = {
	production: false,
	API_URL: "http://localhost:5001/YOUR_PROJECT_ID/us-central1"
};
```

2. **Set local environment variable**:

```bash
export OPENAI_API_KEY="sk-proj-your-key-here"
```

3. **Run Firebase Emulator**:

```bash
firebase emulators:start
```

4. **Run Angular app**:

```bash
yarn start
```

## Security Notes

- ❌ **NEVER** commit `environment.ts` with real API keys
- ✅ API key is stored securely in Firebase Functions config
- ✅ All requests go through Firebase Functions (no CORS issues)
- ✅ API key is not exposed in client-side code
