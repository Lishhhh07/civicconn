import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Wrench, 
  Bell,
  Clock,
  Trash2
} from 'lucide-react';
import { Notification } from './NotificationSystem';

interface NotificationTabProps {
  onBack: () => void;
  notifications: Notification[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationTab({ onBack, notifications, onRemove, onClearAll }: NotificationTabProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'info':
        return Bell;
      case 'error':
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getNotificationColors = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-500/20 to-lime-500/20',
          border: 'border-green-500/30',
          icon: 'text-green-400',
        };
      case 'warning':
        return {
          bg: 'from-yellow-500/20 to-orange-500/20',
          border: 'border-yellow-500/30',
          icon: 'text-yellow-400',
        };
      case 'info':
        return {
          bg: 'from-blue-500/20 to-cyan-500/20',
          border: 'border-cyan-500/30',
          icon: 'text-cyan-400',
        };
      case 'error':
        return {
          bg: 'from-red-500/20 to-pink-500/20',
          border: 'border-red-500/30',
          icon: 'text-red-400',
        };
      default:
        return {
          bg: 'from-slate-500/20 to-slate-600/20',
          border: 'border-slate-500/30',
          icon: 'text-slate-400',
        };
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/10 rounded-xl"
        >
          <ArrowLeft size={24} />
        </Button>
        
        <div className="text-center">
          <h1 className="text-white text-xl">Notifications</h1>
          <p className="text-slate-400 text-sm">{notifications.length} notifications</p>
        </div>

        {notifications.length > 0 && (
          <Button
            onClick={onClearAll}
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
          >
            <Trash2 size={20} />
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="px-4 py-6 space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto">
                <Bell className="text-slate-400" size={32} />
              </div>
              <h3 className="text-white text-xl">No Notifications</h3>
              <p className="text-slate-400 max-w-sm mx-auto">
                You're all caught up! Notifications about your civic reports will appear here.
              </p>
            </div>
          </div>
        ) : (
          notifications.map((notification, index) => {
            const Icon = getNotificationIcon(notification.type);
            const colors = getNotificationColors(notification.type);

            return (
              <motion.div
                key={notification.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="group"
              >
                <Card className={`bg-gradient-to-r ${colors.bg} backdrop-blur-xl border ${colors.border} shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <motion.div
                        className={`p-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 flex-shrink-0`}
                        animate={{
                          boxShadow: [
                            '0 0 0 0 rgba(34, 197, 94, 0)',
                            '0 0 0 6px rgba(34, 197, 94, 0.1)',
                            '0 0 0 0 rgba(34, 197, 94, 0)',
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        <Icon className={colors.icon} size={20} />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-white group-hover:text-cyan-300 transition-colors duration-300">
                              {notification.title}
                            </h4>
                            <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-1 text-slate-400 text-xs">
                                <Clock size={12} />
                                <span>{formatTimeAgo(notification.timestamp)}</span>
                              </div>
                              {notification.action && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className={`h-7 px-3 text-xs ${colors.icon} hover:bg-white/10 rounded-lg`}
                                >
                                  {notification.action}
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {/* Remove button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemove(notification.id)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}