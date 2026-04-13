import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingPage } from './components/LandingPage';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { ReportIssueFlow } from './components/ReportIssueFlow';
import { MyIssuesScreen } from './components/MyIssuesScreen';
import { NearbyIssuesScreen } from './components/NearbyIssuesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { NotificationTab } from './components/NotificationTab';
import { NotificationSystem, useNotifications } from './components/NotificationSystem';
import { MapScreen } from './components/MapScreen';
import { IssueProvider } from './components/IssueContext';
import { ThemeProvider } from './components/ThemeContext';

type Screen = 
  | 'landing'
  | 'splash' 
  | 'login' 
  | 'home' 
  | 'map'
  | 'report-issue' 
  | 'my-issues' 
  | 'nearby-issues' 
  | 'profile'
  | 'notifications';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  const { 
    notifications, 
    addNotification, 
    removeNotification, 
    clearAllNotifications
  } = useNotifications();

  // Auto-advance from splash screen
  // useEffect(() => {
  //   if (currentScreen === 'splash') {
  //     const timer = setTimeout(() => {
  //       setCurrentScreen('login');
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [currentScreen]);

  // Remove auto notifications - only show when reporting issues or accessing notification tab

  const handleLogin = () => {
    const token = localStorage.getItem("token");
  
    if (token) {
      setIsLoggedIn(true);
      setCurrentScreen('home');
    } else {
      alert("Login failed");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('splash');
  };

  const handleNotificationAction = (id: string) => {
    removeNotification(id);
    // Handle notification action (e.g., navigate to specific screen)
  };

  return (
    <ThemeProvider>
      <IssueProvider>
        <div className="size-full bg-background text-foreground">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="size-full"
        >
          {currentScreen === 'landing' && (
            <LandingPage onGetStarted={() => setCurrentScreen('login')} />
          )}

          {currentScreen === 'splash' && (
            <SplashScreen onGetStarted={() => setCurrentScreen('login')} />
          )}

          {currentScreen === 'login' && (
            <LoginScreen 
              onLogin={handleLogin} 
              onBack={() => setCurrentScreen('splash')} 
            />
          )}

          {currentScreen === 'home' && isLoggedIn && (
            <HomeScreen
              onReportIssue={() => setCurrentScreen('report-issue')}
              onMyIssues={() => setCurrentScreen('my-issues')}
              onNearbyIssues={() => setCurrentScreen('nearby-issues')}
              onProfile={() => setCurrentScreen('profile')}
              onNotifications={() => setCurrentScreen('notifications')}
              notificationCount={notifications.length}
            />
          )}

          {currentScreen === 'map' && isLoggedIn && (
            <MapScreen
              onReportIssue={() => setCurrentScreen('report-issue')}
              onNearbyIssues={() => setCurrentScreen('nearby-issues')}
              onCommunity={() => setCurrentScreen('home')} // Placeholder
              onProfile={() => setCurrentScreen('profile')}
            />
          )}

          {currentScreen === 'report-issue' && isLoggedIn && (
            <ReportIssueFlow
              onBack={() => setCurrentScreen('home')}
              onComplete={() => {
                setCurrentScreen('home');
                addNotification({
                  title: 'Issue Reported Successfully! ✅',
                  message: 'Your civic issue has been submitted for verification.',
                  type: 'success',
                  action: 'Track Progress'
                });
                
                // Add follow-up notifications to simulate progress
                setTimeout(() => {
                  addNotification({
                    title: 'Issue Verified! 🎉',
                    message: 'Your streetlight issue is now verified and assigned to a worker.',
                    type: 'success',
                    action: 'View Details'
                  });
                }, 5000);

                setTimeout(() => {
                  addNotification({
                    title: 'Worker Assigned 🔧',
                    message: 'Electrical Department has been assigned to fix your issue.',
                    type: 'info',
                    action: 'Track Progress'
                  });
                }, 10000);
              }}
            />
          )}

          {currentScreen === 'my-issues' && isLoggedIn && (
            <MyIssuesScreen onBack={() => setCurrentScreen('home')} />
          )}

          {currentScreen === 'nearby-issues' && isLoggedIn && (
            <NearbyIssuesScreen 
              onBack={() => setCurrentScreen('home')} 
              onReportIssue={() => setCurrentScreen('report-issue')}
              onMapFullscreen={() => setCurrentScreen('map')}
            />
          )}

          {currentScreen === 'profile' && isLoggedIn && (
            <ProfileScreen 
              onBack={() => setCurrentScreen('home')} 
              onLogout={handleLogout}
            />
          )}

          {currentScreen === 'notifications' && isLoggedIn && (
            <NotificationTab
              onBack={() => setCurrentScreen('home')}
              notifications={notifications}
              onRemove={removeNotification}
              onClearAll={clearAllNotifications}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Notification System - Only show on non-notification screens */}
      {isLoggedIn && currentScreen !== 'notifications' && (
        <NotificationSystem
          notifications={notifications}
          onRemove={removeNotification}
          onAction={handleNotificationAction}
        />
      )}

      {/* Background animations for all screens */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
            animate={{
              x: [0, Math.random() * window.innerWidth],
              y: [0, Math.random() * window.innerHeight],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
        </div>
      </IssueProvider>
    </ThemeProvider>
  );
}