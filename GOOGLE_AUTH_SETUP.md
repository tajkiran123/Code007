# How to Set Up Google SSO Login (Resolve Error 401: invalid_client)

Google's authentication servers require every application to have a registered **Client ID** to authorize users. The error `Error 401: invalid_client` indicates that the Client ID configured in the environment variables is either unrecognized, deleted, or incorrect.

Follow these steps to configure real Google Sign-In for both local development and Vercel production:

---

### Step 1: Go to Google Cloud Console
1. Open the [Google Cloud Console Credentials Page](https://console.cloud.google.com/apis/credentials).
2. Sign in with your Google account.
3. If you don't have a project yet, click **Select a project** -> **New Project**, name it `WorkQuest-AI`, and click **Create**.

### Step 2: Configure Consent Screen (If asked)
If this is a new project, Google will ask you to configure the OAuth consent screen first:
1. Click **Configure Consent Screen**.
2. Select **External** and click **Create**.
3. Fill in the **App name** (e.g., `WorkQuest AI`) and **User support email** (your email).
4. Scroll down, fill in the **Developer contact information** (your email), and click **Save and Continue**.
5. Keep clicking **Save and Continue** until you return to the dashboard.

### Step 3: Create OAuth Client Credentials
1. On the left sidebar, click **Credentials**.
2. At the top, click **+ Create Credentials** and select **OAuth client ID**.
3. Select **Web application** under **Application type**.
4. In the **Name** field, type `WorkQuest Web Client`.
5. Under **Authorized JavaScript origins**, click **+ Add URI** and enter:
   - `http://localhost:3000`
   - `https://workquest-gamma.vercel.app`
6. Under **Authorized redirect URIs**, click **+ Add URI** and enter:
   - `http://localhost:3000`
   - `http://localhost:3000/api/auth/callback/google`
   - `https://workquest-gamma.vercel.app/api/auth/callback/google`
7. Click **Create** at the bottom.

---

### Step 4: Configure Environment Variables

Copy the **Client ID** and **Client Secret** shown in the popup.

#### 1. Local Development (`.env.local` & `backend/.env`)

Update the client ID in `.env.local` in the project root:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
```

Update the client ID in `backend/.env`:
```env
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

#### 2. Vercel Production Environment Variables

Add these environment variables to your project dashboard on Vercel:

| Environment Variable | Value |
|----------------------|-------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `YOUR_CLIENT_ID.apps.googleusercontent.com` |
| `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` | `https://workquest-gamma.vercel.app/api/auth/callback/google` |
| `GOOGLE_CLIENT_ID` | `YOUR_CLIENT_ID.apps.googleusercontent.com` |

If you decide to migrate to NextAuth later, you will also need:
- `GOOGLE_CLIENT_SECRET`: `YOUR_CLIENT_SECRET`
- `NEXTAUTH_URL`: `https://workquest-gamma.vercel.app`
- `NEXTAUTH_SECRET`: `YOUR_JWT_SECRET`

---

### Step 5: Restart and Test
1. Restart your local server (`npm run dev`) or redeploy to Vercel.
2. Click **Google Account** on the login page.
3. You will be redirected to Google's official account picker.
4. After signing in, you will be routed back to the dashboard.
