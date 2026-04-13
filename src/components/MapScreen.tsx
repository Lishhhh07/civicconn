import { useState } from 'react';
import { RealGoogleMap } from './RealGoogleMap';
import { BottomNavigation } from './BottomNavigation';

interface MapScreenProps {
  onReportIssue: () => void;
  onNearbyIssues: () => void;
  onCommunity: () => void;
  onProfile: () => void;
}

export function MapScreen({ onReportIssue, onNearbyIssues, onCommunity, onProfile }: MapScreenProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'issues' | 'community' | 'profile'>('map');

  const handleTabChange = (tab: 'map' | 'issues' | 'community' | 'profile') => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'issues':
        onNearbyIssues();
        break;
      case 'community':
        onCommunity();
        break;
      case 'profile':
        onProfile();
        break;
      default:
        // Stay on map
        break;
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Full Screen Map */}
      <div className="flex-1">
        <RealGoogleMap
          onReportIssue={onReportIssue}
          onNearbyIssues={onNearbyIssues}
          onFullscreen={() => {
            // Handle fullscreen logic if needed
            console.log('Fullscreen requested');
          }}
        />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}