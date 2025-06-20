import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Clock, Globe, Award, Heart, ChevronLeft, ChevronRight } from "lucide-react";

const ImpactMetrics = () => {
  const [citizensCount, setCitizensCount] = useState(25000);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Increment citizens count every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCitizensCount(prev => prev + Math.floor(Math.random() * 10) + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      title: "Citizens Served",
      value: `${citizensCount.toLocaleString()}+`,
      description: "Rural citizens accessed government services",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      change: "+156% this quarter"
    },
    {
      title: "Response Time",
      value: "3.2 min",
      description: "Average query resolution time",
      icon: Clock,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      change: "-45% improvement"
    },
    {
      title: "Language Coverage",
      value: "5 Languages",
      description: "Regional languages supported",
      icon: Globe,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      change: "100% coverage in target states"
    },
    {
      title: "Success Rate",
      value: "94.5%",
      description: "Queries resolved successfully",
      icon: Award,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      change: "+8.2% from last month"
    },
    {
      title: "User Satisfaction",
      value: "4.3/5",
      description: "Average user rating",
      icon: Heart,
      color: "from-rose-500 to-pink-500",
      bgColor: "from-rose-50 to-pink-50",
      change: "+0.4 rating increase"
    },
    {
      title: "Digital Adoption",
      value: "78%",
      description: "First-time digital service users",
      icon: TrendingUp,
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50",
      change: "+23% new digital users"
    }
  ];

  const testimonials = [
    {
      name: "Kamala Devi",
      location: "Warangal, Telangana",
      text: "పెన్షన్ స్టేటస్ తెలుసుకోవడానికి ఇంతకు మునుపు చాలా కష్టపడేవాళ్ళం. ఇప్పుడు ఫోన్ లోనే తెలుగులో మాట్లాడి తెలుసుకోగలుగుతున్నాం.",
      translation: "Earlier we used to struggle a lot to know pension status. Now we can speak in Telugu on the phone and find out.",
      service: "Pension Check",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      location: "Bareilly, UP",
      text: "राशन कार्ड बनवाने के लिए बार-बार ऑफिस जाना पड़ता था। अब घर बैठे ही हिंदी में पूछ कर सब जानकारी मिल जाती है।",
      translation: "Had to visit the office repeatedly to get ration card made. Now we get all information by asking in Hindi from home.",
      service: "Ration Card",
      rating: 5
    },
    {
      name: "Priya Sharma",
      location: "Mysore, Karnataka",
      text: "ನಾನು ಗ್ರಾಮ ಸಹಾಯವಾಣಿಯ ಮೂಲಕ ನನ್ನ ಭೂ ದಾಖಲೆಗಳನ್ನು ಸುಲಭವಾಗಿ ಪರಿಶೀಲಿಸಲು ಸಾಧ್ಯವಾಯಿತು. ಇದು ತುಂಬಾ ಉಪಯುಕ್ತವಾಗಿದೆ!",
      translation: "I was able to easily verify my land records through Grama Sahayavani. It is very useful!",
      service: "Land Records",
      rating: 4
    },
    {
      name: "Tamilselvi",
      location: "Madurai, Tamil Nadu",
      text: "நான் இப்போது கிராம உதவியாளர் மூலம் எளிதாக உதவித்தொகைக்கு விண்ணப்பிக்கிறேன். இது மிகவும் பயனுள்ளதாக இருக்கிறது!",
      translation: "I am now easily applying for scholarship through Grama Helper. It is very useful!",
      service: "Scholarship Application",
      rating: 4
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Impact Metrics Header */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-serif mb-4">
          Real Impact on Rural India
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Measuring the transformation in digital access and government service delivery
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className={`shadow-xl bg-gradient-to-br ${metric.bgColor} dark:from-gray-800/50 dark:to-gray-700/50 border-2 hover:shadow-2xl transition-all transform hover:scale-105`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`bg-gradient-to-r ${metric.color} p-3 rounded-full`}>
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
                <Badge variant="outline" className="text-xs bg-white/50 dark:bg-gray-800/50">
                  {metric.change}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className={`text-3xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                  {metric.value}
                </div>
                <CardTitle className="text-lg text-gray-800 dark:text-gray-200">{metric.title}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Testimonials Carousel */}
      <Card className="shadow-xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-700">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-serif text-center text-green-800 dark:text-green-300">
            Stories from the Field
          </CardTitle>
          <p className="text-center text-gray-600 dark:text-gray-400">Real testimonials from rural citizens who benefited from GramaBot</p>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border-l-4 border-green-500 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-xl">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonials[currentTestimonial].location}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs">{testimonials[currentTestimonial].service}</Badge>
                    <div className="flex">{renderStars(testimonials[currentTestimonial].rating)}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={prevTestimonial}
                    className="p-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextTestimonial}
                    className="p-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <blockquote className="text-lg mb-4 italic text-gray-700 dark:text-gray-300 leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <p className="text-sm text-gray-500 dark:text-gray-400 border-t pt-4">
                Translation: "{testimonials[currentTestimonial].translation}"
              </p>
            </div>
            
            {/* Carousel indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Summary */}
      <Card className="shadow-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-700">
        <CardContent className="pt-8 pb-8 text-center">
          <h3 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 mb-4 font-serif">
            Bridging the Digital Divide, One Conversation at a Time
          </h3>
          <p className="text-indigo-700 dark:text-indigo-400 text-lg leading-relaxed max-w-4xl mx-auto">
            GramaBot is not just a chatbot—it's a bridge connecting rural India to digital governance, 
            ensuring that language barriers never prevent citizens from accessing their rights and services. 
            Through vernacular AI, we're making technology truly inclusive and accessible for everyone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactMetrics;
