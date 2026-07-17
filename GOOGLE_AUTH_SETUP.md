# How to Set Up Real Google SSO Login (Resolve Error 401: invalid_client)

Google's authentication servers require every application to have a registered **Client ID** to authorize users. The error `Error 401: invalid_client` indicates that the placeholder Client ID in `.env.local` is not registered.

Follow these 5 simple steps to get your own Google Client ID for free:

---

### Step 1: Go to Google Cloud Console
1. Open the [Google Cloud Console Credentials Page](https://console.cloud.google.com/apis/credentials).
2. Sign in with your Google account.
3. If you don't have a project yet, click **Select a project** -> **New Project**, name it `WorkQuest-AI`, and click **Create**.

### Step 2: Configure Consent Screen (If asked)
If this is a new project, Google might ask you to configure the OAuth consent screen first:
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
6. Under **Authorized redirect URIs**, click **+ Add URI** and enter:
   - `http://localhost:3000`
7. Click **Create** at the bottom.

### Step 4: Add the Client ID to your project
1. Copy the **Client ID** shown in the popup (it looks like `xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`).
2. Open the [`.env.local`](file:///c:/Users/J%20Taj%20Kiran/Downloads/WorkQuest-AI/.env.local) file in the root folder of this project.
3. Replace the placeholder Client ID with your copied key:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_COPIED_CLIENT_ID.apps.googleusercontent.com
   ```

### Step 5: Restart the Server
1. Stop your terminal running `npm run dev` (press `Ctrl + C`).
2. Run it again to load the new environment variables:
   ```bash
   npm run dev
   ```
3. Refresh your browser and click **Google Account** again! It will load the official Google account picker window with your real device accounts.
