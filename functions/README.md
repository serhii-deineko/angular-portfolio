# Firebase Functions

## Setup

1. Install dependencies:

```bash
cd functions
yarn install
```

2. Set OpenAI API key:

```bash
export OPENAI_API_KEY="your-api-key-here"
firebase functions:config:set openai.api_key="$OPENAI_API_KEY"
```

3. Build:

```bash
yarn build
```

## Deploy

Deploy only functions:

```bash
../deploy-functions.sh
```

Deploy everything (app + functions):

```bash
../deploy.sh
```

## Local Development

Run emulator:

```bash
firebase emulators:start
```

The function will be available at:
`http://localhost:5001/YOUR_PROJECT_ID/us-central1/chatCompletion`
