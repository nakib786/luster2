# Newsletter Google Sheets Integration Setup

This guide will help you connect your Luster & Co. newsletter subscription form to your Google Sheets for automatic email collection with backend duplicate verification.

## 📋 Prerequisites

- Google account with access to Google Sheets and Google Apps Script
- A Google Sheet for storing newsletter subscriptions

## 🚀 Step-by-Step Setup

### Step 1: Prepare Your Google Sheet

1. Create a new Google Sheet or use an existing one
2. Copy the Google Sheet ID from the URL (the long string between `/d/` and `/edit`)
3. Make sure the sheet is set to "Anyone with the link can edit" for the script to work

### Step 2: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)

2. Click **"New Project"**

3. Replace the default `Code.gs` content with the code from `google-apps-script.js` file in this project

4. **IMPORTANT**: Update the `SPREADSHEET_ID` constant with your actual Google Sheet ID:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_ACTUAL_SPREADSHEET_ID_HERE';
   ```

5. Save the project with a name like "Luster & Co. Newsletter API"

### Step 3: Deploy as Web App

1. In Google Apps Script, click **"Deploy"** → **"New Deployment"**

2. Choose type: **"Web app"**

3. Set the following configuration:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
   
4. Click **"Deploy"**

5. **Copy the Web App URL** - you'll need this for the next step

6. Grant necessary permissions when prompted

### Step 4: Update Your React App

1. Open `src/components/Footer.tsx`

2. Find the `handleNewsletterSubmit` function

3. Replace the current API URL with your new Web App URL:

```typescript
const webAppUrl = 'YOUR_WEB_APP_URL_HERE'; // Replace with your actual URL
```

### Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the footer newsletter section

3. Enter a test email and click "Subscribe"

4. Check your Google Sheet to see if the email was added

5. Try submitting the same email again to test duplicate prevention

## 🔧 Features

- ✅ **Email Validation**: Checks for valid email format
- ✅ **Backend Duplicate Prevention**: Prevents the same email from subscribing twice
- ✅ **Timestamp Tracking**: Records when each subscription occurred
- ✅ **Status Tracking**: Marks subscriptions as "Active"
- ✅ **Error Handling**: Provides user-friendly error messages
- ✅ **Auto Headers**: Automatically creates column headers if they don't exist
- ✅ **CORS Support**: Handles cross-origin requests properly

## 📊 Google Sheet Structure

Your sheet will automatically be organized as:

| Email | Timestamp | Status |
|-------|-----------|--------|
| user@example.com | 1/15/2024, 2:30:45 PM | Active |
| another@email.com | 1/15/2024, 3:15:22 PM | Active |

## 🛠️ Troubleshooting

### Common Issues:

1. **"Permission denied" error**
   - Make sure your Google Sheet is set to "Anyone with the link can edit"
   - Ensure the Apps Script is deployed with "Anyone" access

2. **CORS errors**
   - Google Apps Script handles CORS automatically when deployed as a web app

3. **Script not updating**
   - After making changes to the Apps Script, create a new deployment
   - Use the new deployment URL in your React app

4. **Emails not appearing in sheet**
   - Check the browser console for error messages
   - Verify the Web App URL is correct
   - Test the Apps Script directly in the editor

5. **Duplicate emails still being added**
   - Check that the SPREADSHEET_ID is correct in the script
   - Verify the sheet has the proper permissions

## 🔒 Security Notes

- The Google Apps Script runs with your permissions
- Only email addresses are collected (no sensitive data)
- Consider adding rate limiting for production use
- Monitor the script execution logs in Google Apps Script

## 📈 Analytics

You can track newsletter performance by:
- Counting total subscribers in your Google Sheet
- Monitoring subscription dates and times
- Exporting data for further analysis

---

**Need Help?** Check the Google Apps Script execution logs or browser console for detailed error messages.
