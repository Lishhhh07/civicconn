import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, Smartphone, CreditCard, ArrowLeft } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  onBack: () => void;
}

export function LoginScreen({ onLogin, onBack }: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState('login');
  const [step, setStep] = useState(1);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = () => {
    setStep(2);
  };

  const handleVerifyOTP = () => {
    // Simulate OTP verification
    setTimeout(() => {
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            animate={{
              x: [0, Math.random() * 400],
              y: [0, Math.random() * 800],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-foreground hover:bg-accent rounded-xl"
          >
            <ArrowLeft size={24} />
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            <Card className="bg-card/50 backdrop-blur-xl border-border shadow-2xl">
              <CardHeader className="text-center space-y-4">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-cyan-400 rounded-full flex items-center justify-center"
                >
                  <Shield className="text-white" size={32} />
                </motion.div>
                <CardTitle className="text-white text-2xl">
                  Secure Authentication
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-700/50 rounded-xl">
                    <TabsTrigger 
                      value="login" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white rounded-lg"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white rounded-lg"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-6 mt-6">
                    {step === 1 && (
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <label className="text-white/80 text-sm">Aadhaar Number</label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                            <Input
                              placeholder="XXXX XXXX XXXX"
                              value={aadhaarNumber}
                              onChange={(e) => setAadhaarNumber(e.target.value)}
                              className="pl-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-white/80 text-sm">Mobile Number</label>
                          <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                            <Input
                              placeholder="+91 XXXXX XXXXX"
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value)}
                              className="pl-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                            />
                          </div>
                        </div>

                        <Button
                          onClick={handleSendOTP}
                          className="w-full bg-gradient-to-r from-orange-500 to-cyan-400 hover:from-orange-600 hover:to-cyan-500 text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Send OTP
                        </Button>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="space-y-6"
                      >
                        <div className="text-center space-y-2">
                          <h3 className="text-white">Enter OTP</h3>
                          <p className="text-slate-400 text-sm">
                            We've sent a 6-digit code to {mobileNumber}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <Input
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="text-center text-2xl tracking-widest bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-lime-400 focus:ring-lime-400/20"
                          />

                          <Button
                            onClick={handleVerifyOTP}
                            className="w-full bg-gradient-to-r from-lime-500 to-cyan-400 hover:from-lime-600 hover:to-cyan-500 text-slate-900 rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Verify & Continue
                          </Button>

                          <Button
                            variant="ghost"
                            onClick={() => setStep(1)}
                            className="w-full text-slate-400 hover:text-white hover:bg-slate-700/50"
                          >
                            Change Number
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-6 mt-6">
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label className="text-white/80 text-sm">Full Name</label>
                        <Input
                          placeholder="Enter your full name"
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-white/80 text-sm">Aadhaar Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                          <Input
                            placeholder="XXXX XXXX XXXX"
                            className="pl-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-white/80 text-sm">Mobile Number</label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                          <Input
                            placeholder="+91 XXXXX XXXXX"
                            className="pl-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={onLogin}
                        className="w-full bg-gradient-to-r from-orange-500 to-cyan-400 hover:from-orange-600 hover:to-cyan-500 text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Create Account
                      </Button>
                    </motion.div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center">
                  <p className="text-slate-400 text-xs">
                    Powered by DigiLocker • Secured with Aadhaar
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}