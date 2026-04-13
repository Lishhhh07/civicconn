import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  X, 
  MapPin, 
  Maximize2, 
  Minimize2,
  Navigation,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface MapPin {
  id: string;
  x: string;
  y: string;
  status: 'reported' | 'verified' | 'in-progress' | 'resolved';
  title: string;
  location: string;
  category: string;
}

interface InteractiveMapProps {
  onPinClick?: (pin: MapPin) => void;
}

export function InteractiveMap({ onPinClick }: InteractiveMapProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const pins: MapPin[] = [
    {
      id: '1',
      x: '25%',
      y: '35%',
      status: 'reported',
      title: 'Garbage accumulation',
      location: 'Indiranagar',
      category: 'Waste Management'
    },
    {
      id: '2',
      x: '45%',
      y: '55%',
      status: 'verified',
      title: 'Pothole on main road',
      location: 'Koramangala',
      category: 'Road Infrastructure'
    },
    {
      id: '3',
      x: '65%',
      y: '40%',
      status: 'in-progress',
      title: 'Streetlight not working',
      location: 'MG Road',
      category: 'Street Lighting'
    },
    {
      id: '4',
      x: '35%',
      y: '70%',
      status: 'resolved',
      title: 'Water pipe leakage',
      location: 'HSR Layout',
      category: 'Water Supply'
    },
    {
      id: '5',
      x: '55%',
      y: '25%',
      status: 'reported',
      title: 'Broken footpath',
      location: 'Whitefield',
      category: 'Infrastructure'
    },
    {
      id: '6',
      x: '75%',
      y: '65%',
      status: 'verified',
      title: 'Traffic signal malfunction',
      location: 'Electronic City',
      category: 'Traffic Management'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'from-orange-500 to-orange-600';
      case 'verified': return 'from-blue-500 to-cyan-500';
      case 'in-progress': return 'from-yellow-500 to-orange-400';
      case 'resolved': return 'from-green-500 to-lime-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const handlePinClick = (pin: MapPin) => {
    setSelectedPin(pin);
    onPinClick?.(pin);
  };

  return (
    <>
      {/* Regular Map View */}
      {!isExpanded && (
        <div className="relative h-64 bg-gradient-to-br from-slate-700 to-slate-800 m-4 rounded-2xl overflow-hidden group cursor-pointer">
          <div 
            className="absolute inset-0 bg-slate-600/20"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 35%, rgba(255,165,0,0.1) 15%, transparent 20%),
                radial-gradient(circle at 45% 55%, rgba(0,191,255,0.1) 15%, transparent 20%),
                radial-gradient(circle at 65% 40%, rgba(255,255,0,0.1) 15%, transparent 20%),
                radial-gradient(circle at 35% 70%, rgba(50,205,50,0.1) 15%, transparent 20%),
                linear-gradient(45deg, rgba(30,41,59,0.8) 0%, rgba(51,65,85,0.6) 100%)
              `,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Bangalore city outline simulation */}
            <div className="absolute inset-4 border border-slate-500/30 rounded-lg">
              <div className="absolute top-2 left-2 text-slate-400 text-xs">
                Bangalore
              </div>
              
              {/* Major areas labels */}
              <div className="absolute top-4 left-8 text-slate-500 text-xs">Whitefield</div>
              <div className="absolute top-12 right-8 text-slate-500 text-xs">MG Road</div>
              <div className="absolute bottom-8 left-6 text-slate-500 text-xs">HSR Layout</div>
              <div className="absolute bottom-4 right-6 text-slate-500 text-xs">Electronic City</div>
              <div className="absolute top-8 left-1/3 text-slate-500 text-xs">Indiranagar</div>
              <div className="absolute bottom-1/3 left-1/2 text-slate-500 text-xs">Koramangala</div>
            </div>

            {/* Map pins */}
            {pins.map((pin, i) => (
              <motion.div
                key={pin.id}
                className={`absolute w-4 h-4 rounded-full bg-gradient-to-r ${getStatusColor(pin.status)} shadow-lg cursor-pointer`}
                style={{ left: pin.x, top: pin.y }}
                onClick={() => handlePinClick(pin)}
                animate={{
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(34, 197, 94, 0)',
                    '0 0 0 8px rgba(34, 197, 94, 0.2)',
                    '0 0 0 0 rgba(34, 197, 94, 0)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                whileHover={{ scale: 1.5, zIndex: 10 }}
              />
            ))}

            {/* Trail dot cursor - Blue */}
            {isHovering && (
              <motion.div
                className="absolute w-2 h-2 bg-blue-400 rounded-full pointer-events-none z-20"
                style={{ 
                  left: cursorPosition.x - 4, 
                  top: cursorPosition.y - 4,
                  position: 'fixed'
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0.4, 0.8],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              />
            )}
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
          
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-sm opacity-80">Interactive Map</p>
            <p className="text-xs opacity-60">Tap to expand • Click pins for details</p>
          </div>

          <Button
            onClick={() => setIsExpanded(true)}
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 bg-slate-800/70 text-slate-300 border-slate-600 hover:bg-slate-700/70 backdrop-blur-sm"
          >
            <Maximize2 size={16} />
          </Button>
        </div>
      )}

      {/* Expanded Map Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm"
          >
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
                <div>
                  <h2 className="text-white text-lg">Bangalore Civic Issues Map</h2>
                  <p className="text-slate-400 text-sm">{pins.length} issues reported</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 rounded-xl"
                  >
                    <ZoomIn size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 rounded-xl"
                  >
                    <ZoomOut size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 rounded-xl"
                  >
                    <Navigation size={20} />
                  </Button>
                  <Button
                    onClick={() => setIsExpanded(false)}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 rounded-xl"
                  >
                    <Minimize2 size={20} />
                  </Button>
                </div>
              </div>

              {/* Expanded Map */}
              <div className="flex-1 relative">
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 25% 35%, rgba(255,165,0,0.15) 20%, transparent 25%),
                      radial-gradient(circle at 45% 55%, rgba(0,191,255,0.15) 20%, transparent 25%),
                      radial-gradient(circle at 65% 40%, rgba(255,255,0,0.15) 20%, transparent 25%),
                      radial-gradient(circle at 35% 70%, rgba(50,205,50,0.15) 20%, transparent 25%),
                      linear-gradient(45deg, rgba(30,41,59,0.9) 0%, rgba(51,65,85,0.7) 100%)
                    `,
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {/* Enhanced city layout */}
                  <div className="absolute inset-8 border-2 border-slate-500/40 rounded-2xl">
                    {/* Major roads simulation */}
                    <div className="absolute top-1/3 left-0 right-0 h-1 bg-slate-500/30 rounded-full" />
                    <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-slate-500/30 rounded-full" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-1 bg-slate-500/30 rounded-full" />
                    
                    {/* Area labels with better positioning */}
                    <div className="absolute top-8 left-12 text-slate-300 text-sm bg-slate-800/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                      Whitefield
                    </div>
                    <div className="absolute top-16 right-12 text-slate-300 text-sm bg-slate-800/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                      MG Road
                    </div>
                    <div className="absolute bottom-16 left-12 text-slate-300 text-sm bg-slate-800/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                      HSR Layout
                    </div>
                    <div className="absolute bottom-8 right-12 text-slate-300 text-sm bg-slate-800/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                      Electronic City
                    </div>
                    <div className="absolute top-16 left-1/4 text-slate-300 text-sm bg-slate-800/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                      Indiranagar
                    </div>
                    <div className="absolute bottom-1/3 left-1/2 text-slate-300 text-sm bg-slate-800/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                      Koramangala
                    </div>
                  </div>

                  {/* Enhanced map pins */}
                  {pins.map((pin, i) => (
                    <motion.div
                      key={pin.id}
                      className={`absolute w-6 h-6 rounded-full bg-gradient-to-r ${getStatusColor(pin.status)} shadow-xl cursor-pointer border-2 border-white/20`}
                      style={{ left: pin.x, top: pin.y }}
                      onClick={() => handlePinClick(pin)}
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          '0 0 0 0 rgba(34, 197, 94, 0)',
                          '0 0 0 12px rgba(34, 197, 94, 0.15)',
                          '0 0 0 0 rgba(34, 197, 94, 0)',
                        ],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                      whileHover={{ scale: 1.8, zIndex: 10 }}
                    >
                      <MapPin className="text-white absolute inset-0 m-auto" size={12} />
                    </motion.div>
                  ))}

                  {/* Enhanced trail dot cursor - Blue */}
                  {isHovering && (
                    <>
                      <motion.div
                        className="absolute w-3 h-3 bg-blue-400 rounded-full pointer-events-none z-30"
                        style={{ 
                          left: cursorPosition.x - 6, 
                          top: cursorPosition.y - 6,
                          position: 'fixed'
                        }}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.9, 0.3, 0.9],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                        }}
                      />
                      <motion.div
                        className="absolute w-6 h-6 border-2 border-blue-400/50 rounded-full pointer-events-none z-29"
                        style={{ 
                          left: cursorPosition.x - 12, 
                          top: cursorPosition.y - 12,
                          position: 'fixed'
                        }}
                        animate={{
                          scale: [1, 2, 1],
                          opacity: [0.5, 0.1, 0.5],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                        }}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Pin Details Panel */}
              <AnimatePresence>
                {selectedPin && (
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    className="absolute bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-xl border-t border-slate-700/50 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`bg-gradient-to-r ${getStatusColor(selectedPin.status)} text-white border-0`}>
                            {selectedPin.status}
                          </Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {selectedPin.category}
                          </Badge>
                        </div>
                        <h3 className="text-white text-lg mb-1">{selectedPin.title}</h3>
                        <p className="text-slate-400 text-sm mb-2">📍 {selectedPin.location}</p>
                        <Button size="sm" className="bg-gradient-to-r from-orange-500 to-cyan-400 text-white border-0">
                          View Details
                        </Button>
                      </div>
                      <Button
                        onClick={() => setSelectedPin(null)}
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                      >
                        <X size={20} />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}