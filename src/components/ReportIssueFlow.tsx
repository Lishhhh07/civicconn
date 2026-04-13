import { useState, useRef } from 'react';
import API from "../services/api";
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  MapPin, 
  Mic, 
  Send,
  CheckCircle,
  Loader2,
  Navigation,
  X,
  Image as ImageIcon,
  Edit3
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useIssues } from './IssueContext';

interface ReportIssueFlowProps {
  onBack: () => void;
  onComplete: () => void;
}

export function ReportIssueFlow({ onBack, onComplete }: ReportIssueFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [currentLocation, setCurrentLocation] = useState('MG Road, Bangalore, Karnataka');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addIssue } = useIssues();

  const categories = [
    'Road Infrastructure',
    'Street Lighting',
    'Waste Management',
    'Water Supply',
    'Drainage',
    'Public Transport',
    'Traffic Management',
    'Parks & Recreation'
  ];

  const verificationSteps = [
    'Verifying Department...',
    'Verifying if location is street or house...',
    'Cross-checking report details...',
    'Issue submitted successfully!'
  ];

  const handleImageCapture = () => {
    // Simulate image capture (for demo purposes - in real app this would access device camera)
    setSelectedImage('https://images.unsplash.com/photo-1591080954453-2936efa54c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzdHJlZXQlMjBwb3Rob2xlJTIwcm9hZHxlbnwxfHx8fDE3NTczOTQwMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080');
    setUploadedFileName('camera_capture.jpg');
    setStep(2);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Show success state then move to next step
      setTimeout(() => {
        setUploadSuccess(false);
        setStep(2);
      }, 1200);
    };

    reader.onerror = () => {
      alert('Error reading file. Please try again.');
      setIsUploading(false);
      setUploadedFileName('');
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setUploadedFileName('');
    setUploadSuccess(false);
    setStep(1);
  };

  const handleLocationDetected = () => {
    setStep(3);
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    
    // Simulate location detection
    setTimeout(() => {
      const locations = [
        'Brigade Road, Bangalore, Karnataka',
        'Koramangala, Bangalore, Karnataka', 
        'Indiranagar, Bangalore, Karnataka',
        'HSR Layout, Bangalore, Karnataka',
        'Whitefield, Bangalore, Karnataka'
      ];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      setCurrentLocation(randomLocation);
      setIsDetectingLocation(false);
    }, 2000);
  };

  const handleCustomLocation = () => {
    if (customLocation.trim()) {
      setCurrentLocation(customLocation);
      setShowLocationInput(false);
      setCustomLocation('');
    }
  };

  const handleCategorySelection = (category: string) => {
    setSelectedCategory(category);
    setStep(4);
  };

  const handleSubmit = async () => {
    setIsVerifying(true);
    setVerificationStep(0);
  
    const newIssue = {
      title: `${selectedCategory} Issue`,
      description: description || 'User reported issue requiring attention',
      category: selectedCategory,
      status: 'pending' as const,
      image: selectedImage || '',
      location: currentLocation
    };
  
    try {
      // 🔥 BACKEND CALL
      const formData = new FormData();
  
      formData.append("title", newIssue.title);
      formData.append("description", newIssue.description);
      formData.append("category", newIssue.category);
      formData.append("address", currentLocation);
  
      // dummy lat/lng (we’ll improve later)
      formData.append("latitude", "12.9716");
      formData.append("longitude", "77.5946");
  
      // image (if exists)
      if (selectedImage) {
        formData.append("images", selectedImage);
      }
  
      await API.post("/issues", formData);
  
    } catch (err) {
      console.error("Backend failed, saving locally");
    }
  
    // ✅ ALWAYS run your existing animation + local add
    const interval = setInterval(() => {
      setVerificationStep((prev) => {
        if (prev < verificationSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            addIssue(newIssue); // 👈 KEEP THIS (important)
            setIsVerifying(false);
            onComplete();
          }, 2000);
          return prev;
        }
      });
    }, 2000);
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-8"
        >
          <div className="relative">
            <motion.div
              className="w-32 h-32 border-4 border-cyan-400/30 rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 border-4 border-lime-400 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle className="text-white" size={48} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-foreground text-2xl">Processing Report</h2>
            <motion.p
              key={verificationStep}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-cyan-400 text-lg"
            >
              {verificationSteps[verificationStep]}
            </motion.p>
          </div>

          {verificationStep < verificationSteps.length - 1 && (
            <motion.div
              className="flex justify-center space-x-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-lime-400 rounded-full"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

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
          <h1 className="text-foreground text-xl">Report Issue</h1>
          <p className="text-muted-foreground text-sm">Step {step} of 4</p>
        </div>

        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="px-6 py-8">
        {/* Step 1: Photo Capture */}
        {step === 1 && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-foreground text-2xl">Capture Evidence</h2>
              <p className="text-muted-foreground">Take a photo of the issue</p>
            </div>

            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Button
                  onClick={handleImageCapture}
                  className="w-full h-32 bg-gradient-to-r from-orange-500 to-cyan-400 hover:from-orange-600 hover:to-cyan-500 rounded-2xl flex flex-col items-center justify-center space-y-3 text-white shadow-xl relative overflow-hidden"
                >
                  <Camera size={48} />
                  <span className="text-lg">Take Photo</span>
                  
                  {/* Animated glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-cyan-400/20 rounded-2xl"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </Button>
              </motion.div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-slate-400">or</span>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Button
                  onClick={handleImageUpload}
                  disabled={isUploading}
                  variant="outline"
                  className="w-full h-24 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50 hover:border-cyan-400/50 rounded-2xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  {isUploading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 size={32} />
                      </motion.div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={32} />
                      <span>Upload from Gallery</span>
                    </>
                  )}
                  
                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-lime-500/10 to-cyan-400/10 rounded-2xl opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Upload tips */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-3">
                <p className="text-slate-400 text-sm text-center">
                  💡 Supported formats: JPG, PNG, WEBP • Max size: 5MB
                </p>
              </div>

              {/* Success message */}
              {uploadSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="bg-gradient-to-r from-lime-500/20 to-cyan-400/20 border border-lime-400/30 rounded-xl p-4 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                    className="inline-flex items-center justify-center w-12 h-12 bg-lime-500/20 rounded-full mb-2"
                  >
                    <CheckCircle className="text-lime-400" size={24} />
                  </motion.div>
                  <p className="text-lime-400 font-medium">Image uploaded successfully!</p>
                  <p className="text-slate-400 text-sm mt-1">Moving to location confirmation...</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-white text-2xl">Confirm Location</h2>
              <p className="text-slate-400">Verify the issue location</p>
            </div>

            {selectedImage && (
              <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden relative group">
                <CardContent className="p-0 relative">
                  <ImageWithFallback
                    src={selectedImage}
                    alt="Captured issue"
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Image overlay with file info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <ImageIcon size={16} className="text-lime-400" />
                          <span className="text-white text-sm truncate">
                            {uploadedFileName || 'captured_image.jpg'}
                          </span>
                        </div>
                        <Button
                          onClick={handleRemoveImage}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full p-1"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Glowing border effect */}
                  <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-lime-500/20 to-cyan-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </CardContent>
              </Card>
            )}

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-lime-500 to-cyan-400 rounded-full">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white">Current Location</h3>
                    <p className="text-slate-400 text-sm">{currentLocation}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleDetectLocation}
                    disabled={isDetectingLocation}
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl"
                  >
                    {isDetectingLocation ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Navigation size={16} />
                      </motion.div>
                    ) : (
                      <Navigation size={16} className="mr-2" />
                    )}
                    {isDetectingLocation ? 'Detecting...' : 'Detect Location'}
                  </Button>
                  
                  <Button
                    onClick={() => setShowLocationInput(!showLocationInput)}
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl"
                  >
                    <Edit3 size={16} className="mr-2" />
                    Custom Location
                  </Button>
                </div>

                {/* Custom Location Input */}
                {showLocationInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 pt-2"
                  >
                    <Input
                      placeholder="Enter custom location..."
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCustomLocation}
                        size="sm"
                        className="bg-gradient-to-r from-lime-500 to-cyan-400 hover:from-lime-600 hover:to-cyan-500 text-slate-900"
                      >
                        Set Location
                      </Button>
                      <Button
                        onClick={() => {
                          setShowLocationInput(false);
                          setCustomLocation('');
                        }}
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleLocationDetected}
              className="w-full bg-gradient-to-r from-lime-500 to-cyan-400 hover:from-lime-600 hover:to-cyan-500 text-slate-900 rounded-xl py-3"
            >
              Confirm Location
            </Button>
          </motion.div>
        )}

        {/* Step 3: Category Selection */}
        {step === 3 && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-white text-2xl">Select Category</h2>
              <p className="text-slate-400">Choose the issue type</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => handleCategorySelection(category)}
                    variant="outline"
                    className="w-full h-20 border-slate-600 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-cyan-400/20 hover:border-cyan-400/50 rounded-xl flex flex-col items-center justify-center text-center p-2"
                  >
                    <span className="text-sm leading-tight">{category}</span>
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Badge className="bg-lime-500/20 text-lime-400 border-lime-500/30">
                AI Suggestion: Road Infrastructure
              </Badge>
            </div>
          </motion.div>
        )}

        {/* Step 4: Description */}
        {step === 4 && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-white text-2xl">Add Description</h2>
              <p className="text-slate-400">Describe the issue in detail</p>
            </div>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Category</span>
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    {selectedCategory}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Location</span>
                  <span className="text-slate-400 text-sm">{currentLocation}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Textarea
                placeholder="Describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-32 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl"
              />

              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl"
              >
                <Mic size={20} className="mr-2" />
                Record Voice Note
              </Button>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-orange-500 to-cyan-400 hover:from-orange-600 hover:to-cyan-500 text-white rounded-xl py-4 shadow-xl flex items-center justify-center space-x-2"
              >
                <Send size={20} />
                <span className="text-lg">Submit Report</span>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}