# Firebase Setup Instructions

## Setting up Firebase Authentication

1. **Create a Firebase Project**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" or "Add project"
   - Name your project (e.g., "careerpath-lk")
   - Follow the setup wizard

2. **Enable Authentication**

   - In your Firebase project, go to **Authentication** in the left sidebar
   - Click **Get started**
   - Go to the **Sign-in method** tab
   - Enable **Google** as a sign-in provider
   - Add your domain (e.g., localhost:5173 for development) to authorized domains

3. **Get Project Configuration**

   - Go to **Project Settings** (gear icon in left sidebar)
   - Scroll down to **Your apps** section
   - Click on the **Web app** icon (</>) to create a web app
   - Register your app with a nickname (e.g., "careerpath-web")
   - Copy the `firebaseConfig` object

4. **Update Environment Variables**
   - Open `.env.local` file in your project root
   - Replace the placeholder values with your actual Firebase config:

```bash
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
VITE_FIREBASE_APP_ID=your-actual-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-actual-measurement-id
```

5. **Restart Development Server**
   ```bash
   npm run dev
   ```

## Security Notes

- Never commit real Firebase config to version control
- Use environment variables for all sensitive configuration
- The `.env.local` file is already in `.gitignore`

## Troubleshooting

If you see Firebase errors:

1. Check that all environment variables are set correctly
2. Ensure your Firebase project has Authentication enabled
3. Verify that your domain is in the authorized domains list
4. Restart the development server after changing environment variables
