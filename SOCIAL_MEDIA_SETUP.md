# TikTok Integration Setup Guide

This guide explains how your website automatically fetches and displays ALL videos from your TikTok profile (@lusterandcompany) directly in each visitor's browser.

## 🚀 How It Works (Fully Automatic)

### Client-Side Video Fetching

Your website automatically:
- ✅ **Fetches videos for each visitor** - No server setup needed
- ✅ **Scrapes your TikTok profile** (@lusterandcompany) in real-time
- ✅ **Extracts all video URLs** from your profile page
- ✅ **Validates each video** using TikTok's official oEmbed API
- ✅ **Caches videos** for 30 minutes to improve performance
- ✅ **Updates automatically** when visitors refresh the page

### No Setup Required!

The system works out of the box:
1. **Start your development server**: `npm run dev`
2. **Visit your website** - Videos are fetched automatically
3. **That's it!** - Each visitor gets the latest videos from your TikTok profile

## 🔄 Automatic Updates

### For Each Visitor
- **First Visit**: Fetches fresh videos from your TikTok profile
- **Subsequent Visits**: Uses cached videos for fast loading
- **Background Updates**: Fetches fresh videos while showing cached ones
- **Manual Refresh**: Visitors can click refresh to get latest videos

### Caching System
- **Cache Duration**: 30 minutes per visitor
- **Storage**: Browser localStorage
- **Fallback**: Always shows cached videos if fresh fetch fails

## 🔧 Features

### Client-Side Processing
- **Real-time Fetching**: Each visitor gets the latest videos from your TikTok profile
- **No Server Required**: Everything happens in the visitor's browser
- **CORS Proxy**: Uses allorigins.win to bypass browser restrictions
- **Multiple Fallbacks**: Tries different methods to ensure videos load

### Automatic Data Fetching
The component uses [TikTok's official oEmbed API](https://developers.tiktok.com/doc/embed-videos/) to automatically fetch:
- Video title and description
- Author name and profile link
- Thumbnail image
- Proper embed code with TikTok's player

### Smart Caching
- **Fast Loading**: Shows cached videos immediately
- **Background Updates**: Fetches fresh videos without blocking the UI
- **Error Recovery**: Falls back to cached videos if fresh fetch fails
- **Automatic Expiry**: Cache expires after 30 minutes

### Responsive Design
- **Mobile**: 1 column layout
- **Tablet**: 2 column layout  
- **Desktop**: 3 column layout

### Interactive Elements
- Hover effects on video cards
- "View on TikTok" overlay buttons
- Direct links to your TikTok profile
- Manual refresh button for latest videos

## 🛠️ Troubleshooting

### Videos Not Loading
- **Check URLs**: Make sure your TikTok URLs are correct and accessible
- **Browser Console**: Check for any error messages in the developer console
- **CORS Issues**: The oEmbed API should work from any domain, but some corporate networks may block it
- **Video Privacy**: Ensure your TikTok videos are public (not private)

### Common Issues
1. **Invalid URL Format**: URLs must follow the pattern `https://www.tiktok.com/@username/video/VIDEO_ID`
2. **Network Errors**: Check your internet connection and try refreshing
3. **Rate Limiting**: TikTok may rate-limit requests if you have many videos

## 🎨 Customization

The component is fully customizable. You can modify:

### Styling
- **Colors**: Update Tailwind CSS classes in `SocialMediaSection.tsx`
- **Layout**: Change the grid structure (currently 1/2/3 columns)
- **Typography**: Modify text sizes and fonts

### Behavior  
- **Loading States**: Customize loading and error messages
- **Video Count**: Add as many videos as needed to the configuration
- **Profile Links**: Update the TikTok profile information

## 🔗 API Reference

This implementation uses TikTok's official oEmbed API:
- **Endpoint**: `https://www.tiktok.com/oembed`
- **Documentation**: [TikTok Embed Videos](https://developers.tiktok.com/doc/embed-videos/)
- **Rate Limits**: Standard web usage limits apply

## ✨ Benefits of This Approach

✅ **Official API**: Uses TikTok's official oEmbed endpoint  
✅ **Automatic Updates**: Video metadata is fetched dynamically  
✅ **No Manual Embedding**: Just add URLs, everything else is automatic  
✅ **Responsive**: Works perfectly on all devices  
✅ **Performance**: Optimized loading with proper error handling  
✅ **SEO Friendly**: Proper metadata and structured content
