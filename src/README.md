# 🌟 Indian Civic Issue Reporting App

A futuristic neon-themed mobile-first civic issue reporting application built with React, TypeScript, and Tailwind CSS.

## 🗺️ Map Configuration

The app supports both **Google Maps** (live maps) and **beautiful fallback maps** (offline mode).

### Current Status: Offline Mode ✨
- The app currently uses stunning fallback maps with full functionality
- No API keys or billing required - works perfectly out of the box!
- All features (reporting, nearby issues, location pins) work seamlessly

### Enable Google Maps (Optional)

To enable live Google Maps integration:

1. **Get Google Maps API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a project and enable billing
   - Enable "Maps JavaScript API" and "Places API"
   - Create an API key

2. **Configure the App**
   - Open `/components/MapConfig.tsx`
   - Set `enableGoogleMaps: true`
   - Set `apiKey: 'your_actual_api_key_here'`
   - Set `fallbackMode: false`

3. **Save and Reload**
   - The app will automatically switch to Google Maps
   - Fallback maps remain as backup if anything fails

## ✨ Features

- **🎯 Smart Navigation**: Default to nearby issues list with prominent map access
- **📍 Real Location Maps**: Google Maps integration for individual issue locations  
- **🎨 Neon Design**: Futuristic UI with orange-cyan gradients and glassmorphism
- **📱 Mobile-First**: Optimized for mobile with responsive design
- **🔄 Robust Fallback**: Graceful fallback to offline maps when needed
- **⚡ Performance**: Fast loading with intelligent map loading strategies

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will automatically use offline maps - no configuration needed to get started!

## 🛠️ Architecture

- **React 18** with TypeScript
- **Tailwind CSS v4** for styling  
- **Motion/React** for animations
- **ShadCN/UI** components
- **Smart Map System** with automatic fallbacks

## 📂 Key Components

- `MapConfig.tsx` - Map configuration and API key management
- `RealGoogleMap.tsx` - Google Maps integration
- `FallbackMap.tsx` - Beautiful offline maps
- `MiniGoogleMap.tsx` - Individual issue location maps
- `NearbyIssuesScreen.tsx` - Issue list with map access

## 🎯 User Flow

1. **Home** → **Nearby Issues** (goes directly to issues list)
2. **Big Map Button** → Switch to full map view
3. **Individual Issues** → Show location on mini maps
4. **Seamless Experience** → Works with or without Google Maps

---

**Ready to use!** The app provides a complete civic reporting experience with beautiful maps, whether you configure Google Maps or not. 🚀