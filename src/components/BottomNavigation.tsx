import { motion } from 'motion/react';
import { 
  Map, 
  FileText, 
  Users, 
  User
} from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'map' | 'issues' | 'community' | 'profile';
  onTabChange: (tab: 'map' | 'issues' | 'community' | 'profile') => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'map' as const, label: 'Map', icon: Map },
    { id: 'issues' as const, label: 'Issues', icon: FileText },
    { id: 'community' as const, label: 'Community', icon: Users },
    { id: 'profile' as const, label: 'Profile', icon: User }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-4 transition-colors duration-200 ${
                isActive ? 'text-orange-500' : 'text-gray-400'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Icon size={20} />
              </motion.div>
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}