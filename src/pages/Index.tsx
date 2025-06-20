
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone, Users, Globe, TrendingUp, Award, Palette, Accessibility, Brain, Shield } from "lucide-react";
import EnhancedChatDemo from "@/components/EnhancedChatDemo";
import ServicesPortal from "@/components/ServicesPortal";
import AdminDashboard from "@/components/AdminDashboard";
import ImpactMetrics from "@/components/ImpactMetrics";
import AnimatedBackground from "@/components/AnimatedBackground";
import UserDashboard from "@/components/UserDashboard";
import LocationServices from "@/components/LocationServices";
import { ThemeProvider } from "@/components/ThemeProvider";

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const features = [
    {
      icon: MessageCircle,
      title: "WhatsApp Integration",
      description: "Native support for WhatsApp Business API for seamless communication"
    },
    {
      icon: Phone,
      title: "Voice Support (IVR)",
      description: "Voice-based interaction for illiterate users through Twilio/Exotel"
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Supports Telugu, Hindi, Kannada, Tamil, and English with native scripts"
    },
    {
      icon: Users,
      title: "Village-Level Access",
      description: "Designed specifically for rural citizens and government services"
    },
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Context memory, smart suggestions, and multi-step guidance"
    },
    {
      icon: Accessibility,
      title: "Accessibility Features",
      description: "High contrast mode, font controls, and voice commands"
    },
    {
      icon: Palette,
      title: "Customizable Interface",
      description: "Dark/light themes, custom avatars, and personalized experience"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Biometric authentication and data encryption for user safety"
    }
  ];

  const services = [
    "Pension Status Check",
    "Ration Card Application",
    "Health Scheme Registration",
    "Complaint Filing",
    "Land Records Verification",
    "Scholarship Applications"
  ];

  const techStack = [
    { category: "Frontend", items: ["React", "TypeScript", "Tailwind CSS"] },
    { category: "AI/NLP", items: ["OpenAI GPT", "Google Translate API", "Speech Recognition"] },
    { category: "Communication", items: ["WhatsApp Business API", "Twilio Voice", "SMS Gateway"] },
    { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "Redis"] }
  ];

  if (activeTab === 'demo') {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
          <AnimatedBackground />
          <div className="container mx-auto relative z-10 p-4">
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" onClick={() => setActiveTab('home')}>
                ← Back to Home
              </Button>
              <Badge variant="secondary">Enhanced Interactive Demo</Badge>
            </div>
            <EnhancedChatDemo />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (activeTab === 'dashboard') {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
          <AnimatedBackground />
          <div className="container mx-auto relative z-10 p-4">
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" onClick={() => setActiveTab('home')}>
                ← Back to Home
              </Button>
              <Badge variant="secondary">Personal Dashboard</Badge>
            </div>
            <UserDashboard />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (activeTab === 'locations') {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
          <AnimatedBackground />
          <div className="container mx-auto relative z-10 p-4">
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" onClick={() => setActiveTab('home')}>
                ← Back to Home
              </Button>
              <Badge variant="secondary">Location Services</Badge>
            </div>
            <LocationServices />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (activeTab === 'services') {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
          <AnimatedBackground />
          <div className="container mx-auto relative z-10 p-4">
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" onClick={() => setActiveTab('home')}>
                ← Back to Home
              </Button>
              <Badge variant="secondary">Services Portal</Badge>
            </div>
            <ServicesPortal onStartChat={() => setActiveTab('demo')} />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (activeTab === 'admin') {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
          <AnimatedBackground />
          <div className="container mx-auto relative z-10 p-4">
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" onClick={() => setActiveTab('home')}>
                ← Back to Home
              </Button>
              <Badge variant="secondary">Admin Dashboard</Badge>
            </div>
            <AdminDashboard />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
        <AnimatedBackground />
        
        {/* Enhanced Navigation */}
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg border-b-2 border-orange-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-orange-500 to-green-500 p-2 rounded-full">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent font-serif">
                  GramaBot
                </h1>
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  Enhanced Demo
                </Badge>
              </div>
              <div className="hidden md:flex space-x-4">
                <Button variant="ghost" onClick={() => setActiveTab('demo')} className="text-gray-700 dark:text-gray-300">
                  Enhanced Demo
                </Button>
                <Button variant="ghost" onClick={() => setActiveTab('dashboard')} className="text-gray-700 dark:text-gray-300">
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => setActiveTab('locations')} className="text-gray-700 dark:text-gray-300">
                  Locations
                </Button>
                <Button variant="ghost" onClick={() => setActiveTab('services')} className="text-gray-700 dark:text-gray-300">
                  Services
                </Button>
                <Button variant="ghost" onClick={() => setActiveTab('admin')} className="text-gray-700 dark:text-gray-300">
                  Analytics
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8 space-y-12 relative z-10">
          {/* Enhanced Hero Section */}
          <div className="text-center space-y-6 py-12">
            <div className="animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent mb-6 font-serif animate-pulse">
                GramaBot 2.0
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-4xl mx-auto font-light leading-relaxed">
                The Next Generation Vernacular AI Chatbot with Enhanced Features, Accessibility, and Intelligence
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <Button 
                  size="lg" 
                  onClick={() => setActiveTab('demo')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Try Enhanced Demo
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setActiveTab('dashboard')}
                  className="border-2 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Personal Dashboard
                </Button>
              </div>
            </div>
          </div>

          {/* Problem Statement */}
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-700 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl text-red-800 dark:text-red-300 font-serif">Problem Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 dark:text-red-300 text-base sm:text-lg leading-relaxed">
                In rural India, citizens struggle to access government services due to language barriers, 
                digital illiteracy, and complex processes. Most e-governance portals are not designed for 
                low-literacy users or regional language speakers, resulting in underutilization of essential 
                schemes like pensions, ration cards, and health benefits.
              </p>
            </CardContent>
          </Card>

          {/* Solution */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl text-green-800 dark:text-green-300 font-serif">Our Enhanced Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 dark:text-green-300 mb-6 text-base sm:text-lg leading-relaxed">
                GramaBot 2.0 provides voice and chat-based vernacular AI assistance with advanced features like 
                personal dashboards, location services, accessibility controls, and intelligent suggestions.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <h4 className="font-bold text-green-800 dark:text-green-300 mb-3 text-lg">Enhanced Features:</h4>
                  <ul className="text-green-700 dark:text-green-300 space-y-2">
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Personal dashboard & analytics</li>
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Location-based services</li>
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Advanced accessibility features</li>
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Smart reminders & notifications</li>
                  </ul>
                </div>
                <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <h4 className="font-bold text-green-800 dark:text-green-300 mb-3 text-lg">AI Intelligence:</h4>
                  <ul className="text-green-700 dark:text-green-300 space-y-2">
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Context memory & learning</li>
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Smart query suggestions</li>
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Multi-step process guidance</li>
                    <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Document scanning & OCR</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-serif">
              Enhanced Features & Capabilities
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 hover:border-blue-300 dark:hover:border-blue-700">
                  <CardHeader>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full w-fit mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Supported Services */}
          <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-700 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl sm:text-3xl font-serif text-blue-800 dark:text-blue-300">
                <Award className="mr-3 text-yellow-500" />
                Supported Government Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Impact Metrics */}
          <ImpactMetrics />

          {/* Tech Stack */}
          <Card className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-700 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl font-serif text-purple-800 dark:text-purple-300">Enhanced Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {techStack.map((tech, index) => (
                  <div key={index} className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-3">{tech.category}</h4>
                    <ul className="space-y-1">
                      {tech.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-purple-700 dark:text-purple-300 text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-700 shadow-xl text-center animate-fade-in">
            <CardContent className="py-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-indigo-800 dark:text-indigo-300 mb-4 font-serif">
                Experience GramaBot 2.0 Today!
              </h2>
              <p className="text-indigo-600 dark:text-indigo-400 mb-6 text-lg">
                Discover the future of government service accessibility with enhanced AI, accessibility, and intelligence
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg" 
                  onClick={() => setActiveTab('demo')}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-8 py-3"
                >
                  Try Enhanced Demo
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setActiveTab('dashboard')}
                  className="border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                >
                  Personal Dashboard
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setActiveTab('locations')}
                  className="border-2 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900"
                >
                  Find Locations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
