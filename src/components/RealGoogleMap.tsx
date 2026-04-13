import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { 
  Plus,
  Car,
  Droplets,
  Zap,
  List,
  Maximize2
} from 'lucide-react';
import { FallbackMap } from './FallbackMap';
import { shouldUseGoogleMaps, getApiKey, GOOGLE_MAPS_SETUP_INSTRUCTIONS } from './MapConfig';

// Declare global google object
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface MapIssue {
  id: string;
  title: string;
  category: 'roads' | 'water' | 'electricity';
  upvotes: number;
  coordinates: { lat: number; lng: number };
  description?: string;
}

interface RealGoogleMapProps {
  onReportIssue: () => void;
  onNearbyIssues: () => void;
  onFullscreen?: () => void;
}

export function RealGoogleMap({ onReportIssue, onNearbyIssues, onFullscreen }: RealGoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapLoadFailed, setMapLoadFailed] = useState(!shouldUseGoogleMaps()); // Start with fallback if Google Maps not configured
  const [activeFilters, setActiveFilters] = useState<string[]>(['roads', 'water', 'electricity']);

  // Sample issues for Bangalore
  const issues: MapIssue[] = [
    {
      id: '1',
      title: 'Pothole on MG Road',
      category: 'roads',
      upvotes: 24,
      coordinates: { lat: 12.9716, lng: 77.5946 }, // MG Road, Bangalore
      description: 'Large pothole causing traffic issues'
    },
    {
      id: '2',
      title: 'Water pipe burst near Metro Station',
      category: 'water',
      upvotes: 18,
      coordinates: { lat: 12.9698, lng: 77.5986 }, // Near MG Road Metro
      description: 'Water supply disrupted in the area'
    },
    {
      id: '3',
      title: 'Street light not working',
      category: 'electricity',
      upvotes: 12,
      coordinates: { lat: 12.9279, lng: 77.6271 }, // Koramangala
      description: 'Dark street poses safety risk'
    },
    {
      id: '4',
      title: 'Road crack near Cubbon Park',
      category: 'roads',
      upvotes: 8,
      coordinates: { lat: 12.9698, lng: 77.5937 }, // Cubbon Park area
      description: 'Developing crack needs immediate attention'
    },
    {
      id: '5',
      title: 'Power outage in Indiranagar',
      category: 'electricity',
      upvotes: 15,
      coordinates: { lat: 12.9719, lng: 77.6412 }, // Indiranagar
      description: 'Frequent power cuts affecting residents'
    },
    {
      id: '6',
      title: 'Water logging issue',
      category: 'water',
      upvotes: 22,
      coordinates: { lat: 12.9352, lng: 77.6245 }, // HSR Layout
      description: 'Drainage system blocked causing flooding'
    }
  ];

  const categoryConfig = {
    roads: { icon: Car, label: 'Roads', color: '#FF6B35' },
    water: { icon: Droplets, label: 'Water', color: '#4A90E2' },
    electricity: { icon: Zap, label: 'Electricity', color: '#F5A623' }
  };

  const filteredIssues = issues.filter(issue => activeFilters.includes(issue.category));

  // Load Google Maps API
  useEffect(() => {
    // Check configuration first
    if (!shouldUseGoogleMaps()) {
      console.log('Google Maps disabled or not configured. Using fallback map.');
      console.log(GOOGLE_MAPS_SETUP_INSTRUCTIONS);
      setMapLoadFailed(true);
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      console.warn('No valid Google Maps API key found. Using fallback map.');
      setMapLoadFailed(true);
      return;
    }

    // Set a timeout to fallback if maps don't load within 10 seconds
    const timeoutId = setTimeout(() => {
      if (!isMapLoaded) {
        console.warn('Google Maps API loading timeout. Using fallback map.');
        setMapLoadFailed(true);
      }
    }, 10000);

    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        clearTimeout(timeoutId);
        initializeMap();
        return;
      }

      // Only load if not already loading
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        console.log('Google Maps script already loading...');
        return;
      }

      // Create script with actual API key
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,places&loading=async&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = () => {
        clearTimeout(timeoutId);
        initializeMap();
      };
      
      // Handle script load errors
      script.onerror = () => {
        clearTimeout(timeoutId);
        console.warn('Google Maps script failed to load. Using fallback map.');
        setMapLoadFailed(true);
        setIsMapLoaded(false);
      };
      
      document.head.appendChild(script);
    };

    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        // Import the required libraries
        const { Map } = await window.google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

        const map = new Map(mapRef.current, {
          center: { lat: 12.9716, lng: 77.5946 }, // Bangalore center
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          mapId: "DEMO_MAP_ID", // Required for AdvancedMarkerElement
        });

        mapInstanceRef.current = map;
        setIsMapLoaded(true);
        addMarkers(map);
      } catch (error) {
        console.error('Error initializing map:', error);
        // Check if it's a billing error
        if (error.message && error.message.includes('BillingNotEnabledMapError')) {
          console.warn('Google Maps billing not enabled. Using fallback map.');
        }
        setMapLoadFailed(true);
        setIsMapLoaded(false);
      }
    };

    loadGoogleMapsAPI();

    return () => {
      // Cleanup
      clearTimeout(timeoutId);
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, []);

  // Update markers when filters change
  useEffect(() => {
    if (isMapLoaded && mapInstanceRef.current) {
      addMarkers(mapInstanceRef.current);
    }
  }, [activeFilters, isMapLoaded]);

  const addMarkers = async (map: any) => {
    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker.map) {
        marker.map = null; // For AdvancedMarkerElement
      }
    });
    markersRef.current = [];

    try {
      // Import the marker library
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

      // Add new markers
      filteredIssues.forEach(issue => {
        const categoryColor = categoryConfig[issue.category].color;
        
        // Create marker element with custom styling
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.cssText = `
          width: 24px;
          height: 24px;
          background-color: ${categoryColor};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          position: relative;
        `;

        // Create advanced marker
        const marker = new AdvancedMarkerElement({
          map: map,
          position: issue.coordinates,
          content: markerElement,
          title: issue.title,
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${issue.title}</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">${issue.description || 'No description available'}</p>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="background: ${categoryColor}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                  ${categoryConfig[issue.category].label}
                </span>
                <span style="color: #6b7280; font-size: 14px;">${issue.upvotes} upvotes</span>
              </div>
            </div>
          `
        });

        // Add click listener to marker
        marker.addListener('click', () => {
          // Close any open info windows
          markersRef.current.forEach(m => {
            if (m.infoWindow) {
              m.infoWindow.close();
            }
          });
          
          infoWindow.open(map, marker);
        });

        // Store reference to info window
        marker.infoWindow = infoWindow;
        markersRef.current.push(marker);
      });
    } catch (error) {
      console.error('Error adding markers:', error);
      // Fallback: could add basic DOM elements as markers
    }
  };

  const handleFilterToggle = (category: string) => {
    setActiveFilters(prev => 
      prev.includes(category) 
        ? prev.filter(f => f !== category)
        : [...prev, category]
    );
  };

  // If Google Maps failed to load, use fallback
  if (mapLoadFailed) {
    return (
      <FallbackMap
        onReportIssue={onReportIssue}
        onNearbyIssues={onNearbyIssues}
        onFullscreen={onFullscreen}
      />
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Google Maps Container */}
      <div ref={mapRef} className="absolute inset-0 w-full h-full" />

      {/* Loading State */}
      {!isMapLoaded && !mapLoadFailed && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
            <p className="text-gray-500 text-sm mt-2">Falls back to offline mode if unavailable</p>
          </div>
        </div>
      )}

      {/* Filter Pills */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex items-center gap-3">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon;
            const isActive = activeFilters.includes(key);
            
            return (
              <motion.button
                key={key}
                onClick={() => handleFilterToggle(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-white text-gray-700 shadow-lg border border-gray-200'
                    : 'bg-white/70 text-gray-500 border border-gray-300'
                }`}
                whileTap={{ scale: 0.95 }}
                style={{ backdropFilter: 'blur(10px)' }}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{config.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Nearby Issues Button */}
      <div className="absolute bottom-20 left-4 z-20">
        <motion.button
          onClick={onNearbyIssues}
          className="flex items-center gap-2 bg-white text-orange-500 px-4 py-3 rounded-full shadow-lg border border-gray-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <List size={20} />
          <span className="font-medium">Nearby Issues</span>
        </motion.button>
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-20 right-4 z-20">
        <motion.button
          onClick={onReportIssue}
          className="w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center"
          whileHover={{ 
            scale: 1.1,
            boxShadow: '0 8px 30px rgba(249, 115, 22, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -3, 0]
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <Plus size={24} />
        </motion.button>
      </div>

      {/* Fullscreen Button */}
      <div className="absolute bottom-4 right-4 z-20">
        <motion.button
          onClick={onFullscreen}
          className="w-10 h-10 bg-white text-gray-600 rounded-lg shadow-lg flex items-center justify-center border border-gray-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <Maximize2 size={16} />
        </motion.button>
      </div>

      {/* Map Attribution */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white/90 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">
          Map data ©2025 Google
        </div>
      </div>

      {/* Issue Counter */}
      <div className="absolute top-20 right-4 z-10">
        <div className="bg-white/90 text-gray-700 text-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200">
          <span className="font-medium">{filteredIssues.length}</span> issues shown
        </div>
      </div>
    </div>
  );
}