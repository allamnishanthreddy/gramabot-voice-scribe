
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, CreditCard, Heart, Users, MapPin, GraduationCap, Search, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

interface ServicesPortalProps {
  onStartChat?: (serviceType?: string) => void;
}

const ServicesPortal = ({ onStartChat }: ServicesPortalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { t } = useLanguage();

  const services = [
    {
      id: 1,
      name: "Pension Status Check",
      description: "Check your pension application status and payment history",
      category: "pension",
      icon: CreditCard,
      status: "active",
      languages: ["Hindi", "Telugu", "English", "Tamil", "Kannada"],
      avgResponseTime: "2 minutes",
      chatContext: "pension-inquiry"
    },
    {
      id: 2,
      name: "Ration Card Application",
      description: "Apply for new ration card or update existing information",
      category: "welfare",
      icon: FileText,
      status: "active",
      languages: ["Hindi", "Telugu", "English", "Tamil", "Kannada"],
      avgResponseTime: "5 minutes",
      chatContext: "ration-card"
    },
    {
      id: 3,
      name: "Health Scheme Registration",
      description: "Register for government health insurance schemes",
      category: "health",
      icon: Heart,
      status: "active",
      languages: ["Hindi", "Telugu", "English", "Tamil", "Kannada"],
      avgResponseTime: "3 minutes",
      chatContext: "health-scheme"
    },
    {
      id: 4,
      name: "Land Records Verification",
      description: "Verify land ownership and property documents",
      category: "land",
      icon: MapPin,
      status: "active",
      languages: ["Hindi", "Telugu", "English", "Tamil", "Kannada"],
      avgResponseTime: "10 minutes",
      chatContext: "land-records"
    },
    {
      id: 5,
      name: "Scholarship Applications",
      description: "Apply for educational scholarships and track status",
      category: "education",
      icon: GraduationCap,
      status: "active",
      languages: ["Hindi", "English", "Tamil", "Kannada"],
      avgResponseTime: "7 minutes",
      chatContext: "scholarship"
    },
    {
      id: 6,
      name: "Complaint Filing",
      description: "File complaints against government services",
      category: "grievance",
      icon: AlertCircle,
      status: "active",
      languages: ["Hindi", "Telugu", "English", "Tamil", "Kannada"],
      avgResponseTime: "1 minute",
      chatContext: "complaint"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services', icon: Users },
    { id: 'pension', name: 'Pension', icon: CreditCard },
    { id: 'welfare', name: 'Welfare', icon: FileText },
    { id: 'health', name: 'Health', icon: Heart },
    { id: 'land', name: 'Land Records', icon: MapPin },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'grievance', name: 'Grievances', icon: AlertCircle }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'beta': return 'bg-yellow-500';
      case 'maintenance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'beta': return <Clock className="w-4 h-4" />;
      case 'maintenance': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleStartChat = (service: any) => {
    console.log('Starting chat for service:', service.name);
    // Store the service context for the chatbot
    localStorage.setItem('chatbot-context', service.chatContext);
    localStorage.setItem('chatbot-service', service.name);
    
    // Call the callback to switch to demo tab
    if (onStartChat) {
      onStartChat(service.chatContext);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-serif text-center">{t('services.title')}</CardTitle>
          <CardDescription className="text-blue-100 text-center text-base sm:text-lg">
            {t('services.subtitle')}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-1"
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredServices.map(service => (
          <Card key={service.id} className="hover:shadow-xl transition-all transform hover:scale-105 bg-white dark:bg-gray-800 border-2 hover:border-blue-300 dark:hover:border-blue-600">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 sm:p-3 rounded-full">
                  <service.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`}></div>
                  <Badge variant={service.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {getStatusIcon(service.status)}
                    <span className="ml-1 capitalize">{service.status}</span>
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-base sm:text-lg text-gray-800 dark:text-gray-200">{service.name}</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Supported Languages:</p>
                  <div className="flex flex-wrap gap-1">
                    {service.languages.map(lang => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Avg Response Time</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">{service.avgResponseTime}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-xs sm:text-sm"
                    onClick={() => handleStartChat(service)}
                  >
                    {t('services.startChat')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dynamic Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="text-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{services.filter(s => s.status === 'active').length}</div>
            <div className="text-xs sm:text-sm text-green-700 dark:text-green-300">Active Services</div>
          </CardContent>
        </Card>
        <Card className="text-center bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">5</div>
            <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">Languages Supported</div>
          </CardContent>
        </Card>
        <Card className="text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(services.reduce((acc, s) => acc + parseInt(s.avgResponseTime), 0) / services.length)} min
            </div>
            <div className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">Avg Response Time</div>
          </CardContent>
        </Card>
        <Card className="text-center bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700">
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">98.5%</div>
            <div className="text-xs sm:text-sm text-orange-700 dark:text-orange-300">Service Uptime</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServicesPortal;
