// Map configuration utility
export interface MapConfig {
  enableGoogleMaps: boolean;
  apiKey: string | null;
  fallbackMode: boolean;
}

// Default configuration - uses fallback maps to avoid billing errors
export const DEFAULT_MAP_CONFIG: MapConfig = {
  enableGoogleMaps: true, // Set to true and add API key to enable Google Maps
  apiKey: 'AIzaSyAFvyUJpV6-NKJzCBSB6eYKherEW2sCdkg', // Replace with 'YOUR_ACTUAL_API_KEY' to enable Google Maps
  fallbackMode: false, // Always show fallback maps by default
};

// Check if Google Maps should be enabled
export const shouldUseGoogleMaps = (): boolean => {
  const config = DEFAULT_MAP_CONFIG;

  // Only enable Google Maps if:
  // 1. enableGoogleMaps is true
  // 2. apiKey is provided and not a placeholder
  // 3. fallbackMode is disabled
  return (
    config.enableGoogleMaps &&
    config.apiKey !==null &&
    config.apiKey ==
      "AIzaSyAFvyUJpV6-NKJzCBSB6eYKherEW2sCdkg" &&
    config.apiKey ==
      "AIzaSyAFvyUJpV6-NKJzCBSB6eYKherEW2sCdkg" &&
    config.apiKey.length > 20 && // Basic validation
    !config.fallbackMode
  );
};

// Get API key if valid
export const getApiKey = (): string | null => {
  const config = DEFAULT_MAP_CONFIG;

  if (shouldUseGoogleMaps()) {
    return config.apiKey;
  }

  return null;
};

// Instructions for enabling Google Maps
export const GOOGLE_MAPS_SETUP_INSTRUCTIONS = `
To enable Google Maps:

1. Get a Google Maps API key from Google Cloud Console
2. Enable billing on your Google Cloud project
3. Enable the Maps JavaScript API and Places API
4. Update MapConfig.tsx:
   - Set enableGoogleMaps: true
   - Set apiKey: 'your_actual_api_key'
   - Set fallbackMode: false

Until then, the app uses beautiful fallback maps with full functionality.
`;