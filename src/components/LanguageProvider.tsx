
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'English' | 'Hindi' | 'Telugu' | 'Tamil' | 'Kannada';

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
    'hero.findLocations': 'Find Locations',
    
    // Chat
    'chat.greeting': 'Hey! I am GramaBot, your AI assistant for government services. How can I help you today?',
    'chat.placeholder': 'Ask about government services in English...',
    'chat.pensionCheck': 'Check pension status',
    'chat.pensionResponse': 'Your pension application (ID: PEN2024001234) has been approved! ₹5,000 will be credited to your account on the 1st of every month.',
    'chat.rationCard': 'Apply for ration card',
    'chat.rationResponse': 'To apply for a ration card, you need: Aadhaar card, address proof, and income certificate. I can help you with the application process.',
    'chat.healthScheme': 'Health scheme registration',
    'chat.landRecords': 'Land records verification',
    'chat.scholarship': 'Scholarship applications',
    'chat.complaintFiles': 'Complaint filing',
    'chat.irrelevant': 'Your information is not relevant, please provide government service only.',
    
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
    'hero.findLocations': 'स्थान खोजें',
    
    // Chat
    'chat.greeting': 'नमस्ते! मैं ग्रामबॉट हूं, सरकारी सेवाओं के लिए आपका AI सहायक। आज मैं आपकी कैसे मदद कर सकता हूं?',
    'chat.placeholder': 'हिंदी में सरकारी सेवाओं के बारे में पूछें...',
    'chat.pensionCheck': 'पेंशन स्थिति जांचें',
    'chat.pensionResponse': 'आपकी पेंशन का आवेदन (ID: PEN2024001234) स्वीकृत हो गया है! हर महीने की 1 तारीख को ₹5,000 आपके खाते में जमा होंगे।',
    'chat.rationCard': 'राशन कार्ड के लिए आवेदन',
    'chat.rationResponse': 'राशन कार्ड के लिए आपको चाहिए: आधार कार्ड, पता प्रमाण, और आय प्रमाण पत्र। मैं आवेदन प्रक्रिया में आपकी सहायता कर सकता हूं।',
    'chat.healthScheme': 'स्वास्थ्य योजना पंजीकरण',
    'chat.landRecords': 'भूमि रिकॉर्ड सत्यापन',
    'chat.scholarship': 'छात्रवृत्ति आवेदन',
    'chat.complaintFiles': 'शिकायत दर्ज करना',
    'chat.irrelevant': 'आपकी जानकारी प्रासंगिक नहीं है, कृपया केवल सरकारी सेवा प्रदान करें।',
    
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
    'hero.findLocations': 'స్థలాలను కనుగొనండి',
    
    // Chat
    'chat.greeting': 'హే! నేను గ్రామబాట్, ప్రభుత్వ సేవల కోసం మీ AI సహాయకుడను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?',
    'chat.placeholder': 'తెలుగులో ప్రభుత్వ సేవల గురించి అడగండి...',
    'chat.pensionCheck': 'పెన్షన్ స్థితి తనిఖీ చేయండి',
    'chat.pensionResponse': 'మీ పెన్షన్ దరఖాస్తు (ID: PEN2024001234) ఆమోదించబడింది! ప్రతి నెల 1వ తేదీన ₹5,000 మీ ఖాతాలో జమ చేయబడుతుంది.',
    'chat.rationCard': 'రేషన్ కార్డ్ కోసం దరఖాస్తు',
    'chat.rationResponse': 'రేషన్ కార్డ్ కోసం మీకు అవసరం: ఆధార్ కార్డ్, చిరునామా రుజువు మరియు ఆదాయ ధృవీకరణ పత్రం. నేను దరఖాస్తు ప్రక్రియలో మీకు సహాయం చేయగలను.',
    'chat.healthScheme': 'ఆరోగ్య పథకం నమోదు',
    'chat.landRecords': 'భూమి రికార్డుల ధృవీకరణ',
    'chat.scholarship': 'స్కాలర్‌షిప్ దరఖాస్తులు',
    'chat.complaintFiles': 'ఫిర్యాదు దాఖలు',
    'chat.irrelevant': 'మీ సమాచారం సంబంధితం కాదు, దయచేసి ప్రభుత్వ సేవను మాత్రమే అందించండి.',
    
    // Services
    'services.title': 'ప్రభుత్వ సేవల పోర్టల్',
    'services.subtitle': 'మీ ఇష్టమైన భాషలో గ్రామబాట్ ద్వారా అన్ని ప్రభుత్వ సేవలను యాక్సెస్ చేయండి',
    'services.startChat': 'చాట్ ప్రారంభించండి',
    
    // Common
    'common.search': 'వెతకండి...',
    'common.back': 'హోమ్‌కు తిరిగి',
    'common.getDirections': 'దిశలు పొందండి',
    'common.callOffice': 'కార్యాలయానికి కాల్ చేయండి',
  },
  Tamil: {
    // Navigation
    'nav.demo': 'மேம்படுத்தப்பட்ட டெமோ',
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.locations': 'இடங்கள்',
    'nav.services': 'சேவைகள்',
    'nav.analytics': 'பகுப்பாய்வு',
    'nav.login': 'உள்நுழைவு',
    'nav.profile': 'சுயவிவரம்',
    
    // Hero Section
    'hero.title': 'கிராமபாட் 2.0',
    'hero.subtitle': 'மேம்படுத்தப்பட்ட அம்சங்கள், அணுகல் மற்றும் நுண்ணறிவுடன் அடுத்த தலைமுறை வர்னாக்குலர் AI சாட்பாட்',
    'hero.tryDemo': 'மேம்படுத்தப்பட்ட டெமோவை முயற்சிக்கவும்',
    'hero.dashboard': 'தனிப்பட்ட டாஷ்போர்டு',
    'hero.findLocations': 'இடங்களைக் கண்டறியவும்',
    
    // Chat
    'chat.greeting': 'வணக்கம்! நான் கிராமபாட், அரசு சேவைகளுக்கான உங்கள் AI உதவியாளர். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
    'chat.placeholder': 'தமிழில் அரசு சேவைகளைப் பற்றி கேளுங்கள்...',
    'chat.pensionCheck': 'ஓய்வூதிய நிலையைச் சரிபார்க்கவும்',
    'chat.pensionResponse': 'உங்கள் ஓய்வூதிய விண்ணப்பம் (ID: PEN2024001234) அங்கீகரிக்கப்பட்டது! ஒவ்வொரு மாதம் 1ஆம் தேதி உங்கள் கணக்கில் ₹5,000 வரவு வைக்கப்படும்.',
    'chat.rationCard': 'ரேஷன் கார்டுக்கு விண்ணப்பிக்கவும்',
    'chat.rationResponse': 'ரேஷன் கார்டுக்கு உங்களுக்கு தேவை: ஆதார் கார்டு, முகவரி சான்று மற்றும் வருமான சான்றிதழ். விண்ணப்ப செயல்முறையில் நான் உங்களுக்கு உதவ முடியும்.',
    'chat.healthScheme': 'சுகாதார திட்ட பதிவு',
    'chat.landRecords': 'நில பதிவுகள் சரிபார்ப்பு',
    'chat.scholarship': 'உதவித்தொகை விண்ணப்பங்கள்',
    'chat.complaintFiles': 'புகார் தாக்கல்',
    'chat.irrelevant': 'உங்கள் தகவல் பொருத்தமானது அல்ல, தயவுசெய்து அரசு சேவையை மட்டும் வழங்கவும்.',
    
    // Services
    'services.title': 'அரசு சேவைகள் போர்ட்டல்',
    'services.subtitle': 'உங்கள் விருப்பமான மொழியில் கிராமபாட் மூலம் அனைத்து அரசு சேவைகளையும் அணுகவும்',
    'services.startChat': 'அரட்டையைத் தொடங்கவும்',
    
    // Common
    'common.search': 'தேடுக...',
    'common.back': 'வீட்டிற்கு திரும்பு',
    'common.getDirections': 'திசைகளைப் பெறுக',
    'common.callOffice': 'அலுவலகத்திற்கு அழைக்கவும்',
  },
  Kannada: {
    // Navigation
    'nav.demo': 'ವರ್ಧಿತ ಡೆಮೋ',
    'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav.locations': 'ಸ್ಥಳಗಳು',
    'nav.services': 'ಸೇವೆಗಳು',
    'nav.analytics': 'ವಿಶ್ಲೇಷಣೆ',
    'nav.login': 'ಲಾಗಿನ್',
    'nav.profile': 'ಪ್ರೊಫೈಲ್',
    
    // Hero Section
    'hero.title': 'ಗ್ರಾಮಬಾಟ್ 2.0',
    'hero.subtitle': 'ವರ್ಧಿತ ವೈಶಿಷ್ಟ್ಯಗಳು, ಪ್ರವೇಶ ಮತ್ತು ಬುದ್ಧಿವಂತಿಕೆಯೊಂದಿಗೆ ಮುಂದಿನ ಪೀಳಿಗೆಯ ವರ್ನಾಕ್ಯುಲರ್ AI ಚಾಟ್‌ಬಾಟ್',
    'hero.tryDemo': 'ವರ್ಧಿತ ಡೆಮೋವನ್ನು ಪ್ರಯತ್ನಿಸಿ',
    'hero.dashboard': 'ವೈಯಕ್ತಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'hero.findLocations': 'ಸ್ಥಳಗಳನ್ನು ಹುಡುಕಿ',
    
    // Chat
    'chat.greeting': 'ಹೇ! ನಾನು ಗ್ರಾಮಬಾಟ್, ಸರ್ಕಾರಿ ಸೇವೆಗಳಿಗಾಗಿ ನಿಮ್ಮ AI ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
    'chat.placeholder': 'ಕನ್ನಡದಲ್ಲಿ ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
    'chat.pensionCheck': 'ಪಿಂಚಣಿ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ',
    'chat.pensionResponse': 'ನಿಮ್ಮ ಪಿಂಚಣಿ ಅರ್ಜಿ (ID: PEN2024001234) ಅನುಮೋದಿಸಲಾಗಿದೆ! ಪ್ರತಿ ತಿಂಗಳ 1 ರಂದು ನಿಮ್ಮ ಖಾತೆಗೆ ₹5,000 ಜಮಾ ಮಾಡಲಾಗುತ್ತದೆ.',
    'chat.rationCard': 'ರೇಷನ್ ಕಾರ್ಡ್‌ಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    'chat.rationResponse': 'ರೇಷನ್ ಕಾರ್ಡ್‌ಗಾಗಿ ನಿಮಗೆ ಅಗತ್ಯವಿದೆ: ಆಧಾರ್ ಕಾರ್ಡ್, ವಿಳಾಸ ಪುರಾವೆ ಮತ್ತು ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ. ಅರ್ಜಿ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಹುದು.',
    'chat.healthScheme': 'ಆರೋಗ್ಯ ಯೋಜನೆ ನೋಂದಣಿ',
    'chat.landRecords': 'ಭೂಮಿ ದಾಖಲೆಗಳ ಪರಿಶೀಲನೆ',
    'chat.scholarship': 'ವಿದ್ಯಾರ್ಥಿವೇತನ ಅರ್ಜಿಗಳು',
    'chat.complaintFiles': 'ದೂರು ದಾಖಲಿಸುವುದು',
    'chat.irrelevant': 'ನಿಮ್ಮ ಮಾಹಿತಿ ಸಂಬಂಧಿತವಾಗಿಲ್ಲ, ದಯವಿಟ್ಟು ಸರ್ಕಾರಿ ಸೇವೆಯನ್ನು ಮಾತ್ರ ಒದಗಿಸಿ.',
    
    // Services
    'services.title': 'ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಪೋರ್ಟಲ್',
    'services.subtitle': 'ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯಲ್ಲಿ ಗ್ರಾಮಬಾಟ್ ಮೂಲಕ ಎಲ್ಲಾ ಸರ್ಕಾರಿ ಸೇವೆಗಳನ್ನು ಪ್ರವೇಶಿಸಿ',
    'services.startChat': 'ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ',
    
    // Common
    'common.search': 'ಹುಡುಕಿ...',
    'common.back': 'ಮನೆಗೆ ಹಿಂತಿರುಗಿ',
    'common.getDirections': 'ದಿಕ್ಕುಗಳನ್ನು ಪಡೆಯಿರಿ',
    'common.callOffice': 'ಕಛೇರಿಗೆ ಕರೆ ಮಾಡಿ',
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
    return translations[currentLanguage][key as keyof typeof translations[typeof currentLanguage]] || key;
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
