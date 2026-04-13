import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Wrench,
  Calendar,
  User
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useIssues } from './IssueContext';

interface MyIssuesScreenProps {
  onBack: () => void;
}

export function MyIssuesScreen({ onBack }: MyIssuesScreenProps) {
  const { issues } = useIssues();

  // Transform issues to match the expected format
  const transformedIssues = issues.map(issue => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    status: issue.status === 'pending' ? 'submitted' as const :
           issue.status === 'verified' ? 'verified' as const :
           issue.status === 'in-progress' ? 'assigned' as const :
           'completed' as const,
    location: issue.location,
    category: issue.category,
    submittedDate: issue.reportedDate,
    imageUrl: issue.image,
    assignedTo: issue.status === 'in-progress' || issue.status === 'resolved' ? 
      `${issue.category.includes('Road') ? 'PWD' : 
        issue.category.includes('Street') ? 'Electrical' : 
        issue.category.includes('Waste') ? 'Sanitation' : 
        'Municipal'} Dept.` : undefined,
    progress: issue.status === 'pending' ? 25 :
             issue.status === 'verified' ? 50 :
             issue.status === 'in-progress' ? 75 :
             100
  }));

  // Add some default issues if none exist for demo purposes
  const defaultIssues = transformedIssues.length === 0 ? [
  ] : transformedIssues;

  const displayIssues = transformedIssues.length > 0 ? transformedIssues : defaultIssues;

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'submitted':
        return {
          color: 'from-orange-500 to-orange-600',
          icon: AlertCircle,
          text: 'Submitted',
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
      case 'assigned':
        return {
          color: 'from-yellow-500 to-orange-400',
          icon: Wrench,
          text: 'In Progress',
          bgColor: 'bg-yellow-500/10 border-yellow-500/30',
          textColor: 'text-yellow-400'
        };
      case 'completed':
        return {
          color: 'from-green-500 to-lime-500',
          icon: CheckCircle,
          text: 'Completed',
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

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
          <h1 className="text-foreground text-xl">My Issues</h1>
          <p className="text-muted-foreground text-sm">{issues.length} reports submitted</p>
        </div>

        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Issues List */}
      <div className="px-4 py-6 space-y-6">
        {transformedIssues.map((issue, index) => {
          const statusDetails = getStatusDetails(issue.status);
          const StatusIcon = statusDetails.icon;

          return (
            <motion.div
              key={issue.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.02, 
                y: -4,
                rotateX: 2,
                rotateY: 2,
              }}
              className="group perspective-1000"
            >
              <Card className="bg-card/40 backdrop-blur-xl border border-border hover:border-cyan-400/50 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-cyan-400/10 overflow-hidden">
                <CardContent className="p-0">
                  {/* Image Header */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={issue.imageUrl}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className={`${statusDetails.bgColor} ${statusDetails.textColor} border backdrop-blur-sm`}>
                        <StatusIcon size={14} className="mr-1" />
                        {statusDetails.text}
                      </Badge>
                    </div>

                    {/* Category */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-muted text-muted-foreground border-border backdrop-blur-sm">
                        {issue.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-foreground text-lg group-hover:text-cyan-300 transition-colors duration-300">
                        {issue.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                        {issue.description}
                      </p>
                    </div>

                    {/* Location and Date */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin size={14} className="flex-shrink-0" />
                        <span className="truncate">{issue.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar size={14} />
                        <span>{formatDate(issue.submittedDate)}</span>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground text-sm">Progress</span>
                        <span className="text-muted-foreground text-sm">{issue.progress}%</span>
                      </div>
                      
                      <div className="relative">
                        <Progress 
                          value={issue.progress} 
                          className="h-3 bg-muted rounded-full overflow-hidden"
                        />
                        <motion.div
                          className={`absolute inset-0 h-full bg-gradient-to-r ${statusDetails.color} rounded-full origin-left`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: issue.progress / 100 }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>

                    {/* Assigned To */}
                    {issue.assignedTo && (
                      <div className="flex items-center gap-2 text-sm">
                        <User size={14} className="text-muted-foreground" />
                        <span className="text-muted-foreground">Assigned to:</span>
                        <span className="text-cyan-400">{issue.assignedTo}</span>
                      </div>
                    )}

                    {/* Status Timeline */}
                    <div className="flex items-center gap-2 pt-2">
                      {['submitted', 'verified', 'assigned', 'completed'].map((step, stepIndex) => {
                        const isActive = ['submitted', 'verified', 'assigned', 'completed'].indexOf(issue.status) >= stepIndex;
                        const isCurrent = ['submitted', 'verified', 'assigned', 'completed'].indexOf(issue.status) === stepIndex;
                        
                        return (
                          <div key={step} className="flex items-center">
                            <motion.div
                              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                isActive 
                                  ? `bg-gradient-to-r ${statusDetails.color} shadow-lg` 
                                  : 'bg-muted'
                              }`}
                              animate={isCurrent ? {
                                scale: [1, 1.3, 1],
                                boxShadow: [
                                  '0 0 0 0 rgba(34, 197, 94, 0)',
                                  '0 0 0 6px rgba(34, 197, 94, 0.3)',
                                  '0 0 0 0 rgba(34, 197, 94, 0)',
                                ],
                              } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            {stepIndex < 3 && (
                              <div className={`w-8 h-0.5 ${isActive ? 'bg-cyan-400' : 'bg-muted'} transition-colors duration-300`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State or Load More */}
      {transformedIssues.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="text-muted-foreground" size={32} />
            </div>
            <h3 className="text-foreground text-xl">No Issues Reported</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              You haven't reported any issues yet. Start making your community better by reporting civic problems.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}