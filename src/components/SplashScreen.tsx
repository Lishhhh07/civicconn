import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Zap, MapPin, Users } from 'lucide-react';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export function SplashScreen({ onGetStarted }: SplashScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-cyan-400 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-lime-400 rounded-full opacity-60"
            animate={{
              x: [0, Math.random() * 400],
              y: [0, Math.random() * 800],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Logo and Title */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <Zap size={80} className="text-white drop-shadow-2xl" />
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-4 mb-12"
        >
          <h1 className="text-4xl text-white drop-shadow-lg">
            Civic<span className="text-lime-300">AI</span>
          </h1>
          <p className="text-white/90 text-lg leading-relaxed max-w-sm">
            Report civic issues instantly. Make your city better, one report at a time.
          </p>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex gap-8 mb-12"
        >
          {[
            { icon: MapPin, text: "Smart Location" },
            { icon: Zap, text: "AI Powered" },
            { icon: Users, text: "Community Driven" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                <feature.icon size={24} className="text-white" />
              </div>
              <span className="text-white/80 text-sm">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Get Started Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring", bounce: 0.6 }}
        >
          <Button
            onClick={onGetStarted}
            className="relative px-8 py-3 bg-white text-orange-600 hover:bg-white/90 rounded-xl shadow-2xl border-0 overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-lime-400 to-cyan-400 opacity-0 group-hover:opacity-20"
              whileHover={{ scale: 1.5 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">Get Started</span>
          </Button>
        </motion.div>

        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 border-4 border-white/20 rounded-full"
          animate={{
            scale: [1, 2, 3],
            opacity: [0.3, 0.1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "100px",
            height: "100px",
          }}
        />
      </div>
    </div>
  );
}