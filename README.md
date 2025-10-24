<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1AkHqJcc7xCd_s2vc7COcBPf8l0iBF9_M

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables in [.env.local](.env.local):

   - Set the `GEMINI_API_KEY` to your Gemini API key
   - Configure Firebase credentials (see Firebase Setup section below)

3. Run the app:
   ```bash
   npm run dev
   ```

## Firebase Setup

This app uses Firebase for authentication. To enable user authentication:

1. **Quick Start:** See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed instructions
2. **Current Status:** Authentication is disabled by default with placeholder configuration
3. **Without Firebase:** The app will work in read-only mode (no user accounts/profiles)

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
# Required for AI features
GEMINI_API_KEY=your-gemini-api-key

# Required for authentication (optional for basic features)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
# ... other Firebase config
```

## Features

- 🎯 Interactive career assessment quiz
- 🗺️ Detailed career roadmaps for 80+ professions
- 🤖 AI-powered career insights and recommendations
- 👤 User profiles and progress tracking (requires Firebase)
- 🔍 Career exploration by skills, interests, and goals
- 📱 Responsive design for all devices
