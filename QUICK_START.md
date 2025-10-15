# Quick Start - Deployment

## 1. Set your OpenAI API key

```bash
export OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxx"
```

## 2. Deploy everything

```bash
./deploy.sh
```

That's it! ✅

---

## What happened?

1. ✅ Angular app built
2. ✅ Firebase Functions installed and built
3. ✅ OpenAI API key set in Firebase config (secure)
4. ✅ Deployed to Firebase

## API Endpoint

Your Cloud Function is available at:

```
https://serhii-deineko.web.app/api/chatCompletion
```

## Security ✅

- API key stored in Firebase Functions config (server-side)
- No CORS issues
- API key NOT exposed in browser
