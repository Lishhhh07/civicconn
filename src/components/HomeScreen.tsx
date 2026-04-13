import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { RealGoogleMap } from './RealGoogleMap';
import { 
  Plus, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Wrench,
  Menu,
  Bell,
  ArrowUp
} from 'lucide-react';

interface HomeScreenProps {
  onReportIssue: () => void;
  onMyIssues: () => void;
  onNearbyIssues: () => void;
  onProfile: () => void;
  onNotifications: () => void;
  notificationCount?: number;
}

interface Issue {
  id: string;
  title: string;
  status: 'reported' | 'verified' | 'in-progress' | 'resolved';
  location: string;
  timeAgo: string;
  category: string;
  upvotes?: number;
  isUpvoted?: boolean;
}

export function HomeScreen({ onReportIssue, onMyIssues, onNearbyIssues, onProfile, onNotifications, notificationCount = 0 }: HomeScreenProps) {
  const [activeSection, setActiveSection] = useState<'my' | 'nearby'>('my');

  const myIssues: Issue[] = [
    {
      id: '1',
      title: 'Broken streetlight on MG Road',
      status: 'in-progress',
      location: 'MG Road, Bangalore',
      timeAgo: '2 days ago',
      category: 'Street Lighting'
    },
    {
      id: '2',
      title: 'Pothole near bus stop',
      status: 'verified',
      location: 'Koramangala, Bangalore',
      timeAgo: '1 week ago',
      category: 'Road Infrastructure'
    }
  ];

  const nearbyIssues: Issue[] = [
    {
      id: '3',
      title: 'Garbage collection not done',
      status: 'reported',
      location: 'Indiranagar, Bangalore',
      timeAgo: '3 hours ago',
      category: 'Waste Management',
      upvotes: 24,
      isUpvoted: false
    },
    {
      id: '4',
      title: 'Water leakage from pipe',
      status: 'resolved',
      location: 'HSR Layout, Bangalore',
      timeAgo: '5 days ago',
      category: 'Water Supply',
      upvotes: 18,
      isUpvoted: true
    }
  ];

  const [nearbyIssuesState, setNearbyIssuesState] = useState(nearbyIssues);

  const handleUpvote = (issueId: string) => {
    setNearbyIssuesState(prev => prev.map(issue => {
      if (issue.id === issueId && issue.upvotes !== undefined) {
        return {
          ...issue,
          isUpvoted: !issue.isUpvoted,
          upvotes: issue.isUpvoted ? issue.upvotes - 1 : issue.upvotes + 1
        };
      }
      return issue;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'from-orange-500 to-orange-600';
      case 'verified': return 'from-blue-500 to-cyan-500';
      case 'in-progress': return 'from-yellow-500 to-orange-400';
      case 'resolved': return 'from-green-500 to-lime-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'reported': return 25;
      case 'verified': return 50;
      case 'in-progress': return 75;
      case 'resolved': return 100;
      default: return 0;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reported': return 'Reported';
      case 'verified': return 'Verified';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reported': return AlertCircle;
      case 'verified': return CheckCircle;
      case 'in-progress': return Wrench;
      case 'resolved': return CheckCircle;
      default: return Clock;
    }
  };

  const renderIssueCard = (issue: Issue) => {
    const StatusIcon = getStatusIcon(issue.status);
    const isNearbyIssue = issue.upvotes !== undefined;
    const progress = getStatusProgress(issue.status);
    const statusText = getStatusText(issue.status);
    
    return (
      <motion.div
        key={issue.id}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="group"
      >
        <Card className="bg-card/40 backdrop-blur-xl border border-border hover:border-cyan-400/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-400/10">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-foreground group-hover:text-cyan-300 transition-colors duration-300">
                  {issue.title}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                  <MapPin size={14} />
                  <span>{issue.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Big Upvote button for nearby issues */}
                {isNearbyIssue && (
                  <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
                    <Button
                      onClick={() => handleUpvote(issue.id)}
                      size="sm"
                      className={`h-14 w-16 flex flex-col items-center gap-1 transition-all duration-300 ${
                        issue.isUpvoted
                          ? 'bg-gradient-to-r from-orange-500 to-cyan-400 text-white border-0 shadow-lg shadow-orange-500/30'
                          : 'bg-muted text-muted-foreground border-border hover:bg-accent hover:border-cyan-400/50'
                      }`}
                    >
                      <motion.div
                        animate={issue.isUpvoted ? {
                          scale: [1, 1.3, 1],
                          rotate: [0, 10, -10, 0],
                        } : {}}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      >
                        <ArrowUp size={18} />
                      </motion.div>
                      <span className="text-xs">{issue.upvotes}</span>
                    </Button>
                  </motion.div>
                )}
                <div className={`p-2 rounded-full bg-gradient-to-r ${getStatusColor(issue.status)} shadow-lg`}>
                  <StatusIcon className="text-white" size={16} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-accent">
                {issue.category}
              </Badge>
              <span className="text-muted-foreground text-sm">{issue.timeAgo}</span>
            </div>

            {/* Progress section for My Issues */}
            {!isNearbyIssue && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-sm">Status: {statusText}</span>
                  <span className="text-muted-foreground text-sm">{progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getStatusColor(issue.status)} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            )}

            {/* Simple progress bar for nearby issues (no status text) */}
            {isNearbyIssue && (
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getStatusColor(issue.status)} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-card/30 backdrop-blur-sm border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={onProfile}
          className="text-foreground hover:bg-accent rounded-xl"
        >
          <Menu size={24} />
        </Button>
        
        <div className="text-center">
          <h1 className="text-foreground text-xl">CivicAI</h1>
          <p className="text-muted-foreground text-sm">Bangalore, Karnataka</p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNotifications}
          className="text-foreground hover:bg-accent rounded-xl relative"
        >
          <Bell size={24} />
          {notificationCount > 0 && (
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-white text-xs">{notificationCount > 9 ? '9+' : notificationCount}</span>
            </motion.div>
          )}
        </Button>
      </div>

      {/* Interactive Map Section */}
      <div className="h-64">
        <RealGoogleMap
          onReportIssue={onReportIssue}
          onNearbyIssues={onNearbyIssues}
          onFullscreen={() => onNearbyIssues()}
        />
      </div>

      {/* Section Tabs */}
      <div className="px-4 mb-4">
        <div className="flex bg-card/50 backdrop-blur-sm rounded-xl p-1 border border-border">
          <Button
            variant={activeSection === 'my' ? 'default' : 'ghost'}
            onClick={() => setActiveSection('my')}
            className={`flex-1 rounded-lg transition-all duration-300 ${
              activeSection === 'my' 
                ? 'bg-gradient-to-r from-orange-500 to-cyan-400 text-white shadow-lg' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            My Issues
          </Button>
          <Button
            variant={activeSection === 'nearby' ? 'default' : 'ghost'}
            onClick={() => setActiveSection('nearby')}
            className={`flex-1 rounded-lg transition-all duration-300 ${
              activeSection === 'nearby' 
                ? 'bg-gradient-to-r from-orange-500 to-cyan-400 text-white shadow-lg' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            Nearby Issues
          </Button>
        </div>
      </div>

      {/* Issues List */}
      <div className="px-4 pb-24 space-y-4">
        {activeSection === 'my' && (
          <>
            {myIssues.map(renderIssueCard)}
            <Button
              onClick={onMyIssues}
              variant="ghost"
              className="w-full text-cyan-400 hover:text-cyan-300 hover:bg-accent border border-border rounded-xl"
            >
              View All My Issues
            </Button>
          </>
        )}

        {activeSection === 'nearby' && (
          <>
            {nearbyIssuesState.map(renderIssueCard)}
            <Button
              onClick={onNearbyIssues}
              variant="ghost"
              className="w-full text-cyan-400 hover:text-cyan-300 hover:bg-accent border border-border rounded-xl"
            >
              View All Nearby Issues
            </Button>
          </>
        )}
      </div>

      {/* Floating Report Button */}
      <motion.div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={onReportIssue}
          className="relative bg-gradient-to-r from-orange-500 to-cyan-400 hover:from-orange-600 hover:to-cyan-500 text-white rounded-full p-4 shadow-2xl border-4 border-white/20 overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          <Plus className="relative z-10" size={28} />
          <span className="sr-only">Report New Issue</span>
        </Button>
      </motion.div>
    </div>
  );
}