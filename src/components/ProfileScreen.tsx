import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { 
  ArrowLeft, 
  User, 
  Shield, 
  MapPin, 
  Globe, 
  Bell, 
  Moon, 
  Settings,
  Award,
  BarChart3,
  LogOut
} from 'lucide-react';

interface ProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ onBack, onLogout }: ProfileScreenProps) {
  const userStats = {
    issuesReported: 12,
    issuesResolved: 8,
    upvotesReceived: 156
  };

  const locations = [
    { name: 'Home', address: 'Koramangala, Bangalore', isPrimary: true },
    { name: 'Office', address: 'MG Road, Bangalore', isPrimary: false },
    { name: 'Weekend Home', address: 'HSR Layout, Bangalore', isPrimary: false }
  ];



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
          <h1 className="text-white text-xl">Profile</h1>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 rounded-xl"
        >
          <Settings size={24} />
        </Button>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* User Profile Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl border border-slate-600/50 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-cyan-400 rounded-full flex items-center justify-center">
                    <User className="text-white" size={32} />
                  </div>
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-500 to-lime-500 rounded-full flex items-center justify-center"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <Shield className="text-white" size={12} />
                  </motion.div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-white text-xl">Rajesh Kumar</h2>
                  <p className="text-slate-400">rajesh.kumar@gmail.com</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Shield size={12} className="mr-1" />
                      Aadhaar Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 size={20} />
                Community Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center space-y-1">
                  <div className="text-2xl text-orange-400">{userStats.issuesReported}</div>
                  <div className="text-slate-400 text-sm">Issues Reported</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl text-green-400">{userStats.issuesResolved}</div>
                  <div className="text-slate-400 text-sm">Issues Resolved</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl text-cyan-400">{userStats.upvotesReceived}</div>
                  <div className="text-slate-400 text-sm">Upvotes Received</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Locations */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin size={20} />
                Manage Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {locations.map((location, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-600/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${location.isPrimary ? 'bg-gradient-to-r from-orange-500 to-cyan-400' : 'bg-slate-500'}`} />
                    <div>
                      <div className="text-white text-sm">{location.name}</div>
                      <div className="text-slate-400 text-xs">{location.address}</div>
                    </div>
                  </div>
                  {location.isPrimary && (
                    <Badge className="bg-lime-500/20 text-lime-400 border-lime-500/30 text-xs">
                      Primary
                    </Badge>
                  )}
                </motion.div>
              ))}
              
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl"
              >
                Add New Location
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="text-slate-400" size={20} />
                  <div>
                    <div className="text-white text-sm">Push Notifications</div>
                    <div className="text-slate-400 text-xs">Get updates on your reports</div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Moon className="text-slate-400" size={20} />
                  <div>
                    <div className="text-white text-sm">Dark Mode</div>
                    <div className="text-slate-400 text-xs">Always enabled for better experience</div>
                  </div>
                </div>
                <Switch defaultChecked disabled />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="text-slate-400" size={20} />
                  <div>
                    <div className="text-white text-sm">Language</div>
                    <div className="text-slate-400 text-xs">English, Hindi, Kannada</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievement Badge */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-orange-500/20 to-cyan-400/20 backdrop-blur-xl border border-orange-500/30">
            <CardContent className="p-6 text-center">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="mb-4"
              >
                <Award className="text-orange-400 mx-auto" size={48} />
              </motion.div>
              <h3 className="text-white text-lg mb-2">Civic Champion</h3>
              <p className="text-slate-300 text-sm">
                You're making a real difference in your community! Keep reporting issues to earn more badges.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="pb-8"
        >
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full border-red-600/50 text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded-xl py-3"
          >
            <LogOut size={20} className="mr-2" />
            Logout
          </Button>
        </motion.div>
      </div>
    </div>
  );
}