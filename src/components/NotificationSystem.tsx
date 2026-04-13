import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { X, CheckCircle, AlertCircle, Wrench, Bell } from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: Date;
  action?: string;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
  onAction?: (id: string) => void;
}

export function NotificationSystem({ notifications, onRemove, onAction }: NotificationSystemProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications.slice(-3)); // Show only last 3 notifications
  }, [notifications]);

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
          glow: 'shadow-green-400/20'
        };
      case 'warning':
        return {
          bg: 'from-yellow-500/20 to-orange-500/20',
          border: 'border-yellow-500/30',
          icon: 'text-yellow-400',
          glow: 'shadow-yellow-400/20'
        };
      case 'info':
        return {
          bg: 'from-blue-500/20 to-cyan-500/20',
          border: 'border-cyan-500/30',
          icon: 'text-cyan-400',
          glow: 'shadow-cyan-400/20'
        };
      case 'error':
        return {
          bg: 'from-red-500/20 to-pink-500/20',
          border: 'border-red-500/30',
          icon: 'text-red-400',
          glow: 'shadow-red-400/20'
        };
      default:
        return {
          bg: 'from-slate-500/20 to-slate-600/20',
          border: 'border-slate-500/30',
          icon: 'text-slate-400',
          glow: 'shadow-slate-400/20'
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
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      <AnimatePresence>
        {visibleNotifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          const colors = getNotificationColors(notification.type);

          return (
            <motion.div
              key={notification.id}
              initial={{ 
                x: 400, 
                opacity: 0, 
                scale: 0.8,
                rotateY: 90 
              }}
              animate={{ 
                x: 0, 
                opacity: 1, 
                scale: 1,
                rotateY: 0 
              }}
              exit={{ 
                x: 400, 
                opacity: 0, 
                scale: 0.8,
                rotateY: -90 
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 0.6
              }}
              className={`relative bg-gradient-to-r ${colors.bg} backdrop-blur-xl border ${colors.border} rounded-2xl p-4 shadow-2xl ${colors.glow} overflow-hidden group`}
            >
              {/* Animated background glow */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${colors.bg} opacity-0 group-hover:opacity-30`}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Ripple effect */}
              <motion.div
                className={`absolute inset-0 bg-white/10 rounded-2xl`}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              <div className="relative z-10 flex items-start space-x-3">
                {/* Icon with glow effect */}
                <motion.div
                  className={`p-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/50`}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(34, 197, 94, 0)',
                      '0 0 0 8px rgba(34, 197, 94, 0.1)',
                      '0 0 0 0 rgba(34, 197, 94, 0)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Icon className={`${colors.icon}`} size={20} />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white text-sm">{notification.title}</h4>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-slate-400 text-xs">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        {notification.action && onAction && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onAction(notification.id)}
                            className={`h-6 px-2 text-xs ${colors.icon} hover:bg-white/10 rounded-lg`}
                          >
                            {notification.action}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Close button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(notification.id)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg ml-2"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Progress bar for auto-dismiss */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                onAnimationComplete={() => onRemove(notification.id)}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };



  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };
}