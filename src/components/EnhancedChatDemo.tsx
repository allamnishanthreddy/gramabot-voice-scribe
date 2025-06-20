import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Mic, MicOff, Send, Volume2, VolumeX, Plus, Camera, Upload } from "lucide-react";
import VoiceControls from "./VoiceControls";
import AccessibilityControls from "./AccessibilityControls";
import ImageUpload from "./ImageUpload";
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
  const [showImageUpload, setShowImageUpload] = useState(false);
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
      },
      Tamil: {
        patterns: ['ஓய்வூதியம்', 'ஓய்வு', 'முதியோர்', 'வயதானவர்'],
        responses: [
          "உங்கள் ஓய்வூதிய விண்ணப்பம் (ID: PEN2024001234) அங்கீகரிக்கப்பட்டது! ஒவ்வொரு மாதம் 1ஆம் தேதி உங்கள் கணக்கில் ₹5,000 வரவு வைக்கப்படும்.",
          "ஓய்வூதிய நிலையைச் சரிபார்க்க, தயவுசெய்து உங்கள் ஆதார் எண்ணை வழங்கவும். உங்கள் தற்போதைய ஓய்வூதிய தொகை மாதத்திற்கு ₹5,000.",
          "ஓய்வூதியம் தொடர்பான கேள்விகளுக்கு, நீங்கள் மாவட்ட ஆட்சியர் அலுவலகத்திற்குச் செல்லலாம் அல்லது எங்கள் உதவி எண் 1800-123-4567ஐ அழைக்கலாம்."
        ]
      },
      Kannada: {
        patterns: ['ಪಿಂಚಣಿ', 'ನಿವೃತ್ತಿ', 'ವಯಸ್ಸಾದವರು', 'ಹಿರಿಯರು'],
        responses: [
          "ನಿಮ್ಮ ಪಿಂಚಣಿ ಅರ್ಜಿ (ID: PEN2024001234) ಅನುಮೋದಿಸಲಾಗಿದೆ! ಪ್ರತಿ ತಿಂಗಳ 1 ರಂದು ನಿಮ್ಮ ಖಾತೆಗೆ ₹5,000 ಜಮಾ ಮಾಡಲಾಗುತ್ತದೆ.",
          "ಪಿಂಚಣಿ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಲು, ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ಒದಗಿಸಿ. ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಪಿಂಚಣಿ ಮೊತ್ತ ತಿಂಗಳಿಗೆ ₹5,000.",
          "ಪಿಂಚಣಿ ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಗಳಿಗೆ, ನೀವು ಜಿಲ್ಲಾ ಕಲೆಕ್ಟರ್ ಕಚೇರಿಗೆ ಹೋಗಬಹುದು ಅಥವಾ ನಮ್ಮ ಸಹಾಯವಾಣಿ 1800-123-4567 ಗೆ ಕರೆ ಮಾಡಬಹುದು."
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
          "మీ రేషన్ కార్డ్ దరఖాస్తు సమీక్షలో ఉంది. మీరు దరఖాస్తు నంబర్ RAT2024005678 ఉపయోగించి స్థితిని ట్రాక్ చేయవచ్చు。",
          "రేషన్ కార్డ్ ప్రయోజనాలలో సబ్సిడీ బియ్యం ₹3/కిలో, గోధుమలు ₹2/కిలో, మరియు చక్కెర ₹13.50/కిలో ఉన్నాయి।"
        ]
      },
      Tamil: {
        patterns: ['ரேஷன்', 'உணவு', 'கார்டு', 'சூல', 'தானியம்'],
        responses: [
          "ரேஷன் கார்டுக்கு விண்ணப்பிக்க, நீங்கள்: ஆதார் கார்டு, முகவரி சான்று, வருமான சான்றிதழ் மற்றும் குடும்ப புகைப்படங்கள் தேவை.",
          "உங்கள் ரேஷன் கார்டு விண்ணப்பம் மதிப்பீட்டில் உள்ளது. நீங்கள் விண்ணப்ப எண் RAT2024005678 ஐப் பயன்படுத்தி நிலையை கண்காணிக்கலாம்.",
          "ரேஷன் கார்டு நன்மைகள்: சலுகை கொண்ட அரிசி ₹3/கிலோ, கோதுமை ₹2/கிலோ, மற்றும் சர்க்கரை ₹13.50/கிலோ."
        ]
      },
      Kannada: {
        patterns: ['ರೇಷನ್', 'ಆಹಾರ', 'ಕಾರ್ಡ್', 'ಉಪಶ್ರೇಣೀ', 'ಧಾನ್ಯ'],
        responses: [
          "ರೇಷನ್ ಕಾರ್ಡ್‌ಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು, ನಿಮಗೆ ಅಗತ್ಯವಿದೆ: ಆಧಾರ್ ಕಾರ್ಡ್, ವಿಳಾಸ ಪುರಾವೆ, ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ಕುಟುಂಬ ಛಾಯಾಚಿತ್ರಗಳು.",
          "ನಿಮ್ಮ ರೇಷನ್ ಕಾರ್ಡ್ ಅರ್ಜಿ ಪರಿಶೀಲನೆಯಲ್ಲಿ ಇದೆ. ನೀವು ಅರ್ಜಿ ಸಂಖ್ಯೆ RAT2024005678 ಅನ್ನು ಬಳಸಿಕೊಂಡು ಸ್ಥಿತಿಯನ್ನು ಟ್ರಾಕ್ ಮಾಡಬಹುದು.",
          "ರೇಷನ್ ಕಾರ್ಡ್ ಪ್ರಯೋಜನಗಳು: ಸಬ್ಸಿಡಿ ಹೊಂದಿರುವ ಅಕ್ಕಿ ₹3/ಕಿಲೋ, ಗೋಧಿ ₹2/ಕಿಲೋ, ಮತ್ತು ಸಕ್ಕರೆ ₹13.50/ಕಿಲೋ."
        ]
      }
    },
    'health-scheme': {
      English: {
        patterns: ['health', 'medical', 'insurance', 'ayushman', 'treatment'],
        responses: [
          "You can register for Ayushman Bharat scheme. It provides health coverage up to ₹5 lakhs per family per year.",
          "To check your health scheme eligibility, please provide your Aadhaar number and family details.",
          "Health scheme covers hospitalization, surgery, and pre/post hospitalization expenses at empaneled hospitals."
        ]
      },
      Hindi: {
        patterns: ['स्वास्थ्य', 'चिकित्सा', 'बीमा', 'आयुष्मान', 'उपचार'],
        responses: [
          "आप आयुष्मान भारत योजना के लिए पंजीकरण कर सकते हैं। यह प्रति परिवार प्रति वर्ष ₹5 लाख तक का स्वास्थ्य कवरेज प्रदान करती है।",
          "स्वास्थ्य योजना की पात्रता जांचने के लिए, कृपया अपना आधार नंबर और परिवार के विवरण प्रदान करें।",
          "स्वास्थ्य योजना अस्पताल में भर्ती, सर्जरी, और पूर्व/पश्चात अस्पताल में भर्ती खर्चों को कवर करती है।"
        ]
      },
      Telugu: {
        patterns: ['ఆరోగ్య', 'చికిత్స', 'భీమా', 'ఆయుష్మాన్', 'చికిత్స'],
        responses: [
          "మీరు ఆయుష్మాన్ భారత్ పథకానికి నమోదు చేసుకోవచ్చు. ఇది ప్రతి కుటుంబానికి సంవత్సరానికి ₹5 లక్షల వరకు ఆరోగ్య కవరేజ్ అందిస్తుంది.",
          "మీ ఆరోగ్య పథకానికి అర్హతను తనిఖీ చేయడానికి, దయచేసి మీ ఆధార్ సంఖ్య మరియు కుటుంబ వివరాలను అందించండి.",
          "ఆరోగ్య పథకం ఆసుపత్రిలో చేరడం, శస్త్రచికిత్స, మరియు ముందుగా/తర్వాత ఆసుపత్రిలో చేరే ఖర్చులను కవర్ చేస్తుంది."
        ]
      },
      Tamil: {
        patterns: ['ஆரோக்கியம்', 'மருத்துவம்', 'காப்பீடு', 'ஆயுஷ்மான்', 'சிகிச்சை'],
        responses: [
          "நீங்கள் ஆயுஷ்மான் பாரத் திட்டத்திற்கு பதிவு செய்யலாம். இது குடும்பத்திற்கு ஆண்டுக்கு ₹5 லட்சம் வரை சுகாதார கவரேஜ் வழங்குகிறது.",
          "உங்கள் சுகாதார திட்டத்திற்கான தகுதிகளை சரிபார்க்க, தயவுசெய்து உங்கள் ஆதார் எண்ணையும் குடும்ப விவரங்களையும் வழங்கவும்.",
          "சுகாதார திட்டம் மருத்துவமனையில் சேர்க்கை, அறுவை சிகிச்சை மற்றும் முன்/பிறகு மருத்துவமனையில் சேர்க்கை செலவுகளை கவருகிறது."
        ]
      },
      Kannada: {
        patterns: ['ಆರೋಗ್ಯ', 'ಚಿಕಿತ್ಸೆ', 'ಬೀಮಾ', 'ಆಯುಷ್ಮಾನ್', 'ಚಿಕಿತ್ಸೆ'],
        responses: [
          "ನೀವು ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಯೋಜನೆಗೆ ನೋಂದಣಿ ಮಾಡಬಹುದು. ಇದು ಕುಟುಂಬಕ್ಕೆ ವರ್ಷಕ್ಕೆ ₹5 ಲಕ್ಷದವರೆಗೆ ಆರೋಗ್ಯ ಕವರೇಜ್ ಒದಗಿಸುತ್ತದೆ.",
          "ನಿಮ್ಮ ಆರೋಗ್ಯ ಯೋಜನೆಯ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು, ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ಮತ್ತು ಕುಟುಂಬದ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ.",
          "ಆರೋಗ್ಯ ಯೋಜನೆ ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ದಾಖಲಾಗುವುದು, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಮತ್ತು ಮುಂಚಿನ/ಮರು ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ದಾಖಲಾಗುವ ಖರ್ಚುಗಳನ್ನು ಕವರಿಸುತ್ತದೆ."
        ]
      }
    },
    'land-records': {
      English: {
        patterns: ['land', 'property', 'records', 'survey', 'revenue'],
        responses: [
          "To verify land records, you need survey number and village details. Documents can be downloaded from state revenue portal.",
          "Your land record verification is complete. Property survey number 123/4 shows clear title.",
          "For land mutation, submit application with sale deed and relevant documents to village revenue officer."
        ]
      },
      Hindi: {
        patterns: ['भूमि', 'संपत्ति', 'रिकॉर्ड', 'सर्वेक्षण', 'राजस्व'],
        responses: [
          "भूमि रिकॉर्ड सत्यापित करने के लिए, आपको सर्वे नंबर और गांव का विवरण चाहिए। दस्तावेज राज्य राजस्व पोर्टल से डाउनलोड किए जा सकते हैं।",
          "आपकी भूमि रिकॉर्ड सत्यापन पूरी हो गई है। संपत्ति सर्वे नंबर 123/4 स्पष्ट शीर्षक दिखाता है।",
          "भूमि परिवर्तन के लिए, बिक्री विलेख और संबंधित दस्तावेजों के साथ आवेदन जमा करें।"
        ]
      },
      Telugu: {
        patterns: ['భూమి', 'సంపత్తి', 'రికార్డులు', 'సర్వే', 'రాబందీ'],
        responses: [
          "భూమి రికార్డులను ధృవీకరించడానికి, మీకు సర్వే సంఖ్య మరియు గ్రామ వివరాలు అవసరం. పత్రాలను రాష్ట్ర రాబందీ పోర్టల్ నుండి డౌన్‌లోడ్ చేయవచ్చు.",
          "మీ భూమి రికార్డ్ ధృవీకరణ పూర్తయింది. ఆస్తి సర్వే సంఖ్య 123/4 స్పష్టమైన శీర్షికను చూపిస్తుంది.",
          "భూమి మార్పు కోసం, అమ్మకపు ఒప్పందం మరియు సంబంధిత పత్రాలతో కూడిన దరఖాస్తును గ్రామ రాబందీ అధికారికి సమర్పించండి."
        ]
      },
      Tamil: {
        patterns: ['நில', 'சொத்து', 'பதிவுகள்', 'சர்வே', 'வருவாய்'],
        responses: [
          "நில பதிவுகளை சரிபார்க்க, நீங்கள் சர்வே எண் மற்றும் கிராம விவரங்கள் தேவை. ஆவணங்களை மாநில வருவாய் போர்ட்டில் இருந்து பதிவிறக்கம் செய்யலாம்.",
          "உங்கள் நில பதிவின் சரிபார்ப்பு முடிந்தது. சொத்து சர்வே எண் 123/4 தெளிவான தலைப்பை காட்டுகிறது.",
          "நில மாற்றத்திற்கு, விற்பனை ஒப்பந்தம் மற்றும் தொடர்புடைய ஆவணங்களுடன் விண்ணப்பத்தை கிராம வருவாய் அதிகாரிக்கு சமர்ப்பிக்கவும்."
        ]
      },
      Kannada: {
        patterns: ['ಭೂಮಿ', 'ಸ್ವತ್ತು', 'ದಾಖಲೆಗಳು', 'ಸರ್ವೇ', 'ಆದಾಯ'],
        responses: [
          "ಭೂಮಿ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲು, ನಿಮಗೆ ಸರ್ವೇ ಸಂಖ್ಯೆ ಮತ್ತು ಗ್ರಾಮ ವಿವರಗಳು ಬೇಕಾಗುತ್ತವೆ. ದಾಖಲೆಗಳನ್ನು ರಾಜ್ಯ ಆದಾಯ ಪೋರ್ಟಲ್‌ನಿಂದ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬಹುದು.",
          "ನಿಮ್ಮ ಭೂಮಿ ದಾಖಲೆ ಪರಿಶೀಲನೆ ಸಂಪೂರ್ಣವಾಗಿದೆ. ಆಸ್ತಿ ಸರ್ವೇ ಸಂಖ್ಯೆ 123/4 ಸ್ಪಷ್ಟ ಶೀರ್ಷಿಕೆಯನ್ನು ತೋರಿಸುತ್ತದೆ.",
          "ಭೂಮಿ ಪರಿವರ್ತನೆಗಾಗಿ, ಮಾರಾಟದ ಒಪ್ಪಂದ ಮತ್ತು ಸಂಬಂಧಿತ ದಾಖಲೆಗಳೊಂದಿಗೆ ಅರ್ಜಿಯನ್ನು ಗ್ರಾಮ ಆದಾಯ ಅಧಿಕಾರಿಗೆ ಸಲ್ಲಿಸಿ."
        ]
      }
    },
    'scholarship': {
      English: {
        patterns: ['scholarship', 'education', 'student', 'study', 'fees'],
        responses: [
          "Available scholarships: Post-matric SC/ST, Merit-cum-means, Minority scholarships. Apply before deadline.",
          "Your scholarship application (ID: SCH2024008901) is approved. Amount ₹25,000 will be credited soon.",
          "Required documents: Income certificate, caste certificate, mark sheets, bank details, and Aadhaar card."
        ]
      },
      Hindi: {
        patterns: ['छात्रवृत्ति', 'शिक्षा', 'छात्र', 'अध्ययन', 'फीस'],
        responses: [
          "उपलब्ध छात्रवृत्तियां: पोस्ट-मैट्रिक SC/ST, मेरिट-कम-मीन्स, अल्पसंख्यक छात्रवृत्ति। समय सीमा से पहले आवेदन करें।",
          "आपकी छात्रवृत्ति आवेदन (ID: SCH2024008901) स्वीकृत है। राशि ₹25,000 जल्द ही जमा की जाएगी।",
          "आवश्यक दस्तावेज: आय प्रमाण पत्र, जाति प्रमाण पत्र, मार्क शीट, बैंक विवरण और आधार कार्ड।"
        ]
      },
      Telugu: {
        patterns: ['స్కాలర్‌షిప్', 'విద్య', 'విద్యార్థి', 'అధ్యయనం', 'ఫీజులు'],
        responses: [
          "అందుబాటులో ఉన్న స్కాలర్‌షిప్‌లు: పోస్ట్-మ్యాట్రిక్ SC/ST, మెరిట్-కమ్-మీన్స్, మైనారిటీ స్కాలర్‌షిప్‌లు. గడువుకు ముందు దరఖాస్తు చేయండి.",
          "మీ స్కాలర్‌షిప్ దరఖాస్తు (ID: SCH2024008901) ఆమోదించబడింది. మొత్తం ₹25,000 త్వరలో జమ చేయబడుతుంది.",
          "అవసరమైన పత్రాలు: ఆదాయ ధృవీకరణ, కుల ధృవీకరణ, మార్క్ షీట్స్, బ్యాంక్ వివరాలు మరియు ఆధార్ కార్డు."
        ]
      },
      Tamil: {
        patterns: ['உதவித்தொகை', 'கல்வி', 'மாணவர்', 'பயிற்சி', 'கட்டணம்'],
        responses: [
          "கிடைக்கும் உதவித்தொகைகள்: பிந்தைய மெட்ரிக் SC/ST, மெரிட்-கம்-மீன்ஸ், சிறுபான்மை உதவித்தொகைகள். காலக்கெடுவுக்கு முன் விண்ணப்பிக்கவும்.",
          "உங்கள் உதவித்தொகை விண்ணப்பம் (ID: SCH2024008901) அங்கீகரிக்கப்பட்டது. தொகை ₹25,000 விரைவில் வரவாகும்.",
          "தேவையான ஆவணங்கள்: வருமான சான்றிதழ், குல சான்றிதழ், மதிப்பெண் பட்டியல், வங்கி விவரங்கள் மற்றும் ஆதார் கார்ட்."
        ]
      },
      Kannada: {
        patterns: ['ಉದಾಹರಣೆ', 'ಶಿಕ್ಷಣ', 'ವಿದ್ಯಾರ್ಥಿ', 'ಅಧ್ಯಯನ', 'ಶ್ರೇಣಿಗಳು'],
        responses: [
          "ಲಭ್ಯವಿರುವ ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು: ಪೋಸ್ಟ್-ಮೆಟ್ರಿಕ್ SC/ST, ಮೆರಿಟ್-ಕಮ್-ಮೀನ್ಸ್, ಅಲ್ಪಸಂಖ್ಯಾತ ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು. ಗಡುವಿನ ಮೊದಲು ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.",
          "ನಿಮ್ಮ ವಿದ್ಯಾರ್ಥಿವೇತನ ಅರ್ಜಿ (ID: SCH2024008901) ಅನುಮೋದಿಸಲಾಗಿದೆ. ಮೊತ್ತ ₹25,000 ಶೀಘ್ರದಲ್ಲೇ ಜಮಾ ಮಾಡಲಾಗುತ್ತದೆ.",
          "ಅವಶ್ಯಕ ದಾಖಲೆಗಳು: ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ, ಕೌಟುಂಬಿಕ ಪ್ರಮಾಣಪತ್ರ, ಅಂಕಪಟ್ಟಿ, ಬ್ಯಾಂಕ್ ವಿವರಗಳು ಮತ್ತು ಆಧಾರ್ ಕಾರ್ಡ್."
        ]
      }
    },
    'complaint': {
      English: {
        patterns: ['complaint', 'grievance', 'problem', 'issue', 'corruption'],
        responses: [
          "Your complaint has been registered with ID: GRV2024012345. You will receive SMS updates on progress.",
          "To file a complaint, describe the issue clearly with supporting documents. Response within 30 days.",
          "For urgent grievances, contact district collector office directly or use CM helpline."
        ]
      },
      Hindi: {
        patterns: ['शिकायत', 'शिकायत', 'समस्या', 'मुद्दा', 'भ्रष्टाचार'],
        responses: [
          "आपकी शिकायत ID: GRV2024012345 के साथ दर्ज की गई है। आपको प्रगति पर SMS अपडेट मिलेंगे।",
          "शिकायत दर्ज करने के लिए, मुद्दे का स्पष्ट रूप से वर्णन करें और समर्थन दस्तावेज़ प्रदान करें। 30 दिनों के भीतर प्रतिक्रिया।",
          "तत्काल शिकायतों के लिए, सीधे जिला कलेक्टर कार्यालय से संपर्क करें या CM हेल्पलाइन का उपयोग करें।"
        ]
      },
      Telugu: {
        patterns: ['ఫిర్యాదు', 'ఫిర్యాదు', 'సమస్య', 'ముద్ద', 'భ్రష్టాచారం'],
        responses: [
          "మీ ఫిర్యాదు ID: GRV2024012345తో నమోదు చేయబడింది. మీకు పురోగతిపై SMS అప్‌డేట్‌లు వస్తాయి.",
          "ఫిర్యాదు నమోదు చేయడానికి, సమస్యను స్పష్టంగా వివరించండి మరియు మద్దతు పత్రాలను అందించండి. 30 రోజుల్లో స్పందన.",
          "తక్షణ ఫిర్యాదుల కోసం, జిల్లా కలెక్టర్ కార్యాలయాన్ని నేరుగా సంప్రదించండి లేదా CM హెల్ప్‌లైన్‌ను ఉపయోగించండి."
        ]
      },
      Tamil: {
        patterns: ['புகார்', 'புகார்', 'சிக்கல்', 'பிரச்சனை', 'கொள்கை'],
        responses: [
          "உங்கள் புகார் ID: GRV2024012345 உடன் பதிவு செய்யப்பட்டுள்ளது. நீங்கள் முன்னேற்றம் குறித்து SMS புதுப்பிப்புகளைப் பெறுவீர்கள்.",
          "புகாரை பதிவு செய்ய, பிரச்சினையை தெளிவாக விவரிக்கவும் மற்றும் ஆதரவு ஆவணங்களை வழங்கவும். 30 நாட்களில் பதில்.",
          "அவசர புகார்களுக்கு, மாவட்ட ஆட்சியர் அலுவலகத்துடன் நேரடியாக தொடர்பு கொள்ளவும் அல்லது CM உதவி எண்ணை பயன்படுத்தவும்."
        ]
      },
      Kannada: {
        patterns: ['ಫಿರ್ಯಾದ', 'ಫಿರ್ಯಾದ', 'ಸಮಸ್ಯೆ', 'ಮುದ್ಧೆ', 'ಭ್ರಷ್ಟಾಚಾರ'],
        responses: [
          "ನಿಮ್ಮ ಫಿರ್ಯಾದ ID: GRV2024012345 ನೊಂದಿಗೆ ದಾಖಲಿಸಲಾಗಿದೆ. ನೀವು ಪ್ರಗತಿಯ ಬಗ್ಗೆ SMS ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ಸ್ವೀಕರಿಸುತ್ತೀರಿ.",
          "ಫಿರ್ಯಾದ ದಾಖಲಿಸಲು, ಸಮಸ್ಯೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ವಿವರಿಸಿ ಮತ್ತು ಬೆಂಬಲ ದಾಖಲೆಗಳನ್ನು ಒದಗಿಸಿ. 30 ದಿನಗಳಲ್ಲಿ ಪ್ರತಿಕ್ರಿಯೆ.",
          "ತಕ್ಷಣದ ಫಿರ್ಯಾದಗಳಿಗೆ, ಜಿಲ್ಲಾಧಿಕಾರಿ ಕಚೇರಿಯನ್ನು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ ಅಥವಾ CM ಸಹಾಯವಾಣಿ ಬಳಸಿರಿ."
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
      if (langService) {
        greetingText = langService.responses[0];
      }
    } else {
      greetingText = t('chat.greeting');
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
  }, [currentLanguage, speechEnabled, t]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isGovernmentServiceQuery = (query: string): boolean => {
    const governmentKeywords = [
      'pension', 'ration', 'health', 'scheme', 'government', 'service', 'application',
      'certificate', 'document', 'card', 'benefit', 'subsidy', 'registration',
      'पेंशन', 'राशन', 'स्वास्थ्य', 'योजना', 'सरकार', 'सेवा', 'आवेदन',
      'పెన్షన్', 'రేషన్', 'ఆరోగ్యం', 'పథకం', 'ప్రభుత్వం', 'సేవ', 'దరఖాస్తు',
      'ஓய்வூதியம்', 'ரேஷன்', 'சுகாதாரம்', 'திட்டம்', 'அரசு', 'சேவை', 'விண்ணப்பம்',
      'ಪಿಂಚಣಿ', 'ರೇಷನ್', 'ಆರೋಗ್ಯ', 'ಯೋಜನೆ', 'ಸರ್ಕಾರ', 'ಸೇವೆ', 'ಅರ್ಜಿ'
    ];
    
    return governmentKeywords.some(keyword => 
      query.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const getRelevantResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Check if it's a government service query
    if (!isGovernmentServiceQuery(query)) {
      return t('chat.irrelevant');
    }
    
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

    // Default responses if no pattern matches but is government service related
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
        "నేను పెన్షన్, రేషన్ కార్డ్, ఆరోగ్య పథకాలు మరియు ఇతర ప్రభుత్వ సేవలలో సహాయం కోసం ఇక్కడ ఉన్నాను."
      ],
      Tamil: [
        "உங்கள் கேள்விக்கு நன்றி. அந்த அரசு சேவை தகவலுடன் நான் உங்களுக்கு உதவுகிறேன்.",
        "உங்களுக்கு அரசு சேவைகளில் உதவி தேவை என்பதை நான் புரிந்துகொள்கிறேன். தயவுசெய்து உங்களுக்கு என்ன தேவை என்று சொல்லுங்கள்?",
        "நான் ஓய்வூதியம், ரேஷன் கார்டு, சுகாதார திட்டங்கள் மற்றும் பிற அரசு சேவைகளில் உதவுவதற்காக இங்கே இருக்கிறேன்."
      ],
      Kannada: [
        "ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಧನ್ಯವಾದಗಳು. ಆ ಸರ್ಕಾರಿ ಸೇವಾ ಮಾಹಿತಿಯೊಂದಿಗೆ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
        "ನಿಮಗೆ ಸರ್ಕಾರಿ ಸೇವೆಗಳಲ್ಲಿ ಸಹಾಯ ಬೇಕು ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ನಿಮಗೆ ಏನು ಬೇಕು ಎಂದು ಹೇಳಿ?",
        "ನಾನು ಪಿಂಚಣಿ, ರೇಷನ್ ಕಾರ್ಡ್, ಆರೋಗ್ಯ ಯೋಜನೆಗಳು ಮತ್ತು ಇತರ ಸರ್ಕಾರಿ ಸೇವೆಗಳಲ್ಲಿ ಸಹಾಯಕ್ಕಾಗಿ ಇಲ್ಲಿದ್ದೇನೆ."
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

  const handleImageProcessed = (extractedText: string) => {
    const imageMessage: Message = {
      id: `user-image-${Date.now()}`,
      text: `📷 Document uploaded: ${extractedText}`,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, imageMessage]);
    
    // Process the extracted text as a query
    setTimeout(() => {
      handleSendMessage(extractedText);
    }, 500);
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Set language based on current selection
      const languageCodes = {
        English: 'en-US',
        Hindi: 'hi-IN',
        Telugu: 'te-IN',
        Tamil: 'ta-IN',
        Kannada: 'kn-IN'
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
        Telugu: 'te-IN',
        Tamil: 'ta-IN',
        Kannada: 'kn-IN'
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
      { query: t('chat.pensionCheck'), response: serviceResponses['pension-inquiry']['English'].responses[0] },
      { query: t('chat.rationCard'), response: serviceResponses['ration-card']['English'].responses[0] },
      { query: t('chat.healthScheme'), response: "You can register for Ayushman Bharat scheme. It provides health coverage up to ₹5 lakhs per family per year." },
      { query: t('chat.landRecords'), response: "To verify land records, you need survey number and village details. Documents can be downloaded from state revenue portal." },
      { query: t('chat.scholarship'), response: "Available scholarships: Post-matric SC/ST, Merit-cum-means, Minority scholarships. Apply before deadline." },
      { query: t('chat.complaintFiles'), response: "Your complaint has been registered with ID: GRV2024012345. You will receive SMS updates on progress." }
    ],
    Hindi: [
      { query: t('chat.pensionCheck'), response: serviceResponses['pension-inquiry']['Hindi'].responses[0] },
      { query: t('chat.rationCard'), response: serviceResponses['ration-card']['Hindi'] ? serviceResponses['ration-card']['Hindi'].responses[0] : "राशन कार्ड के लिए आवेदन करने के लिए आपको चाहिए: आधार कार्ड, पता प्रमाण, आय प्रमाणपत्र, और पारिवारिक तस्वीरें।" },
      { query: t('chat.healthScheme'), response: "आप आयुष्मान भारत योजना के लिए पंजीकरण कर सकते हैं। यह प्रति परिवार प्रति वर्ष ₹5 लाख तक का स्वास्थ्य कवरेज प्रदान करती है।" },
      { query: t('chat.landRecords'), response: "भूमि रिकॉर्ड सत्यापित करने के लिए, आपको सर्वे नंबर और गांव का विवरण चाहिए। दस्तावेज राज्य राजस्व पोर्टल से डाउनलोड किए जा सकते हैं।" },
      { query: t('chat.scholarship'), response: "उपलब्ध छात्रवृत्तियां: पोस्ट-मैट्रिक SC/ST, मेरिट-कम-मीन्स, अल्पसंख्यक छात्रवृत्ति। समय सीमा से पहले आवेदन करें।" },
      { query: t('chat.complaintFiles'), response: "आपकी शिकायत ID: GRV2024012345 के साथ दर्ज की गई है। आपको प्रगति पर SMS अपडेट मिलेंगे।" }
    ],
    Telugu: [
      { query: t('chat.pensionCheck'), response: serviceResponses['pension-inquiry']['Telugu'].responses[0] },
      { query: t('chat.rationCard'), response: serviceResponses['ration-card']['Telugu'] ? serviceResponses['ration-card']['Telugu'].responses[0] : "రేషన్ కార్డ్ కోసం దరఖాస్తు చేయడానికి మీకు అవసరం: ఆధార్ కార్డ్, చిరునామా రుజువు, ఆదాయ ధృవీకరణ పత్రం, మరియు కుటుంబ ఫోటోలు." },
      { query: t('chat.healthScheme'), response: "మీరు ఆయుష్మాన్ భారత్ పథకానికి నమోదు చేసుకోవచ్చు. ఇది కుటుంబానికి సంవత్సరానికి ₹5 లక్షల వరకు ఆరోగ్య కవరేజ్ అందిస్తుంది." },
      { query: t('chat.landRecords'), response: "భూమి రికార్డులను ధృవీకరించడానికి, మీకు సర్వే సంఖ్య మరియు గ్రామ వివరాలు అవసరం. రాష్ట్ర రాబందీ పోర్టల్ నుండి పత్రాలను డౌన్‌లోడ్ చేయవచ్చు." },
      { query: t('chat.scholarship'), response: "అందుబాటులో ఉన్న స్కాలర్‌షిప్‌లు: పోస్ట్-మ్యాట్రిక్ SC/ST, మెరిట్-కమ్-మీన్స్, మైనారిటీ స్కాలర్‌షిప్‌లు. గడువుకు ముందు దరఖాస్తు చేయండి." },
      { query: t('chat.complaintFiles'), response: "మీ ఫిర్యాదు ID: GRV2024012345 నమోదు చేయబడింది. మీకు పురోగతిపై SMS అప్‌డేట్‌లు వస్తాయి." }
    ],
    Tamil: [
      { query: t('chat.pensionCheck'), response: serviceResponses['pension-inquiry']['Tamil'].responses[0] },
      { query: t('chat.rationCard'), response: "ரேஷன் கார்டுக்கு விண்ணப்பிக்க உங்களுக்கு தேவை: ஆதார் கார்டு, முகவரி சான்று, வருமான சான்றிதழ் மற்றும் குடும்ப புகைப்படங்கள்." },
      { query: t('chat.healthScheme'), response: "நீங்கள் ஆயுஷ்மான் பாரத் திட்டத்திற்கு பதிவு செய்யலாம். இது குடும்பத்திற்கு ஆண்டுக்கு ₹5 லட்சம் வரை சுகாதார கவரேஜ் வழங்குகிறது." },
      { query: t('chat.landRecords'), response: "நில பதிவுகளை சரிபார்க்க, நீங்கள் சர்வே எண் மற்றும் கிராம விவரங்கள் தேவை. ஆவணங்களை மாநில வருவாய் போர்ட்டில் இருந்து பதிவிறக்கம் செய்யலாம்." },
      { query: t('chat.scholarship'), response: "கிடைக்கும் உதவித்தொகைகள்: பிந்தைய மெட்ரிக் SC/ST, மெரிட்-கம்-மீன்ஸ், சிறுபான்மை உதவித்தொகைகள். காலக்கெடுவுக்கு முன் விண்ணப்பிக்கவும்." },
      { query: t('chat.complaintFiles'), response: "உங்கள் புகார் ID: GRV2024012345 உடன் பதிவு செய்யப்பட்டுள்ளது. முன்னேற்றம் குறித்து SMS புதுப்பிப்புகளைப் பெறுவீர்கள்." }
    ],
    Kannada: [
      { query: t('chat.pensionCheck'), response: serviceResponses['pension-inquiry']['Kannada'].responses[0] },
      { query: t('chat.rationCard'), response: "ರೇಷನ್ ಕಾರ್ಡ್‌ಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು, ನಿಮಗೆ ಅಗತ್ಯವಿದೆ: ಆಧಾರ್ ಕಾರ್ಡ್, ವಿಳಾಸ ಪುರಾವೆ, ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ಕುಟುಂಬ ಛಾಯಾಚಿತ್ರಗಳು." },
      { query: t('chat.healthScheme'), response: "ನೀವು ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಯೋಜನೆಗೆ ನೋಂದಣಿ ಮಾಡಬಹುದು. ಇದು ಕುಟುಂಬಕ್ಕೆ ವರ್ಷಕ್ಕೆ ₹5 ಲಕ್ಷದವರೆಗೆ ಆರೋಗ್ಯ ರಕ್ಷಣೆ ಒದಗಿಸುತ್ತದೆ." },
      { query: t('chat.landRecords'), response: "ಭೂಮಿ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲು, ನಿಮಗೆ ಸರ್ವೇ ಸಂಖ್ಯೆ ಮತ್ತು ಗ್ರಾಮ ವಿವರಗಳು ಬೇಕಾಗುತ್ತವೆ. ದಾಖಲೆಗಳನ್ನು ರಾಜ್ಯ ಆದಾಯ ಪೋರ್ಟಲ್‌ನಿಂದ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬಹುದು." },
      { query: t('chat.scholarship'), response: "ಲಭ್ಯವಿರುವ ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು: ಪೋಸ್ಟ್-ಮೆಟ್ರಿಕ್ SC/ST, ಮೆರಿಟ್-ಕಮ್-ಮೀನ್ಸ್, ಅಲ್ಪಸಂಖ್ಯಾತ ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು. ಗಡುವಿನ ಮೊದಲು ಅರ್ಜಿ ಸಲ್ಲಿಸಿ." }
    ]
  };

  return (
    <div className="min-h-screen relative p-2 sm:p-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="lg:col-span-3">
          <Card className="shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-2 border-orange-200 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-t-lg p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl sm:text-2xl font-serif flex items-center space-x-2 sm:space-x-3">
                  <Bot className="h-6 w-6 sm:h-8 sm:w-8" />
                  <span>GramaBot {t('nav.demo')}</span>
                </CardTitle>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs sm:text-sm">
                    {currentLanguage}
                  </Badge>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSpeechEnabled(!speechEnabled)}
                    className={`${speechEnabled ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'} p-1 sm:p-2`}
                  >
                    {speechEnabled ? <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsVoiceMode(!isVoiceMode)}
                    className={`${isVoiceMode ? 'bg-red-500 text-white' : 'bg-white text-gray-800'} p-1 sm:p-2`}
                  >
                    {isVoiceMode ? <MicOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Mic className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-3 sm:p-6">
              {/* Chat Messages */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 p-3 sm:p-4 h-80 sm:h-96 overflow-y-auto mb-4 sm:mb-6 space-y-3 sm:space-y-4 shadow-inner">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-lg`}>
                      {message.type === 'bot' && (
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 sm:p-2 rounded-full">
                          <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-lg ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                            : 'bg-white dark:bg-gray-700 border-2 border-blue-200 dark:border-blue-600'
                        }`}
                      >
                        <p className={`text-xs sm:text-sm leading-relaxed ${message.type === 'bot' ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>
                          {message.text}
                        </p>
                        <span className={`text-xs opacity-50 mt-1 sm:mt-2 block ${message.type === 'bot' ? 'text-gray-600 dark:text-gray-400' : 'text-white'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {message.type === 'user' && (
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-1.5 sm:p-2 rounded-full">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="flex items-start space-x-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 sm:p-2 rounded-full">
                        <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-700 border-2 border-blue-200 dark:border-blue-600 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-lg">
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
              <div className="mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-gray-700 dark:text-gray-300">Quick Actions:</p>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 sm:gap-2">
                  {predefinedQueries[currentLanguage]?.map((query, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendMessage(query.query, query.response)}
                      className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900 border-blue-300 dark:border-blue-600 p-1 h-auto"
                    >
                      {query.query}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex flex-col gap-2 sm:gap-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={t('chat.placeholder')}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="border-2 border-blue-300 dark:border-blue-600 focus:border-blue-500 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                    />
                  </div>
                  
                  <Button 
                    size="icon" 
                    onClick={() => setShowImageUpload(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  
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
                      {isListening ? <MicOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Mic className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </Button>
                  ) : (
                    <Button 
                      size="icon" 
                      onClick={() => handleSendMessage()}
                      className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 shadow-lg"
                    >
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  )}
                </div>

                {isVoiceMode && (
                  <div className="text-center">
                    <p className={`text-xs sm:text-sm ${isListening ? 'text-red-600 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                      {isListening ? `🎤 Listening in ${currentLanguage}... Speak now!` : `🎤 Voice mode activated - Click microphone to speak in ${currentLanguage}`}
                    </p>
                  </div>
                )}

                {speechEnabled && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isSpeaking ? '🔊 Speaking...' : '🔊 Speech responses enabled'}
                    </p>
                  </div>
                )}
              </div>
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

      {/* Image Upload Modal */}
      {showImageUpload && (
        <ImageUpload
          onImageProcessed={handleImageProcessed}
          onClose={() => setShowImageUpload(false)}
        />
      )}
    </div>
  );
};

export default EnhancedChatDemo;
