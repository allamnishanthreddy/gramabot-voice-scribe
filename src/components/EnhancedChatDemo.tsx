
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Mic, MicOff, Send, Volume2, VolumeX, ThumbsUp, ThumbsDown, Bell, Star } from "lucide-react";
import VoiceControls from "./VoiceControls";
import AccessibilityControls from "./AccessibilityControls";

interface Message {
  id: string;
  text: string;
  type: 'user' | 'bot';
  timestamp: Date;
  translation?: string;
  reactions?: string[];
  rating?: number;
}

interface Reminder {
  id: string;
  text: string;
  date: Date;
}

const EnhancedChatDemo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'English', name: 'English', flag: '🇺🇸' },
    { code: 'Hindi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'Telugu', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'Kannada', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'Tamil', name: 'தமிழ்', flag: '🇮🇳' }
  ];

  const placeholderTexts: Record<string, string> = {
    English: "Ask about government services in English...",
    Hindi: "हिंदी में सरकारी सेवाओं के बारे में पूछें...",
    Telugu: "తెలుగులో ప్రభుత్వ సేవల గురించి అడగండి...",
    Kannada: "ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ...",
    Tamil: "தமிழில் அரசாங்க சேவைகள் பற்றி கேளுங்கள்..."
  };

  const predefinedQueries: Record<string, Array<{query: string; response: string; translation: string; nextSteps?: string[]}>> = {
    English: [
      {
        query: "Check pension status",
        response: "Your pension application (ID: PEN2024001234) has been approved! ₹5,000 will be credited to your account on the 1st of every month.",
        translation: "आपकी पेंशन का आवेदन स्वीकृत हो गया है!"
      },
      {
        query: "Apply for ration card",
        response: "To apply for a ration card, you'll need: Aadhaar card, address proof, and income certificate. Would you like me to help you with the application process?",
        translation: "राशन कार्ड के लिए आवेदन करने में मैं आपकी सहायता कर सकता हूं।"
      }
    ],
    Hindi: [
      {
        query: "पेंशन स्टेटस चेक करें",
        response: "आपकी पेंशन का आवेदन (ID: PEN2024001234) स्वीकृत हो गया है! हर महीने की 1 तारीख को ₹5,000 आपके खाते में जमा होंगे।",
        translation: "Your pension application has been approved!"
      },
      {
        query: "राशन कार्ड के लिए आवेदन",
        response: "राशन कार्ड के लिए आपको चाहिए: आधार कार्ड, पता प्रमाण, और आय प्रमाण पत्र। क्या आप चाहते हैं कि मैं आवेदन प्रक्रिया में आपकी सहायता करूं?",
        translation: "I can help you with the ration card application process."
      }
    ],
    Telugu: [
      {
        query: "పెన్షన్ స్టేటస్ చూడండి",
        response: "మీ పెన్షన్ దరఖాస్తు (ID: PEN2024001234) ఆమోదించబడింది! ప్రతి నెల 1వ తేదీన ₹5,000 మీ ఖాతాలో జమ చేయబడుతుంది.",
        translation: "Your pension application has been approved!"
      }
    ],
    Kannada: [
      {
        query: "ಪಿಂಚಣಿ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ",
        response: "ನಿಮ್ಮ ಪಿಂಚಣಿ ಅರ್ಜಿ (ID: PEN2024001234) ಅನುಮೋದಿಸಲಾಗಿದೆ! ಪ್ರತಿ ತಿಂಗಳ 1ನೇ ದಿನ ₹5,000 ನಿಮ್ಮ ಖಾತೆಗೆ ಜಮಾ ಮಾಡಲಾಗುತ್ತದೆ.",
        translation: "Your pension application has been approved!"
      }
    ],
    Tamil: [
      {
        query: "ஓய்வூதிய நிலையை சரிபார்க்கவும்",
        response: "உங்கள் ஓய்வூதிய விண்ணப்பம் (ID: PEN2024001234) அங்கீகரிக்கப்பட்டுள்ளது! ஒவ்வொரு மாதமும் 1ஆம் தேதி ₹5,000 உங்கள் கணக்கில் வரவு வைக்கப்படும்.",
        translation: "Your pension application has been approved!"
      }
    ]
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (query?: string, response?: string, nextSteps?: string[]) => {
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
      const botResponse = response || `Thank you for your query: "${messageText}". Our team is processing your request and will respond shortly with relevant information about government services.`;
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        type: 'bot',
        timestamp: new Date(),
        translation: selectedLanguage !== 'English' ? 'Response translated from local language' : undefined
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      setShowRating(true);
      
      if (isSpeaking) {
        speakText(botResponse);
      }
    }, 2000);
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const addReaction = (messageId: string, reaction: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, reactions: [...(msg.reactions || []), reaction] }
        : msg
    ));
  };

  const addRating = (messageId: string, rating: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, rating }
        : msg
    ));
    setShowRating(false);
  };

  const setReminder = (text: string) => {
    const reminder: Reminder = {
      id: `reminder-${Date.now()}`,
      text,
      date: new Date()
    };
    setReminders(prev => [...prev, reminder]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-orange-200 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-serif flex items-center space-x-3">
                  <Bot className="h-8 w-8" />
                  <span>GramaBot Enhanced Demo</span>
                </CardTitle>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {selectedLanguage}
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
              
              <div className="flex flex-wrap gap-2 mt-4">
                {languages.map(lang => (
                  <Button
                    key={lang.code}
                    size="sm"
                    variant={selectedLanguage === lang.code ? "secondary" : "outline"}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`text-xs ${
                      selectedLanguage === lang.code 
                        ? 'bg-white text-orange-600' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {lang.flag} {lang.name}
                  </Button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Enhanced Chat Messages */}
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
                        <div className="flex items-center justify-between mb-2">
                          <p className={`text-sm leading-relaxed ${message.type === 'bot' ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>{message.text}</p>
                          <span className={`text-xs opacity-50 ml-2 ${message.type === 'bot' ? 'text-gray-600 dark:text-gray-400' : 'text-white'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {message.translation && message.type === 'bot' && (
                          <p className="text-xs opacity-70 mt-2 italic border-t border-gray-200 dark:border-gray-600 pt-2 text-gray-600 dark:text-gray-400">
                            {message.translation}
                          </p>
                        )}
                        
                        {/* Message Actions */}
                        {message.type === 'bot' && (
                          <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => speakText(message.text)}
                              className="p-1 h-auto"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => addReaction(message.id, '👍')}
                              className="p-1 h-auto"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              {message.reactions?.includes('👍') && <span className="ml-1 text-xs">1</span>}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => addReaction(message.id, '👎')}
                              className="p-1 h-auto"
                            >
                              <ThumbsDown className="w-3 h-3" />
                              {message.reactions?.includes('👎') && <span className="ml-1 text-xs">1</span>}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setReminder(message.text)}
                              className="p-1 h-auto"
                            >
                              <Bell className="w-3 h-3" />
                            </Button>
                            {message.rating && (
                              <div className="flex items-center ml-2">
                                {Array.from({ length: message.rating }, (_, i) => (
                                  <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {message.type === 'user' && (
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
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
                
                {/* Rating Section */}
                {showRating && (
                  <div className="flex justify-center">
                    <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
                      <CardContent className="p-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rate this conversation:</p>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Button
                              key={star}
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentRating(star);
                                const lastBotMessage = messages.filter(m => m.type === 'bot').pop();
                                if (lastBotMessage) addRating(lastBotMessage.id, star);
                              }}
                              className="p-1"
                            >
                              <Star 
                                className={`w-4 h-4 ${star <= currentRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                              />
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Quick Actions */}
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Quick Actions (Click to try):</p>
                <div className="flex flex-wrap gap-2">
                  {predefinedQueries[selectedLanguage]?.map((query, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendMessage(query.query, query.response, query.nextSteps)}
                      className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900 border-blue-300 dark:border-blue-600 hover:border-blue-500 transition-all"
                    >
                      {selectedLanguage === 'English' ? query.translation : query.query}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Enhanced Input Area */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={placeholderTexts[selectedLanguage]}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isVoiceMode && isListening}
                    className="pr-12 border-2 border-blue-300 dark:border-blue-600 focus:border-blue-500 rounded-lg text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
                  />
                  {isVoiceMode && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={isListening ? stopListening : startListening}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 ${
                        isListening ? 'text-red-500' : 'text-blue-500'
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {isVoiceMode ? (
                    <Button 
                      size="icon" 
                      onClick={isListening ? stopListening : startListening}
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
                  
                  {isSpeaking && (
                    <Button
                      size="icon"
                      onClick={stopSpeaking}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <VolumeX className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {isVoiceMode && (
                <div className="text-center mt-4">
                  <p className={`text-sm ${isListening ? 'text-red-600 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                    {isListening ? `🎤 Listening in ${languages.find(l => l.code === selectedLanguage)?.name}... Speak now!` : `🎤 Voice mode activated - Click the microphone to speak in ${languages.find(l => l.code === selectedLanguage)?.name}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Controls Sidebar */}
        <div className="space-y-4">
          <Button
            onClick={() => setShowControls(!showControls)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {showControls ? 'Hide Controls' : 'Show Controls'}
          </Button>
          
          {showControls && (
            <div className="space-y-4">
              <VoiceControls
                isPlaying={isSpeaking}
                onTogglePlay={() => isSpeaking ? stopSpeaking() : speakText("Test voice")}
                onSpeedChange={(speed) => console.log('Speed changed:', speed)}
                onVolumeChange={(volume) => console.log('Volume changed:', volume)}
              />
              <AccessibilityControls />
            </div>
          )}

          {/* Reminders */}
          {reminders.length > 0 && (
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <Bell className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-yellow-800 dark:text-yellow-300">Reminders</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {reminders.map(reminder => (
                    <div key={reminder.id} className="text-xs p-2 bg-white dark:bg-gray-700 rounded border">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{reminder.text.substring(0, 50)}...</p>
                      <p className="text-gray-500 dark:text-gray-400">{reminder.date.toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedChatDemo;
