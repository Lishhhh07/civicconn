import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { 
  ArrowLeft, 
  MapPin, 
  Search, 
  ArrowUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Wrench,
  Filter,
  Navigation,
  Map,
  List
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { RealGoogleMap } from './RealGoogleMap';
import { BottomNavigation } from './BottomNavigation';
import { MiniGoogleMap } from './MiniGoogleMap';

interface NearbyIssuesScreenProps {
  onBack: () => void;
  onReportIssue?: () => void;
  onMapFullscreen?: () => void;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'reported' | 'verified' | 'in-progress' | 'resolved';
  location: string;
  category: string;
  timeAgo: string;
  imageUrl: string;
  upvotes: number;
  distance: string;
  reportedBy: string;
  isUpvoted: boolean;
  coordinates: { lat: number; lng: number };
}

export function NearbyIssuesScreen({ onBack, onReportIssue, onMapFullscreen }: NearbyIssuesScreenProps) {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [activeTab, setActiveTab] = useState<'map' | 'issues' | 'community' | 'profile'>('issues');
  const [searchRadius, setSearchRadius] = useState([2]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Base issues always shown
  const baseIssues: Issue[] = [
    {
      id: '1',
      title: 'Garbage collection not done for a week',
      description: 'Waste has been accumulating near the apartment complex for over a week, creating health hazards and attracting stray animals.',
      status: 'reported',
      location: 'Indiranagar, Bangalore',
      category: 'Waste Management',
      timeAgo: '3 hours ago',
      imageUrl: 'https://images.unsplash.com/photo-1635929114944-8bab23b98e74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJiYWdlJTIwd2FzdGUlMjBpbmRpYSUyMHN0cmVldHxlbnwxfHx8fDE3NTczOTQwMjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      upvotes: 24,
      distance: '0.8 km',
      reportedBy: 'Ravi Kumar',
      isUpvoted: false,
      coordinates: { lat: 12.9716, lng: 77.6412 }
    },
    {
      id: '2',
      title: 'Water pipe leakage causing road flooding',
      description: 'Main water supply pipe has burst, causing continuous flooding on the main road during peak hours.',
      status: 'verified',
      location: 'HSR Layout, Bangalore',
      category: 'Water Supply',
      timeAgo: '1 day ago',
      imageUrl: 'https://images.unsplash.com/photo-1591080954453-2936efa54c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzdHJlZXQlMjBwb3Rob2xlJTIwcm9hZHxlbnwxfHx8fDE3NTczOTQwMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      upvotes: 18,
      distance: '1.2 km',
      reportedBy: 'Priya Sharma',
      isUpvoted: true,
      coordinates: { lat: 12.9082, lng: 77.6476 }
    },
    {
      id: '3',
      title: 'Multiple streetlights not working',
      description: 'Entire stretch of road has non-functional streetlights, creating safety concerns for late-night commuters.',
      status: 'in-progress',
      location: 'Koramangala, Bangalore',
      category: 'Street Lighting',
      timeAgo: '2 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1672441962683-5237d7d7a8df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9rZW4lMjBzdHJlZXRsaWdodCUyMG5pZ2h0JTIwaW5kaWF8ZW58MXx8fHwxNzU3Mzk0MDE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      upvotes: 31,
      distance: '1.5 km',
      reportedBy: 'Amit Patel',
      isUpvoted: false,
      coordinates: { lat: 12.9352, lng: 77.6245 }
    },
    {
      id: '4',
      title: 'Deep pothole causing vehicle damage',
      description: 'Large pothole has formed after recent rains, causing significant damage to vehicles and creating traffic bottlenecks.',
      status: 'resolved',
      location: 'MG Road, Bangalore',
      category: 'Road Infrastructure',
      timeAgo: '5 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1591080954453-2936efa54c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzdHJlZXQlMjBwb3Rob2xlJTIwcm9hZHxlbnwxfHx8fDE3NTczOTQwMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      upvotes: 42,
      distance: '0.3 km',
      reportedBy: 'Sneha Reddy',
      isUpvoted: true,
      coordinates: { lat: 12.9750, lng: 77.6060 }
    }
  ];

  // Additional issues for larger radius
  const additionalIssues: Issue[] = [
    {
      id: '5',
      title: 'Bus stop shelter damaged by storm',
      description: 'Recent storm damaged the bus stop shelter roof, leaving commuters exposed to rain and sun.',
      status: 'reported',
      location: 'Brigade Road, Bangalore',
      category: 'Public Infrastructure',
      timeAgo: '6 hours ago',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXMlMjBzdG9wJTIwaW5kaWElMjBkYW1hZ2VkfGVufDF8fHx8MTc1NzM5NDAyNXww&ixlib=rb-4.1.0&q=80&w=1080',
      upvotes: 15,
      distance: '2.1 km',
      reportedBy: 'Deepak Singh',
      isUpvoted: false,
      coordinates: { lat: 12.9698, lng: 77.6205 }
    },
    {
      id: '6',
      title: 'Illegal parking blocking emergency lane',
      description: 'Cars consistently parked in emergency lane causing traffic jams and blocking ambulance access.',
      status: 'verified',
      location: 'Residency Road, Bangalore',
      category: 'Traffic Management',
      timeAgo: '8 hours ago',
      imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbGxlZ2FsJTIwcGFya2luZyUyMGluZGlhJTIwc3RyZWV0fGVufDF8fHx8MTc1NzM5NDAyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      upvotes: 28,
      distance: '2.3 km',
      reportedBy: 'Anita Mehta',
      isUpvoted: false,
      coordinates: { lat: 12.9719, lng: 77.6037 }
    },
    {
      id: '7',
      title: 'Public toilet facility non-functional',
      description: 'Public restroom has been out of order for weeks, causing hygiene issues in the busy market area.',
      status: 'in-progress',
      location: 'Commercial Street, Bangalore',
      category: 'Sanitation',
      timeAgo: '12 hours ago',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWJsaWMlMjB0b2lsZXQlMjBpbmRpYSUyMG1hcmtldHxlbnwxfHx8fDE3NTczOTQwMjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      upvotes: 22,
      distance: '2.7 km',
      reportedBy: 'Kiran Rao',
      isUpvoted: true,
      coordinates: { lat: 12.9833, lng: 77.6100 }
    },
    {
      id: '8',
      title: 'Tree branch hanging dangerously over road',
      description: 'Large tree branch is hanging precariously over the main road after recent winds, posing safety risk.',
      status: 'reported',
      location: 'Cubbon Park Road, Bangalore',
      category: 'Public Safety',
      timeAgo: '1 day ago',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwYnJhbmNoJTIwcm9hZCUyMGRhbmdlcnxlbnwxfHx8fDE3NTczOTQwMzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      upvotes: 19,
      distance: '3.2 km',
      reportedBy: 'Srinivas Murthy',
      isUpvoted: false,
      coordinates: { lat: 12.9762, lng: 77.5911 }
    },
    {
      id: '9',
      title: 'Manhole cover missing causing safety hazard',
      description: 'Open manhole without cover in busy pedestrian area. Multiple people have already fallen into it.',
      status: 'verified',
      location: 'Shivaji Nagar, Bangalore',
      category: 'Public Safety',
      timeAgo: '2 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5ob2xlJTIwY292ZXIlMjBtaXNzaW5nJTIwaW5kaWF8ZW58MXx8fHwxNzU3Mzk0MDMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      upvotes: 67,
      distance: '3.8 km',
      reportedBy: 'Lakshmi Devi',
      isUpvoted: true,
      coordinates: { lat: 12.9895, lng: 77.6018 }
    },
    {
      id: '10',
      title: 'Street vendor blocking sidewalk access',
      description: 'Permanent street vendor setup blocking entire sidewalk, forcing pedestrians to walk on busy road.',
      status: 'reported',
      location: 'Chickpet, Bangalore',
      category: 'Public Access',
      timeAgo: '3 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjB2ZW5kb3IlMjBpbmRpYSUyMHNpZGV3YWxrfGVufDF8fHx8MTc1NzM5NDAzNXww&ixlib=rb-4.1.0&q=80&w=1080',
      upvotes: 12,
      distance: '4.5 km',
      reportedBy: 'Rajesh Sharma',
      isUpvoted: false,
      coordinates: { lat: 12.9619, lng: 77.5840 }
    }
  ];

  const [issues, setIssues] = useState<Issue[]>(baseIssues);

  // Update issues based on search radius
  useEffect(() => {
    const radius = searchRadius[0];
    let visibleIssues = [...baseIssues];
    
    if (radius >= 3) {
      // Add first 2 additional issues for radius >= 3km
      visibleIssues = [...visibleIssues, ...additionalIssues.slice(0, 2)];
    }
    
    if (radius >= 4) {
      // Add next 2 issues for radius >= 4km
      visibleIssues = [...visibleIssues, ...additionalIssues.slice(2, 4)];
    }
    
    if (radius >= 5) {
      // Add remaining issues for radius >= 5km
      visibleIssues = [...visibleIssues, ...additionalIssues.slice(4)];
    }
    
    setIssues(visibleIssues);
  }, [searchRadius]);

  // Convert issues to map format
  const mapIssues = issues.map(issue => ({
    id: issue.id,
    title: issue.title,
    category: getCategoryFromIssueCategory(issue.category) as 'roads' | 'water' | 'electricity' | 'infrastructure' | 'safety' | 'waste',
    status: issue.status,
    upvotes: issue.upvotes,
    location: issue.location,
    coordinates: issue.coordinates,
    isUpvoted: issue.isUpvoted
  }));

  function getCategoryFromIssueCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'Road Infrastructure': 'roads',
      'Water Supply': 'water',
      'Street Lighting': 'electricity',
      'Public Infrastructure': 'infrastructure',
      'Public Safety': 'safety',
      'Waste Management': 'waste',
      'Traffic Management': 'roads',
      'Sanitation': 'waste',
      'Public Access': 'infrastructure'
    };
    return categoryMap[category] || 'infrastructure';
  }

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'reported':
        return {
          color: 'from-orange-500 to-orange-600',
          icon: AlertCircle,
          text: 'Reported',
          bgColor: 'bg-orange-500/10 border-orange-500/30',
          textColor: 'text-orange-400'
        };
      case 'verified':
        return {
          color: 'from-blue-500 to-cyan-500',
          icon: CheckCircle,
          text: 'Verified',
          bgColor: 'bg-blue-500/10 border-blue-500/30',
          textColor: 'text-blue-400'
        };
      case 'in-progress':
        return {
          color: 'from-yellow-500 to-orange-400',
          icon: Wrench,
          text: 'In Progress',
          bgColor: 'bg-yellow-500/10 border-yellow-500/30',
          textColor: 'text-yellow-400'
        };
      case 'resolved':
        return {
          color: 'from-green-500 to-lime-500',
          icon: CheckCircle,
          text: 'Resolved',
          bgColor: 'bg-green-500/10 border-green-500/30',
          textColor: 'text-green-400'
        };
      default:
        return {
          color: 'from-gray-500 to-gray-600',
          icon: Clock,
          text: 'Unknown',
          bgColor: 'bg-gray-500/10 border-gray-500/30',
          textColor: 'text-gray-400'
        };
    }
  };

  const handleUpvote = (issueId: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          isUpvoted: !issue.isUpvoted,
          upvotes: issue.isUpvoted ? issue.upvotes - 1 : issue.upvotes + 1
        };
      }
      return issue;
    }));
  };

  const filteredIssues = issues.filter(issue => 
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.location.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-card/30 backdrop-blur-sm border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-foreground hover:bg-accent rounded-xl"
        >
          <ArrowLeft size={24} />
        </Button>
        
        <div className="text-center">
          <h1 className="text-foreground text-xl">Nearby Issues</h1>
          <p className="text-muted-foreground text-sm">{filteredIssues.length} issues found</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Big Map Icon Button */}
          <motion.button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              viewMode === 'map' 
                ? 'bg-gradient-to-r from-orange-500 to-cyan-400 text-white shadow-lg shadow-orange-500/30' 
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white border border-slate-600/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Map size={20} />
            <span className="text-sm font-medium">Map View</span>
          </motion.button>

          {/* List Icon - Smaller */}
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={`rounded-xl ${viewMode === 'list' ? 'bg-gradient-to-r from-orange-500 to-cyan-400 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      {/* Conditional Content */}
      {viewMode === 'list' && (
        <>
          {/* Search and Radius */}
          <div className="p-4 space-y-4 bg-card/20 backdrop-blur-sm border-b border-border">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search issues, categories, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl"
              />
            </div>

            {/* Search Radius */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-foreground text-sm">Search Radius</label>
                <span className="text-cyan-400 text-sm">{searchRadius[0]} km</span>
              </div>
              <div className="relative">
                <Slider
                  value={searchRadius}
                  onValueChange={setSearchRadius}
                  max={10}
                  min={0.5}
                  step={0.5}
                  className="w-full"
                />
                <motion.div
                  className="absolute top-1/2 w-3 h-3 bg-gradient-to-r from-cyan-400 to-lime-400 rounded-full transform -translate-y-1/2 pointer-events-none shadow-lg"
                  style={{ left: `${(searchRadius[0] / 10) * 100}%` }}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(34, 197, 94, 0.5)',
                      '0 0 0 8px rgba(34, 197, 94, 0)',
                      '0 0 0 0 rgba(34, 197, 94, 0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div className="px-4 py-6 space-y-6">
        {filteredIssues.map((issue, index) => {
          const statusDetails = getStatusDetails(issue.status);
          const StatusIcon = statusDetails.icon;

          return (
            <motion.div
              key={issue.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group"
            >
              <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-400/10 overflow-hidden">
                <CardContent className="p-0">
                  {/* Image Header */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={issue.imageUrl}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className={`${statusDetails.bgColor} ${statusDetails.textColor} border backdrop-blur-sm`}>
                        <StatusIcon size={14} className="mr-1" />
                        {statusDetails.text}
                      </Badge>
                    </div>

                    {/* Category and Distance */}
                    <div className="absolute top-4 left-4 space-y-2">
                      <Badge className="bg-slate-800/70 text-slate-300 border-slate-600 backdrop-blur-sm">
                        {issue.category}
                      </Badge>
                      <Badge className="bg-lime-500/20 text-lime-400 border-lime-500/30 backdrop-blur-sm">
                        {issue.distance}
                      </Badge>
                    </div>

                    {/* Big Upvote Button */}
                    <motion.div
                      className="absolute bottom-4 right-4"
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Button
                        onClick={() => handleUpvote(issue.id)}
                        size="lg"
                        className={`backdrop-blur-sm transition-all duration-300 h-14 w-20 flex flex-col items-center gap-1 ${
                          issue.isUpvoted
                            ? 'bg-gradient-to-r from-orange-500 to-cyan-400 text-white border-0 shadow-lg shadow-orange-500/30'
                            : 'bg-slate-800/70 text-slate-300 border-slate-600 hover:bg-slate-700/70 hover:border-cyan-400/50'
                        }`}
                      >
                        <motion.div
                          animate={issue.isUpvoted ? {
                            scale: [1, 1.3, 1],
                            rotate: [0, 10, -10, 0],
                          } : {}}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                          <ArrowUp size={20} />
                        </motion.div>
                        <span className="text-xs">{issue.upvotes}</span>
                      </Button>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-white text-lg group-hover:text-cyan-300 transition-colors duration-300">
                        {issue.title}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                        {issue.description}
                      </p>
                    </div>

                    {/* Location Map */}
                    <div className="space-y-2">
                      <h4 className="text-white text-sm">📍 Exact Location</h4>
                      <MiniGoogleMap
                        coordinates={issue.coordinates}
                        title={issue.title}
                        status={issue.status}
                      />
                    </div>

                    {/* Location and Time */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-slate-400">
                        <MapPin size={14} />
                        <span>{issue.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock size={14} />
                        <span>{issue.timeAgo}</span>
                      </div>
                    </div>

                    {/* Reporter - Removed badge, simplified */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-400">
                        Reported by <span className="text-cyan-400">{issue.reportedBy}</span>
                      </div>
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${statusDetails.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

          {/* Empty State */}
          {filteredIssues.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto">
                  <Search className="text-slate-400" size={32} />
                </div>
                <h3 className="text-white text-xl">No Issues Found</h3>
                <p className="text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search radius or search terms to find more civic issues in your area.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Real Google Map View */}
      {viewMode === 'map' && (
        <div className="flex-1 h-[calc(100vh-180px)]">
          <RealGoogleMap
            onReportIssue={() => onReportIssue?.()}
            onNearbyIssues={() => setViewMode('list')}
            onFullscreen={() => onMapFullscreen?.()}
          />
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'map') {
            setViewMode('map');
          } else if (tab === 'issues') {
            setViewMode('list');
          }
          // Handle other tab navigation as needed
        }}
      />
    </div>
  );
}