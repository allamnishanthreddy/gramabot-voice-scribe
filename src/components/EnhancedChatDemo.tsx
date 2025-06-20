
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
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const { currentLanguage, t } = useLanguage();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Enhanced service-specific responses with more context
  const serviceResponses = {
    'pension-inquiry': {
      English: {
        patterns: ['pension', 'retirement', 'old age', 'senior citizen'],
        responses: [
          "Your pension application (ID: PEN2024001234) has been approved! ₹5,000 will be credited to your account on the 1st of every month. You can collect your pension card from the nearest post office.",
          "To check your pension status, please provide your Aadhaar number. Your current pension amount is ₹5,000 per month.",
          "For pension-related queries, you can visit the District Collector office or call our helpline at 1800-123-4567."
        ]
      },
      Hindi: {
        patterns: ['पेंशन', 'सेवानिवृत्ति', 'बुजुर्ग', 'वृद्धावस्था'],
        responses: [
          "आपका पेंशन आवेदन (ID: PEN2024001234) स्वीकृत हो गया है! हर महीने की 1 तारीख को आपके खाते में ₹5,000 जमा होंगे।",
          "पेंशन की स्थिति जांचने के लिए, कृपया अपना आधार नंबर प्रदान करें। आपकी वर्तमान पेंशन राशि ₹5,000 प्रति माह है।",
          "पेंशन संबंधी प्रश्नों के लिए, आप जिला कलेक्टर कार्यालय जा सकते हैं या हमारी हेल्पलाइन 1800-123-4567 पर कॉल कर सकते हैं।"
        ]
      },
      Telugu: {
        patterns: ['పెన్షన్', 'పదవీ విరమణ', 'వృద్ధులు', 'సీనియర్'],
        responses: [
          "మీ పెన్షన్ దరఖాస్తు (ID: PEN2024001234) ఆమోదించబడింది! ప్రతి నెల 1వ తేదీన మీ ఖాతాలో ₹5,000 జమ అవుతుంది।",
          "పెన్షన్ స్థితిని తనిఖీ చేయడానికి, దయచేసి మీ ఆధార్ నంబర్ అందించండి। మీ ప్రస్తుత పెన్షన్ మొత్తం నెలకు ₹5,000.",
          "పెన్షన్ సంబంధిత ప్రశ్నలకు, మీరు జిల్లా కలెక్టర్ కార్యాలయానికి వెళ్లవచ్చు లేదా మా హెల్ప్‌లైన్ 1800-123-4567కు కాల్ చేయవచ్చు।"
        ]
      }
    },
    'ration-card': {
      English: {
        patterns: ['ration', 'food', 'card', 'subsidy', 'grain'],
        responses: [
          "To apply for a ration card, you need: Aadhaar card, address proof, income certificate, and family photographs. Processing takes 15-20 working days.",
          "Your ration card application is under review. You can track status using application number RAT2024005678.",
          "Ration card benefits include subsidized rice at ₹3/kg, wheat at ₹2/kg, and sugar at ₹13.50/kg."
        ]
      },
      Hindi: {
        patterns: ['राशन', 'खाद्य', 'कार्ड', 'सब्सिडी', 'अनाज'],
        responses: [
          "राशन कार्ड के लिए आवेदन करने के लिए आपको चाहिए: आधार कार्ड, पता प्रमाण, आय प्रमाणपत्र, और पारिवारिक तस्वीरें।",
          "आपका राशन कार्ड आवेदन समीक्षाधीन है। आप आवेदन संख्या RAT2024005678 का उपयोग करके स्थिति ट्रैक कर सकते हैं।",
          "राशन कार्ड के लाभों में सब्सिडी वाला चावल ₹3/किग्रा, गेहूं ₹2/किग्रा, और चीनी ₹13.50/किग्रा शामिल हैं।"
        ]
      },
      Telugu: {
        patterns: ['రేషన్', 'ఆహారం', 'కార్డ్', 'సబ్సిడీ', 'ధాన్యం'],
        responses: [
          "రేషన్ కార్డ్ కోసం దరఖాస్తు చేయడానికి మీకు అవసరం: ఆధార్ కార్డ్, చిరునామా రుజువు, ఆదాయ ధృవీకరణ పత్రం, మరియు కుటుంబ ఫోటోలు।",
          "మీ రేషన్ కార్డ్ దరఖాస్తు సమీక్షలో ఉంది. మీరు దరఖాస్తు నంబర్ RAT2024005678 ఉపయోగించి స్థితిని ట్రాక్ చేయవచ్చు।",
          "రేషన్ కార్డ్ ప్రయోజనాలలో సబ్సిడీ బియ్యం ₹3/కిలో, గోధుమలు ₹2/కిలో, మరియు చక్కెర ₹13.50/కిలో ఉన్నాయి।"
        ]
      }
    }
  };

  // Auto-greeting when component mounts
  useEffect(() => {
    const serviceContext = localStorage.getItem('chatbot-context');
    
    let greetingText = '';
    
    if (serviceContext && serviceResponses[serviceContext as keyof typeof serviceResponses]) {
      const service = serviceResponses[serviceContext as keyof typeof serviceResponses];
      const langService = service[currentLanguage as keyof typeof service];
      greetingText = langService.responses[0];
    } else {
      const greetings = {
        English: "Hey! I'm GramaBot, your AI assistant for government services. How can I help you today?",
        Hindi: "हे! मैं ग्रामाबॉट हूँ, सरकारी सेवाओं के लिए आपका AI सहायक। आज मैं आपकी कैसे सहायता कर सकता हूँ?",
        Telugu: "హే! నేను గ్రామాబాట్, ప్రభుత్వ సేవల కోసం మీ AI సహాయకుడను। ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?"
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

    // Speak the greeting if speech is enabled
    if (speechEnabled) {
      speakText(greetingText);
    }

    if (serviceContext) {
      localStorage.removeItem('chatbot-context');
      localStorage.removeItem('chatbot-service');
    }
  }, [currentLanguage, speechEnabled]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getRelevantResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Check each service for pattern matches
    for (const [serviceKey, service] of Object.entries(serviceResponses)) {
      const langService = service[currentLanguage as keyof typeof service];
      if (langService && langService.patterns) {
        for (const pattern of langService.patterns) {
          if (lowerQuery.includes(pattern.toLowerCase())) {
            const randomIndex = Math.floor(Math.random() * langService.responses.length);
            return langService.responses[randomIndex];
          }
        }
      }
    }

    // Default responses if no pattern matches
    const defaultResponses = {
      English: [
        "Thank you for your question. Let me help you with that government service information.",
        "I understand you need assistance with government services. Could you please be more specific about what you need?",
        "I'm here to help with various government services like pension, ration card, health schemes, and more. What specifically can I assist you with?"
      ],
      Hindi: [
        "आपके प्रश्न के लिए धन्यवाद। मैं उस सरकारी सेवा की जानकारी के साथ आपकी सहायता करता हूँ।",
        "मैं समझता हूँ कि आपको सरकारी सेवाओं में सहायता चाहिए। कृपया बताएं कि आपको क्या चाहिए?",
        "मैं पेंशन, राशन कार्ड, स्वास्थ्य योजनाओं और अन्य सरकारी सेवाओं में सहायता के लिए यहाँ हूँ।"
      ],
      Telugu: [
        "మీ ప్రశ్నకు ధన్యవాదాలు. ఆ ప్రభుత్వ సేవా సమాచారంతో నేను మీకు సహాయం చేస్తాను.",
        "మీకు ప్రభుత్వ సేవలలో సహాయం అవసరమని నేను అర్థం చేసుకున్నాను. దయచేసి మీకు ఏమి అవసరమో తెలియజేయండి?",
        "నేను పెన్షన్, రేషన్ కార్డ్, ఆరోగ్య పథకాలు మరియు ఇతర ప్రభుత్వ సేవలలో సహాయం కోసం ఇక్కడ ఉన్నాను।"
      ]
    };
    
    const responses = defaultResponses[currentLanguage as keyof typeof defaultResponses];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
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
      const botResponse = response || getRelevantResponse(messageText);
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        type: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      if (speechEnabled) {
        speakText(botResponse);
      }
    }, 2000);
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Set language based on current selection
      const languageCodes = {
        English: 'en-US',
        Hindi: 'hi-IN',
        Telugu: 'te-IN'
      };
      
      recognition.lang = languageCodes[currentLanguage as keyof typeof languageCodes];
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        setIsListening(true);
        console.log(`Speech recognition started in ${currentLanguage}`);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognized:', transcript);
        setInputText(transcript);
        setTimeout(() => {
          handleSendMessage(transcript);
        }, 500);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        console.log('Speech recognition ended');
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
      recognition.start();
    } else {
      console.error('Speech recognition not supported');
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && speechEnabled) {
      speechSynthesis.cancel(); // Cancel any ongoing speech
      
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language and voice
      const languageCodes = {
        English: 'en-US',
        Hindi: 'hi-IN',
        Telugu: 'te-IN'
      };
      
      utterance.lang = languageCodes[currentLanguage as keyof typeof languageCodes];
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const predefinedQueries = {
    English: [
      { query: "Check pension status", response: serviceResponses['pension-inquiry']['English'].responses[0] },
      { query: "Apply for ration card", response: serviceResponses['ration-card']['English'].responses[0] }
    ],
    Hindi: [
      { query: "पेंशन की स्थिति जांचें", response: serviceResponses['pension-inquiry']['Hindi'].responses[0] },
      { query: "राशन कार्ड के लिए आवेदन करें", response: serviceResponses['ration-card']['Hindi'].responses[0] }
    ],
    Telugu: [
      { query: "పెన్షన్ స్థితిని తనిఖీ చేయండి", response: serviceResponses['pension-inquiry']['Telugu'].responses[0] },
      { query: "రేషన్ కార్డ్ కోసం దరఖాస్తు చేయండి", response: serviceResponses['ration-card']['Telugu'].responses[0] }
    ]
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
                    onClick={() => setSpeechEnabled(!speechEnabled)}
                    className={`${speechEnabled ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
                  >
                    {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
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
                      onClick={isListening ? () => {
                        if (recognitionRef.current) {
                          recognitionRef.current.stop();
                        }
                        setIsListening(false);
                      } : startListening}
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

              {speechEnabled && (
                <div className="text-center mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isSpeaking ? '🔊 Speaking...' : '🔊 Speech responses enabled'}
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
