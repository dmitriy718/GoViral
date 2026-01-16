# PostDoctor Social Media Integration Guide

This guide explains how to connect PostDoctor to your real social media accounts for automatic posting. You recently provided valid credentials for **Core Services** (OpenAI, NewsAPI, Firebase), so the system Engine is ready. Now you need to get the "Keys" for the social platforms.

## ✅ Current System Health Check
Before you begin, we verified your current core credentials:
- **OpenAI (AI Content)**: ✅ **Verified**. The system is generating real text.
- **NewsAPI (Trends)**: ✅ **Verified**. Converting real news into trends.
- **Firebase (Auth/DB)**: ✅ **Verified**. Securely connected to your project.

---

## 🛠️ How to Connect Social Platforms

Since PostDoctor is a "Developer App" (not yet verified by Meta/X), you must create your own "App" on each platform to get the API Keys.

### 1. Facebook & Instagram (Meta)
**Difficulty**: High | **Time**: 15 mins
1.  Go to [Meta for Developers](https://developers.facebook.com/).
2.  Click **My Apps** > **Create App**.
3.  Select **"Business"** as the type.
4.  Once created, add **"Facebook Login for Business"** product.
5.  In the Dashboard, copy the **app ID** and **App Secret**.
6.  *For Instagram*: You must link your Instagram Professional account to a Facebook Page. PostDoctor will post to Instagram *via* the Facebook Page connection.

### 2. X (formerly Twitter)
**Difficulty**: Medium | **Time**: 10 mins
1.  Go to the [X Developer Portal](https://developer.x.com/en/portal/dashboard).
2.  Sign up for "Free" access (limit 1,500 posts/month).
3.  Create a **New Project** > **Create App**.
4.  **Important**: Go to "User Authentication Settings" and enable **Read and Write** permissions.
5.  Go to "Keys and Tokens" tab.
6.  Generate **API Key**, **API Secret**, **Access Token**, and **Access Secret**.

### 3. LinkedIn
**Difficulty**: Low | **Time**: 5 mins
1.  Go to [LinkedIn Developers](https://www.linkedin.com/developers/).
2.  Click **Create App**. Link it to your LinkedIn Page.
3.  Go to the **"Products"** tab and "Request Access" for **"Share on LinkedIn"** and **"Sign In with LinkedIn"**.
4.  Go to **"Auth"** tab to find your **Client ID** and **Client Secret**.

### 4. Reddit
**Difficulty**: Low | **Time**: 5 mins
1.  Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps).
2.  Click **"are you a developer? create an app"**.
3.  Select **"script"**.
4.  Name it "PostDoctor".
5.  For "redirect uri", use `${APP_URL}/api/auth/reddit/callback` (replace `APP_URL` with the value in your `.env`).
6.  The code under the name is your **Client ID**, and the "secret" is your **Client Secret**.

### 5. Discord
**Difficulty**: Very Low | **Time**: 2 mins
1.  Go to [Discord Developer Portal](https://discord.com/developers/applications).
2.  Click **New Application**.
3.  Go to **Bot** tab -> **Reset Token** to get your Token.
4.  Turn on **"Message Content Intent"**.
5.  To add the bot to your server, go to **OAuth2** > **URL Generator**, checks "bot", and copy the link to invite it.

### 6. Slack
**Difficulty**: Medium | **Time**: 10 mins
1.  Go to [Slack API Apps](https://api.slack.com/apps).
2.  Click **Create New App** > **From scratch**.
3.  Go to **"OAuth & Permissions"**.
4.  Scroll to **Scopes** > **Bot Token Scopes** and add `chat:write`.
5.  Scroll up and click **"Install to Workspace"**.
6.  Copy the **"Bot User OAuth Token"** (starts with `xoxb-`).

---

## 🚀 Next Steps
Once you have these keys, you will add them to your `server/.env` file like this:
```env
TWITTER_API_KEY="your_key_here"
TWITTER_API_SECRET="your_secret_here"
LINKEDIN_CLIENT_ID="your_id_here"
...
```
Then PostDoctor can post automagically on your behalf!
