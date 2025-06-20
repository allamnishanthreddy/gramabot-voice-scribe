
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Mic, MicOff, Send, Volume2, VolumeX, ThumbsUp, ThumbsDown, Bell, Star } from "lucide-react";
import VoiceControls from "./VoiceControls";
import AccessibilityControls from "./AccessibilityControls";
import { useLanguage } from "./LanguageProvider";

interface Message {
  id: string;
  text: string;
  type: 'user' | 'bot';
  timestamp: Date;
  translation?: string;
  reactions?: string[];
  rating?: number;
}

const EnhancedChatDemo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const { currentLanguage, t } = useLanguage();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Service-specific responses
  const serviceResponses = {
    'pension-inquiry': {
      English: "Hello! I'm here to help you with your pension inquiry. Your pension application (ID: PEN2024001234) has been approved! ₹5,000 will be credited to your account on the 1st of every month. You can collect your pension card from the nearest post office in Hyderabad.",
      Hindi: "नमस्ते! मैं आपकी पेंशन की जांच में आपकी सहायता के लिए यहाँ हूँ। आपका पेंशन आवेदन (ID: PEN2024001234) स्वीकृत हो गया है! हर महीने की 1 तारीख को आपके खाते में ₹5,000 जमा होंगे।",
      Telugu: "నమస్కారం! మీ పెన్షన్ విచారణలో మీకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను। మీ పెన్షన్ దరఖాస్తు (ID: PEN2024001234) ఆమోదించబడింది! ప్రతి నెల 1వ తేదీన మీ ఖాతాలో ₹5,000 జమ అవుతుంది।"
    },
    'ration-card': {
      English: "Hello! I can help you with your ration card application. To apply for a new ration card, you'll need: 1) Aadhaar card 2) Address proof 3) Income certificate 4) Family photographs. The process takes 15-20 working days.",
      Hindi: "नमस्ते! मैं आपके राशन कार्ड आवेदन में आपकी सहायता कर सकता हूँ। नए राशन कार्ड के लिए आवेदन करने के लिए आपको चाहिए: 1) आधार कार्ड 2) पता प्रमाण 3) आय प्रमाणपत्र 4) पारिवारिक तस्वीरें।",
      Telugu: "నమస్కారం! మీ రేషన్ కార్డ్ దరఖాస్తులో నేను మీకు సహాయం చేయగలను. కొత్త రేషన్ కార్డ్ కోసం దరఖాస్తు చేయడానికి మీకు అవసరం: 1) ఆధార్ కార్డ్ 2) చిరునామా రుజువు 3) ఆదాయ ధృవీకరణ పత్రం 4) కుటుంబ ఫోటోలు।"
    },
    'health-scheme': {
      English: "Hello! I'm here to help you with health scheme registration. You can register for Ayushman Bharat and state health insurance schemes. Required documents: Aadhaar card, ration card, and income certificate.",
      Hindi: "नमस्ते! मैं स्वास्थ्य योजना पंजीकरण में आपकी सहायता के लिए यहाँ हूँ। आप आयुष्मान भारत और राज्य स्वास्थ्य बीमा योजनाओं के लिए पंजीकरण कर सकते हैं।",
      Telugu: "నమస్కారం! ఆరోగ్య పథకం నమోదులో నేను మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను। మీరు ఆయుష్మాన్ భారత్ మరియు రాష్ట్ర ఆరోగ్య బీమా పథకాలకు నమోదు చేసుకోవచ్చు।"
    },
    'land-records': {
      English: "Hello! I can help you verify your land records and property documents. Please provide your survey number and village details for verification.",
      Hindi: "नमस्ते! मैं आपके भूमि रिकॉर्ड और संपत्ति दस्तावेजों को सत्यापित करने में आपकी सहायता कर सकता हूँ।",
      Telugu: "నమస్కారం! మీ భూమి రికార్డులు మరియు ఆస్తి పత్రాలను ధృవీకరించడంలో నేను మీకు సహాయం చేయగలను।"
    },
    'scholarship': {
      English: "Hello! I'm here to help you with scholarship applications. Available scholarships include pre-matric, post-matric, and merit-based scholarships for students from Telangana.",
      Hindi: "नमस्ते! मैं छात्रवृत्ति आवेदनों में आपकी सहायता के लिए यहाँ हूँ।",
      Telugu: "నమస్కారం! స్కాలర్‌షిప్ దరఖాస్తులలో నేను మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను।"
    },
    'complaint': {
      English: "Hello! I can help you file complaints against government services. Please describe your issue and I'll guide you through the complaint process.",
      Hindi: "नमस्ते! मैं सरकारी सेवाओं के खिलाफ शिकायत दर्ज करने में आपकी सहायता कर सकता हूँ।",
      Telugu: "నమస్కారం! ప్రభుత్వ సేవలకు వ్యతిరేకంగా ఫిర్యాదులు దాఖలు చేయడంలో నేను మీకు సహాయం చేయగలను।"
    }
  };

  const predefinedQueries = {
    English: [
      {
        query: "Check pension status",
        response: serviceResponses['pension-inquiry']['English']
      },
      {
        query: "Apply for ration card",
        response: serviceResponses['ration-card']['English']
      },
      {
        query: "Health scheme registration",
        response: serviceResponses['health-scheme']['English']
      }
    ],
    Hindi: [
      {
        query: "पेंशन की स्थिति जांचें",
        response: serviceResponses['pension-inquiry']['Hindi']
      },
      {
        query: "राशन कार्ड के लिए आवेदन करें",
        response: serviceResponses['ration-card']['Hindi']
      }
    ],
    Telugu: [
      {
        query: "పెన్షన్ స్థితిని తనిఖీ చేయండి",
        response: serviceResponses['pension-inquiry']['Telugu']
      },
      {
        query: "రేషన్ కార్డ్ కోసం దరఖాస్తు చేయండి",
        response: serviceResponses['ration-card']['Telugu']
      }
    ]
  };

  // Auto-greeting when component mounts or service context changes
  useEffect(() => {
    const serviceContext = localStorage.getItem('chatbot-context');
    const serviceName = localStorage.getItem('chatbot-service');
    
    let greetingText = '';
    
    if (serviceContext && serviceResponses[serviceContext as keyof typeof serviceResponses]) {
      // Service-specific greeting
      greetingText = serviceResponses[serviceContext as keyof typeof serviceResponses][currentLanguage as keyof typeof serviceResponses['pension-inquiry']];
    } else {
      // Default greeting
      const greetings = {
        English: "Hello! I'm GramaBot, your AI assistant for government services. How can I help you today?",
        Hindi: "नमस्ते! मैं ग्रामाबॉट हूँ, सरकारी सेवाओं के लिए आपका AI सहायक। आज मैं आपकी कैसे सहायता कर सकता हूँ?",
        Telugu: "నమస్కారం! నేను గ్రామాబాట్, ప్రభుత్వ సేవల కోసం మీ AI సహాయకుడను। ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?"
      };
      greetingText = greetings[currentLanguage as keyof typeof greetings];
    }

    const greeting: Message = {
      id: `bot-greeting-${Date.now()}`,
      text: greetingText,
      type: 'bot',
      timestamp: new Date()
    };
    setMessages([greeting]);

    // Clear service context after using it
    if (serviceContext) {
      localStorage.removeItem('chatbot-context');
      localStorage.removeItem('chatbot-service');
    }
  }, [currentLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (query?: string, response?: string) => {
    const messageText = query || inputText.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageText,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = response;
      
      if (!botResponse) {
        const greetings = {
          English: "Thank you for your question. Let me help you with that government service information.",
          Hindi: "आपके प्रश्न के लिए धन्यवाद। मैं उस सरकारी सेवा की जानकारी के साथ आपकी सहायता करता हूँ।",
          Telugu: "మీ ప్రశ్నకు ధన్యవాదాలు. ఆ ప్రభుత్వ సేవా సమాచారంతో నేను మీకు సహాయం చేస్తాను।"
        };
        botResponse = greetings[currentLanguage as keyof typeof greetings];
      }
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        type: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      if (isSpeaking) {
        speakText(botResponse);
      }
    }, 2000);
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = currentLanguage === 'Hindi' ? 'hi-IN' : currentLanguage === 'Telugu' ? 'te-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setTimeout(() => {
          handleSendMessage(transcript);
        }, 500);
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      recognition.start();
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'Hindi' ? 'hi-IN' : currentLanguage === 'Telugu' ? 'te-IN' : 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen relative p-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-2 border-orange-200 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-serif flex items-center space-x-3">
                  <Bot className="h-8 w-8" />
                  <span>GramaBot {t('nav.demo')}</span>
                </CardTitle>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {currentLanguage}
                  </Badge>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsVoiceMode(!isVoiceMode)}
                    className={`${isVoiceMode ? 'bg-red-500 text-white' : 'bg-white text-gray-800'}`}
                  >
                    {isVoiceMode ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Chat Messages */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 p-4 h-96 overflow-y-auto mb-6 space-y-4 shadow-inner">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className={`flex items-start space-x-2 max-w-xs sm:max-w-md lg:max-w-lg`}>
                      {message.type === 'bot' && (
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-lg ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                            : 'bg-white dark:bg-gray-700 border-2 border-blue-200 dark:border-blue-600'
                        }`}
                      >
                        <p className={`text-sm leading-relaxed ${message.type === 'bot' ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>
                          {message.text}
                        </p>
                        <span className={`text-xs opacity-50 mt-2 block ${message.type === 'bot' ? 'text-gray-600 dark:text-gray-400' : 'text-white'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {message.type === 'user' && (
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="flex items-start space-x-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-700 border-2 border-blue-200 dark:border-blue-600 px-4 py-3 rounded-2xl shadow-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Quick Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {predefinedQueries[currentLanguage]?.map((query, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendMessage(query.query, query.response)}
                      className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900 border-blue-300 dark:border-blue-600"
                    >
                      {query.query}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t('chat.placeholder')}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="border-2 border-blue-300 dark:border-blue-600 focus:border-blue-500 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                </div>
                
                <div className="flex gap-2">
                  {isVoiceMode ? (
                    <Button 
                      size="icon" 
                      onClick={isListening ? () => setIsListening(false) : startListening}
                      className={`${
                        isListening 
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                      } shadow-lg`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  ) : (
                    <Button 
                      size="icon" 
                      onClick={() => handleSendMessage()}
                      className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {isVoiceMode && (
                <div className="text-center mt-4">
                  <p className={`text-sm ${isListening ? 'text-red-600 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                    {isListening ? `🎤 Listening in ${currentLanguage}... Speak now!` : `🎤 Voice mode activated - Click microphone to speak in ${currentLanguage}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Controls Sidebar */}
        <div className="space-y-4">
          {showControls && (
            <div className="space-y-4">
              <VoiceControls
                isPlaying={isSpeaking}
                onTogglePlay={() => isSpeaking ? speechSynthesis.cancel() : speakText("Test voice")}
                onSpeedChange={(speed) => console.log('Speed changed:', speed)}
                onVolumeChange={(volume) => console.log('Volume changed:', volume)}
              />
              <AccessibilityControls />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedChatDemo;
