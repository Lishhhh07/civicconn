import { motion } from 'motion/react';
import { Camera, MapPin, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-950">
      {/* Background Image - Visible with Cinematic Effect */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1740056359361-f55cc8f34035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdod2F5JTIwbmlnaHQlMjBsaWdodCUyMHRyYWlscyUyMGNpdHklMjBza3lsaW5lJTIwb3JhbmdlfGVufDF8fHx8MTc3NjA4MTY4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="City skyline at night"
          className="w-full h-full object-cover"
          style={{ filter: 'blur(1px)' }}
        />
        {/* Dark overlay - keeps background visible but softened */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/65 to-slate-950/80" />
      </div>

      {/* Very subtle minimal particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: i % 2 === 0 ? '#60a5fa' : '#93c5fd',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 max-w-5xl mx-auto">
        
        {/* Logo Icon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 flex items-center justify-center shadow-2xl shadow-black/40">
            <div className="relative">
              <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 stroke-[2]" />
              <Zap 
                className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 absolute -top-1 -right-1" 
                fill="#fb923c"
                strokeWidth={0}
              />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="text-5xl sm:text-6xl md:text-7xl font-semibold mb-6 tracking-tight"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
        >
          <span className="text-white">Civic</span>
          <span className="text-blue-400">Report</span>
        </motion.h1>

        {/* Tagline */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="text-xl sm:text-2xl md:text-3xl text-slate-200 font-normal mb-6"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
        >
          Report. Track. Transform.
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          className="text-slate-400 text-base sm:text-lg md:text-xl text-center max-w-2xl mb-16 leading-relaxed"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
        >
          Your voice matters. Report civic issues instantly and watch your community improve in real-time.
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-14 w-full max-w-4xl"
        >
          {/* Photo Reports */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group relative rounded-xl overflow-hidden bg-slate-900/60 backdrop-blur-md border border-slate-700/60 p-8 hover:bg-slate-900/70 hover:border-slate-600/70 transition-all duration-300 shadow-lg shadow-black/20"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-lg bg-slate-800/70 flex items-center justify-center mb-4 group-hover:bg-slate-700/70 transition-colors">
                <Camera className="w-6 h-6 text-slate-300" strokeWidth={1.5} />
              </div>
              <p className="text-slate-200 text-sm font-medium">
                Photo Reports
              </p>
            </div>
          </motion.div>

          {/* GPS Tracking */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group relative rounded-xl overflow-hidden bg-slate-900/60 backdrop-blur-md border border-slate-700/60 p-8 hover:bg-slate-900/70 hover:border-slate-600/70 transition-all duration-300 shadow-lg shadow-black/20"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-lg bg-slate-800/70 flex items-center justify-center mb-4 group-hover:bg-slate-700/70 transition-colors">
                <MapPin className="w-6 h-6 text-blue-400" strokeWidth={2} />
              </div>
              <p className="text-slate-200 text-sm font-medium">
                GPS Tracking
              </p>
            </div>
          </motion.div>

          {/* Real-time Updates */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group relative rounded-xl overflow-hidden bg-slate-900/60 backdrop-blur-md border border-slate-700/60 p-8 hover:bg-slate-900/70 hover:border-slate-600/70 transition-all duration-300 shadow-lg shadow-black/20"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-lg bg-slate-800/70 flex items-center justify-center mb-4 group-hover:bg-slate-700/70 transition-colors">
                <Zap className="w-6 h-6 text-orange-400" strokeWidth={2} />
              </div>
              <p className="text-slate-200 text-sm font-medium">
                Real-time Updates
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
          whileHover={{ scale: 1.02, backgroundColor: '#2563eb' }}
          whileTap={{ scale: 0.98 }}
          onClick={onGetStarted}
          className="px-8 py-3.5 rounded-lg bg-blue-600 text-white font-medium text-base shadow-lg shadow-blue-950/50 hover:shadow-xl transition-all duration-300"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
        >
          Get Started
        </motion.button>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-slate-500 text-xs text-center mt-12"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
        >
          By continuing, you agree to help build a better India
        </motion.p>
      </div>
    </div>
  );
}
