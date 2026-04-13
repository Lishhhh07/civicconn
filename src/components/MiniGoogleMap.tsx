import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Navigation, MapPin } from 'lucide-react';
import { shouldUseGoogleMaps, getApiKey } from './MapConfig';

// Declare global google object
declare global {
  interface Window {
    google: any;
    initMiniMap: () => void;
  }
}

interface MiniGoogleMapProps {
  coordinates: { lat: number; lng: number };
  title: string;
  status: string;
  className?: string;
}

export function MiniGoogleMap({ coordinates, title, status, className = '' }: MiniGoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapLoadFailed, setMapLoadFailed] = useState(!shouldUseGoogleMaps()); // Start with fallback if Google Maps not configured

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return '#FF6B35';
      case 'verified': return '#4A90E2';
      case 'in-progress': return '#F5A623';
      case 'resolved': return '#22C55E';
      default: return '#6B7280';
    }
  };

  useEffect(() => {
    // Check configuration first
    if (!shouldUseGoogleMaps()) {
      setMapLoadFailed(true);
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      setMapLoadFailed(true);
      return;
    }

    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Check if script is already loading
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        // Script is already loading, wait for it
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkInterval);
            initializeMap();
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!window.google || !window.google.maps) {
            setMapLoadFailed(true);
          }
        }, 10000);
        return;
      }

      // Don't load another script if we already determined Google Maps should not be used
      console.log('Google Maps configured but script already determined unusable.');
      setMapLoadFailed(true);
    };

    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        const { Map } = await window.google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

        const map = new Map(mapRef.current, {
          center: coordinates,
          zoom: 16,
          disableDefaultUI: true,
          gestureHandling: 'none',
          mapId: "MINI_MAP_ID",
        });

        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.style.cssText = `
          width: 16px;
          height: 16px;
          background-color: ${getStatusColor(status)};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `;

        // Create marker
        const marker = new AdvancedMarkerElement({
          map: map,
          position: coordinates,
          content: markerElement,
          title: title,
        });

        mapInstanceRef.current = map;
        setIsMapLoaded(true);
      } catch (error) {
        console.error('Error initializing mini map:', error);
        // Check if it's a billing error
        if (error.message && error.message.includes('BillingNotEnabledMapError')) {
          console.warn('Google Maps billing not enabled for mini map. Using fallback.');
        }
        setMapLoadFailed(true);
        setIsMapLoaded(false);
      }
    };

    loadGoogleMapsAPI();

    return () => {
      if (window.initMiniMap) {
        delete window.initMiniMap;
      }
    };
  }, [coordinates, title, status]);

  // Fallback mini map
  if (mapLoadFailed) {
    return (
      <div className={`relative h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden border border-slate-600/50 ${className}`}>
        {/* Simulated map background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 20%, transparent 25%),
              linear-gradient(45deg, rgba(30,41,59,0.8) 0%, rgba(51,65,85,0.6) 100%)
            `,
          }}
        />
        
        {/* Map grid lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-0 right-0 h-px bg-slate-500/20" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-slate-500/20" />
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-slate-500/20" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-slate-500/20" />
        </div>

        {/* Issue location pin */}
        <div
          className="absolute w-4 h-4 rounded-full shadow-lg"
          style={{ 
            left: '50%', 
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: getStatusColor(status)
          }}
        >
          <MapPin className="text-white absolute inset-0 m-auto" size={8} />
        </div>

        {/* Location coordinates overlay */}
        <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
          <div className="text-xs text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded backdrop-blur-sm">
            {coordinates.lat.toFixed(4)}°, {coordinates.lng.toFixed(4)}°
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-5 w-5 p-0 text-slate-400 hover:text-white hover:bg-white/10"
          >
            <Navigation size={10} />
          </Button>
        </div>

        {/* Offline indicator */}
        <div className="absolute top-1 right-1">
          <div className="text-xs text-yellow-400 bg-yellow-900/50 px-1 py-0.5 rounded">
            Offline
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-24 bg-gray-100 rounded-lg overflow-hidden border border-slate-600/50 ${className}`}>
      {/* Google Maps Container */}
      <div ref={mapRef} className="absolute inset-0 w-full h-full" />

      {/* Loading State */}
      {!isMapLoaded && !mapLoadFailed && (
        <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <p className="text-slate-400 text-xs">Loading map...</p>
          </div>
        </div>
      )}

      {/* Location coordinates overlay */}
      <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
        <div className="text-xs text-slate-800 bg-white/90 px-2 py-0.5 rounded backdrop-blur-sm">
          {coordinates.lat.toFixed(4)}°, {coordinates.lng.toFixed(4)}°
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-5 w-5 p-0 text-slate-600 hover:text-slate-800 hover:bg-white/20"
          onClick={() => {
            // Open in Google Maps
            const url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
            window.open(url, '_blank');
          }}
        >
          <Navigation size={10} />
        </Button>
      </div>
    </div>
  );
}