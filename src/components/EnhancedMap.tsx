import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { 
  Plus,
  Filter,
  X,
  ArrowUp,
  Car,
  Droplets,
  Zap,
  Building,
  AlertTriangle,
  Trash2,
  Navigation,
  Layers
} from 'lucide-react';

// Using a simple map implementation since Leaflet requires external CDN
interface MapIssue {
  id: string;
  title: string;
  category: 'roads' | 'water' | 'electricity' | 'infrastructure' | 'safety' | 'waste';
  status: 'reported' | 'verified' | 'in-progress' | 'resolved';
  upvotes: number;
  location: string;
  coordinates: { lat: number; lng: number };
  isUpvoted: boolean;
}

interface EnhancedMapProps {
  onReportIssue: () => void;
  issues: MapIssue[];
  onUpvote: (issueId: string) => void;
}

export function EnhancedMap({ onReportIssue, issues, onUpvote }: EnhancedMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedIssue, setSelectedIssue] = useState<MapIssue | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['roads', 'water', 'electricity', 'infrastructure', 'safety', 'waste']);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const categoryConfig = {
    roads: { icon: Car, color: 'from-orange-500 to-orange-600', name: 'Roads' },
    water: { icon: Droplets, color: 'from-blue-500 to-cyan-500', name: 'Water' },
    electricity: { icon: Zap, color: 'from-yellow-500 to-orange-400', name: 'Electricity' },
    infrastructure: { icon: Building, color: 'from-purple-500 to-pink-500', name: 'Infrastructure' },
    safety: { icon: AlertTriangle, color: 'from-red-500 to-red-600', name: 'Safety' },
    waste: { icon: Trash2, color: 'from-green-500 to-lime-500', name: 'Waste' }
  };

  const handleFilterToggle = (category: string) => {
    setActiveFilters(prev => 
      prev.includes(category) 
        ? prev.filter(f => f !== category)
        : [...prev, category]
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const filteredIssues = issues.filter(issue => activeFilters.includes(issue.category));

  const getIssueScreenPosition = (coordinates: { lat: number; lng: number }) => {
    // Convert lat/lng to screen coordinates (simplified for demo)
    const baseX = ((coordinates.lng - 77.5) * 100) + 50; // Bangalore lng range
    const baseY = ((12.95 - coordinates.lat) * 100) + 50; // Bangalore lat range
    
    return {
      x: (baseX * zoom) + panOffset.x,
      y: (baseY * zoom) + panOffset.y
    };
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPanOffset({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, dragStart]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-900">
      {/* Filter Bar */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-3 shadow-2xl">
          <Filter size={18} className="text-slate-400 mr-2" />
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon;
            const isActive = activeFilters.includes(key);
            
            return (
              <motion.button
                key={key}
                onClick={() => handleFilterToggle(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
                }`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <Icon size={14} />
                <span className="text-sm">{config.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="flex flex-col bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden shadow-xl">
          <Button
            onClick={handleZoomIn}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-slate-700/50 rounded-none"
          >
            +
          </Button>
          <div className="border-t border-slate-700/50" />
          <Button
            onClick={handleZoomOut}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-slate-700/50 rounded-none"
          >
            −
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 text-white hover:bg-slate-700/50 rounded-xl"
        >
          <Navigation size={16} />
        </Button>
      </div>

      {/* Map Canvas */}
      <div 
        ref={mapRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          backgroundImage: `
            linear-gradient(90deg, rgba(51, 65, 85, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(51, 65, 85, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.05) 0%, transparent 70%),
            linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)
          `,
          backgroundSize: '50px 50px, 50px 50px, 200px 200px, 100% 100%',
          transformOrigin: 'center center'
        }}
      >
        {/* Bangalore City Simulation */}
        <div className="absolute inset-0">
          {/* Major Roads */}
          <div className="absolute top-1/3 left-0 right-0 h-1 bg-slate-600/30 rounded-full" />
          <div className="absolute top-2/3 left-0 right-0 h-1 bg-slate-600/30 rounded-full" />
          <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-slate-600/30 rounded-full" />
          <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-slate-600/30 rounded-full" />
          
          {/* Area Labels */}
          <div className="absolute top-16 left-16 text-slate-500 text-sm bg-slate-800/50 px-2 py-1 rounded backdrop-blur-sm">
            Indiranagar
          </div>
          <div className="absolute top-20 right-20 text-slate-500 text-sm bg-slate-800/50 px-2 py-1 rounded backdrop-blur-sm">
            MG Road
          </div>
          <div className="absolute bottom-20 left-20 text-slate-500 text-sm bg-slate-800/50 px-2 py-1 rounded backdrop-blur-sm">
            HSR Layout
          </div>
          <div className="absolute bottom-16 right-16 text-slate-500 text-sm bg-slate-800/50 px-2 py-1 rounded backdrop-blur-sm">
            Koramangala
          </div>
        </div>

        {/* Issue Markers */}
        {filteredIssues.map((issue) => {
          const position = getIssueScreenPosition(issue.coordinates);
          const config = categoryConfig[issue.category];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={issue.id}
              className="absolute"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: [0, -5, 0]
              }}
              transition={{ 
                duration: 0.5,
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{ scale: 1.2, zIndex: 10 }}
            >
              <motion.button
                onClick={() => setSelectedIssue(issue)}
                className={`relative w-8 h-8 rounded-full bg-gradient-to-r ${config.color} shadow-2xl border-2 border-white/30 flex items-center justify-center cursor-pointer`}
                whileTap={{ scale: 0.9 }}
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0.4)',
                    '0 0 0 10px rgba(59, 130, 246, 0)',
                    '0 0 0 0 rgba(59, 130, 246, 0.4)',
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <Icon size={14} className="text-white" />
                
                {/* Pin Stem */}
                <div className="absolute top-full left-1/2 w-0.5 h-4 bg-gradient-to-b from-current to-transparent transform -translate-x-1/2" />
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Action Button */}
      <motion.button
        onClick={onReportIssue}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-gradient-to-r from-orange-500 to-cyan-400 rounded-full shadow-2xl flex items-center justify-center"
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 0 30px rgba(249, 115, 22, 0.4)'
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
        <Plus size={24} className="text-white" />
      </motion.button>

      {/* Issue Details Popup */}
      <AnimatePresence>
        {selectedIssue && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-20 left-4 right-4 z-40"
          >
            <Card className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`bg-gradient-to-r ${categoryConfig[selectedIssue.category].color} text-white border-0`}>
                        {selectedIssue.category}
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {selectedIssue.status}
                      </Badge>
                    </div>
                    <h3 className="text-white mb-1">{selectedIssue.title}</h3>
                    <p className="text-slate-400 text-sm mb-3">📍 {selectedIssue.location}</p>
                    
                    <div className="flex items-center gap-3">
                      <motion.button
                        onClick={() => onUpvote(selectedIssue.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                          selectedIssue.isUpvoted
                            ? 'bg-gradient-to-r from-orange-500 to-cyan-400 text-white shadow-lg'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                        }`}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.div
                          animate={selectedIssue.isUpvoted ? {
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.2, 1]
                          } : {}}
                          transition={{ duration: 0.6 }}
                        >
                          <ArrowUp size={16} />
                        </motion.div>
                        <span className="text-sm">{selectedIssue.upvotes} upvotes</span>
                      </motion.button>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setSelectedIssue(null)}
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50 ml-2"
                  >
                    <X size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-3 shadow-xl">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Layers size={14} />
            <span>{filteredIssues.length} issues shown</span>
          </div>
        </div>
      </div>
    </div>
  );
}