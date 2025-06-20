
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'English' | 'Hindi' | 'Telugu';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  English: {
    // Navigation
    'nav.demo': 'Enhanced Demo',
    'nav.dashboard': 'Dashboard',
    'nav.locations': 'Locations',
    'nav.services': 'Services',
    'nav.analytics': 'Analytics',
    'nav.login': 'Login',
    'nav.profile': 'Profile',
    
    // Hero Section
    'hero.title': 'GramaBot 2.0',
    'hero.subtitle': 'The Next Generation Vernacular AI Chatbot with Enhanced Features, Accessibility, and Intelligence',
    'hero.tryDemo': 'Try Enhanced Demo',
    'hero.dashboard': 'Personal Dashboard',
    
    // Chat
    'chat.greeting': 'Hey! I am GramaBot, your AI assistant for government services. How can I help you today?',
    'chat.placeholder': 'Ask about government services in English...',
    'chat.pensionCheck': 'Check pension status',
    'chat.pensionResponse': 'Your pension application (ID: PEN2024001234) has been approved! ₹5,000 will be credited to your account on the 1st of every month.',
    'chat.rationCard': 'Apply for ration card',
    'chat.rationResponse': 'To apply for a ration card, you need: Aadhaar card, address proof, and income certificate. I can help you with the application process.',
    
    // Services
    'services.title': 'Government Services Portal',
    'services.subtitle': 'Access all government services through GramaBot in your preferred language',
    'services.startChat': 'Start Chat',
    
    // Common
    'common.search': 'Search...',
    'common.back': 'Back to Home',
    'common.getDirections': 'Get Directions',
    'common.callOffice': 'Call Office',
  },
  Hindi: {
    // Navigation
    'nav.demo': 'उन्नत डेमो',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.locations': 'स्थान',
    'nav.services': 'सेवाएं',
    'nav.analytics': 'विश्लेषण',
    'nav.login': 'लॉगिन',
    'nav.profile': 'प्रोफ़ाइल',
    
    // Hero Section
    'hero.title': 'ग्रामबॉट 2.0',
    'hero.subtitle': 'अगली पीढ़ी का स्थानीय भाषा AI चैटबॉट बेहतर सुविधाओं, पहुंच और बुद्धिमत्ता के साथ',
    'hero.tryDemo': 'उन्नत डेमो आज़माएं',
    'hero.dashboard': 'व्यक्तिगत डैशबोर्ड',
    
    // Chat
    'chat.greeting': 'नमस्ते! मैं ग्रामबॉट हूं, सरकारी सेवाओं के लिए आपका AI सहायक। आज मैं आपकी कैसे मदद कर सकता हूं?',
    'chat.placeholder': 'हिंदी में सरकारी सेवाओं के बारे में पूछें...',
    'chat.pensionCheck': 'पेंशन स्थिति जांचें',
    'chat.pensionResponse': 'आपकी पेंशन का आवेदन (ID: PEN2024001234) स्वीकृत हो गया है! हर महीने की 1 तारीख को ₹5,000 आपके खाते में जमा होंगे।',
    'chat.rationCard': 'राशन कार्ड के लिए आवेदन',
    'chat.rationResponse': 'राशन कार्ड के लिए आपको चाहिए: आधार कार्ड, पता प्रमाण, और आय प्रमाण पत्र। मैं आवेदन प्रक्रिया में आपकी सहायता कर सकता हूं।',
    
    // Services
    'services.title': 'सरकारी सेवा पोर्टल',
    'services.subtitle': 'अपनी पसंदीदा भाषा में ग्रामबॉट के माध्यम से सभी सरकारी सेवाओं तक पहुंचें',
    'services.startChat': 'चैट शुरू करें',
    
    // Common
    'common.search': 'खोजें...',
    'common.back': 'होम पर वापस',
    'common.getDirections': 'दिशा प्राप्त करें',
    'common.callOffice': 'ऑफिस को कॉल करें',
  },
  Telugu: {
    // Navigation
    'nav.demo': 'మెరుగైన డెమో',
    'nav.dashboard': 'డాష్‌బోర్డ్',
    'nav.locations': 'స్థలాలు',
    'nav.services': 'సేవలు',
    'nav.analytics': 'విశ్లేషణలు',
    'nav.login': 'లాగిన్',
    'nav.profile': 'ప్రొఫైల్',
    
    // Hero Section
    'hero.title': 'గ్రామబాట్ 2.0',
    'hero.subtitle': 'మెరుగైన ఫీచర్లు, యాక్సెసిబిలిటీ మరియు ఇంటెలిజెన్స్‌తో తరువాతి తరం వర్నాక్యులర్ AI చాట్‌బాట్',
    'hero.tryDemo': 'మెరుగైన డెమో ప్రయత్నించండి',
    'hero.dashboard': 'వ్యక్తిగత డాష్‌బోర్డ్',
    
    // Chat
    'chat.greeting': 'హే! నేను గ్రామబాట్, ప్రభుత్వ సేవల కోసం మీ AI సహాయకుడను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?',
    'chat.placeholder': 'తెలుగులో ప్రభుత్వ సేవల గురించి అడగండి...',
    'chat.pensionCheck': 'పెన్షన్ స్థితి తనిఖీ చేయండి',
    'chat.pensionResponse': 'మీ పెన్షన్ దరఖాస్తు (ID: PEN2024001234) ఆమోదించబడింది! ప్రతి నెల 1వ తేదీన ₹5,000 మీ ఖాతాలో జమ చేయబడుతుంది.',
    'chat.rationCard': 'రేషన్ కార్డ్ కోసం దరఖాస్తు',
    'chat.rationResponse': 'రేషన్ కార్డ్ కోసం మీకు అవసరం: ఆధార్ కార్డ్, చిరునామా రుజువు మరియు ఆదాయ ధృవీకరణ పత్రం. నేను దరఖాస్తు ప్రక్రియలో మీకు సహాయం చేయగలను.',
    
    // Services
    'services.title': 'ప్రభుత్వ సేవల పోర్టల్',
    'services.subtitle': 'మీ ఇష్టమైన భాషలో గ్రామబాట్ ద్వారా అన్ని ప్రభుత్వ సేవలను యాక్సెస్ చేయండి',
    'services.startChat': 'చాట్ ప్రారంభించండి',
    
    // Common
    'common.search': 'వెతకండి...',
    'common.back': 'హోమ్‌కు తిరిగి',
    'common.getDirections': 'దిశలు పొందండి',
    'common.callOffice': 'కార్యాలయానికి కాల్ చేయండి',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('English');

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const t = (key: string): string => {
    return translations[currentLanguage][key] || key;
  };

  useEffect(() => {
    const stored = localStorage.getItem('preferred-language') as Language;
    if (stored && translations[stored]) {
      setCurrentLanguage(stored);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
