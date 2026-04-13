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
  List
} from 'lucide-react';
import exampleImage from 'figma:asset/342e78bf10452dc0f99aacd557953ccdbd7c6396.png';

interface MapIssue {
  id: string;
  title: string;
  category: 'roads' | 'water' | 'electricity';
  upvotes: number;
  coordinates: { x: number; y: number }; // Screen coordinates as percentages
}

interface GoogleStyleMapProps {
  onReportIssue: () => void;
  onNearbyIssues: () => void;
  onFullscreen?: () => void;
}

export function GoogleStyleMap({ onReportIssue, onNearbyIssues, onFullscreen }: GoogleStyleMapProps) {
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
    roads: { icon: Car, label: 'Roads' },
    water: { icon: Droplets, label: 'Water' },
    electricity: { icon: Zap, label: 'Electricity' }
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
    <div className="relative w-full h-full overflow-hidden">
      {/* Google Maps Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${exampleImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

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
          {/* Red Pin */}
          <div className="relative">
            <div className="w-8 h-8 bg-red-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            {/* Pin stem */}
            <div className="absolute top-6 left-1/2 w-0.5 h-4 bg-red-500 transform -translate-x-1/2" />
            {/* Pin point */}
            <div className="absolute top-9 left-1/2 w-1 h-1 bg-red-500 rounded-full transform -translate-x-1/2" />
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

      {/* Google attribution (simulated) */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white/90 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">
          Map data ©2025 Google
        </div>
      </div>
    </div>
  );
}