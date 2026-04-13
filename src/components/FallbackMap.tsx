import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  Plus,
  X,
  Car,
  Droplets,
  Zap,
  Maximize2,
  List,
  MapPin
} from 'lucide-react';

interface MapIssue {
  id: string;
  title: string;
  category: 'roads' | 'water' | 'electricity';
  upvotes: number;
  coordinates: { x: number; y: number }; // Screen coordinates as percentages
}

interface FallbackMapProps {
  onReportIssue: () => void;
  onNearbyIssues: () => void;
  onFullscreen?: () => void;
}

export function FallbackMap({ onReportIssue, onNearbyIssues, onFullscreen }: FallbackMapProps) {
  const [selectedIssue, setSelectedIssue] = useState<MapIssue | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['roads', 'water', 'electricity']);

  const issues: MapIssue[] = [
    {
      id: '1',
      title: 'Pothole on MG Road',
      category: 'roads',
      upvotes: 24,
      coordinates: { x: 45, y: 35 }
    },
    {
      id: '2',
      title: 'Water pipe burst',
      category: 'water',
      upvotes: 18,
      coordinates: { x: 60, y: 55 }
    },
    {
      id: '3',
      title: 'Street light not working',
      category: 'electricity',
      upvotes: 12,
      coordinates: { x: 35, y: 65 }
    },
    {
      id: '4',
      title: 'Road crack near junction',
      category: 'roads',
      upvotes: 8,
      coordinates: { x: 25, y: 45 }
    },
    {
      id: '5',
      title: 'Power outage reported',
      category: 'electricity',
      upvotes: 15,
      coordinates: { x: 70, y: 25 }
    }
  ];

  const categoryConfig = {
    roads: { icon: Car, label: 'Roads', color: '#FF6B35' },
    water: { icon: Droplets, label: 'Water', color: '#4A90E2' },
    electricity: { icon: Zap, label: 'Electricity', color: '#F5A623' }
  };

  const filteredIssues = issues.filter(issue => activeFilters.includes(issue.category));

  const handleFilterToggle = (category: string) => {
    setActiveFilters(prev => 
      prev.includes(category) 
        ? prev.filter(f => f !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      {/* Static Map Background - Simulated Bangalore Map */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 relative">
          {/* Simulated roads */}
          <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-400"></div>
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400"></div>
          <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-400"></div>
          <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-gray-400"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-400"></div>
          <div className="absolute top-0 bottom-0 left-3/4 w-1 bg-gray-400"></div>
          
          {/* Simulated landmarks */}
          <div className="absolute top-1/3 left-1/3 w-8 h-8 bg-green-300 rounded-full flex items-center justify-center">
            <span className="text-xs">🏛️</span>
          </div>
          <div className="absolute top-2/3 right-1/3 w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center">
            <span className="text-xs">🏢</span>
          </div>
          
          {/* Map attribution */}
          <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs text-gray-600">
            Bangalore, Karnataka
          </div>
        </div>
      </div>

      {/* Offline Notice */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm flex items-center gap-2 max-w-xs text-center">
          <MapPin size={16} />
          <div>
            <div className="font-medium">Offline Map Mode</div>
            <div className="text-xs text-blue-600 mt-1">
              Configure Google Maps API in MapConfig.tsx for live maps
            </div>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="absolute top-16 left-4 right-4 z-20">
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

      {/* Issue Pins */}
      {filteredIssues.map((issue) => (
        <motion.div
          key={issue.id}
          className="absolute z-10 cursor-pointer"
          style={{
            left: `${issue.coordinates.x}%`,
            top: `${issue.coordinates.y}%`,
            transform: 'translate(-50%, -100%)'
          }}
          initial={{ scale: 0, y: -20 }}
          animate={{ 
            scale: 1,
            y: 0
          }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedIssue(selectedIssue?.id === issue.id ? null : issue)}
        >
          {/* Colored Pin */}
          <div className="relative">
            <div 
              className="w-6 h-6 rounded-full shadow-lg border-2 border-white flex items-center justify-center"
              style={{ backgroundColor: categoryConfig[issue.category].color }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            {/* Pin stem */}
            <div 
              className="absolute top-5 left-1/2 w-0.5 h-3 transform -translate-x-1/2"
              style={{ backgroundColor: categoryConfig[issue.category].color }}
            />
            {/* Pin point */}
            <div 
              className="absolute top-7 left-1/2 w-1 h-1 rounded-full transform -translate-x-1/2"
              style={{ backgroundColor: categoryConfig[issue.category].color }}
            />
          </div>
        </motion.div>
      ))}

      {/* Issue Popup Card */}
      <AnimatePresence>
        {selectedIssue && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute z-30"
            style={{
              left: `${selectedIssue.coordinates.x}%`,
              top: `${selectedIssue.coordinates.y - 15}%`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <Card className="bg-white shadow-xl border-0 min-w-[200px]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-medium mb-2">{selectedIssue.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {categoryConfig[selectedIssue.category].label} • {selectedIssue.upvotes} upvotes
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedIssue(null)}
                    className="text-gray-400 hover:text-gray-600 p-1 h-auto"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Popup arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Issue Counter */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white/90 text-gray-700 text-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200">
          <span className="font-medium">{filteredIssues.length}</span> issues shown
        </div>
      </div>
    </div>
  );
}