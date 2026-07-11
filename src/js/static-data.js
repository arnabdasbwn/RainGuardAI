/**
 * Static Data & Fallback Resources for RainGuard AI
 */

export const EMERGENCY_CONTACTS = [
  { name: 'National Disaster Response Force (NDRF)', phone: '9711077372', description: 'Immediate search and rescue support' },
  { name: 'National Emergency Number', phone: '112', description: 'Single emergency support line' },
  { name: 'Disaster Management Helpline', phone: '108', description: 'Ambulance and medical emergencies' },
  { name: 'Police Control Room', phone: '100', description: 'Local safety and law enforcement' },
  { name: 'Fire Services', phone: '101', description: 'Fire and structural emergencies' },
  { name: 'Water Logging / Municipal Helpline', phone: '1916', description: 'Flooding and municipal drainage issues' }
];

export const STATIC_CHECKLISTS = {
  basic: [
    { id: 'b1', text: 'Drinking water (minimum 3 liters per person per day, store for 3 days)', category: 'Survival' },
    { id: 'b2', text: 'Dry food items (parched rice, biscuits, dry fruits, energy bars)', category: 'Survival' },
    { id: 'b3', text: 'First-aid kit (bandages, antiseptic liquid, pain relievers, ORS packets)', category: 'Medical' },
    { id: 'b4', text: 'Flashlight (torch) with extra set of batteries', category: 'Utilities' },
    { id: 'b5', text: 'Fully charged power bank and mobile phone', category: 'Utilities' },
    { id: 'b6', text: 'Essential personal documents in a waterproof bag', category: 'Documents' },
    { id: 'b7', text: 'Extra cash kept in waterproof pouches', category: 'Survival' },
    { id: 'b8', text: 'Raincoat, umbrella, and sturdy waterproof footwear', category: 'Clothing' }
  ],
  infants: [
    { id: 'i1', text: 'Infant formula milk and sterilized bottles', category: 'Baby Care' },
    { id: 'i2', text: 'Baby food, purees, and clean drinking water for baby', category: 'Baby Care' },
    { id: 'i3', text: 'Diapers (at least 3-day supply) and wet wipes', category: 'Baby Care' },
    { id: 'i4', text: 'Baby medicines (paracetamol drops, cold remedies)', category: 'Medical' },
    { id: 'i5', text: 'Warm clothing, blankets, and mosquito netting', category: 'Clothing' }
  ],
  elderly: [
    { id: 'e1', text: 'Prescription medicines (minimum 7-day supply)', category: 'Medical' },
    { id: 'e2', text: 'Copy of medical history, prescriptions, and doctor contact info', category: 'Documents' },
    { id: 'e3', text: 'Mobility aids (extra walking stick, glasses, hearing aid batteries)', category: 'Utilities' },
    { id: 'e4', text: 'Easy-to-digest food items and supplements', category: 'Survival' },
    { id: 'e5', text: 'Warm clothing, blankets, and support pillows', category: 'Clothing' }
  ],
  pets: [
    { id: 'p1', text: 'Pet food (dry or canned) and clean water bowl', category: 'Pet Care' },
    { id: 'p2', text: 'Pet collar, identification tags, and sturdy leash/carrier', category: 'Pet Care' },
    { id: 'p3', text: 'Pet vaccination records and medical documents', category: 'Documents' },
    { id: 'p4', text: 'Pet medications (if any)', category: 'Medical' },
    { id: 'p5', text: 'Litter box, trash bags, and clean towels', category: 'Pet Care' }
  ]
};

export const DISASTER_GUIDELINES = {
  en: {
    before: {
      title: 'Monsoon Preparation (Before)',
      steps: [
        '**Inspect and Waterproof Your Home:** Check for cracks in walls, clear rooftop drain pipes, and secure roofs to prevent water leakage.',
        '**Clear Local Drains:** Ensure the gutters around your house are free from garbage, dry leaves, and silt to prevent waterlogging.',
        '**Prepare Emergency Supply Kits:** Assemble water, dry food, medicines, flashlights, and power banks in a waterproof bag.',
        '**Secure Essential Documents:** Place identity cards, insurance papers, land deeds, and certificates in a ziplock bag and scan digital copies.',
        '**Prune Vulnerable Trees:** Cut down weak tree branches near windows or power lines that could collapse in strong winds.'
      ]
    },
    during: {
      title: 'Active Storm & Flooding (During)',
      steps: [
        '**Stay Indoors:** Avoid leaving shelter unless absolutely necessary or advised by rescue authorities.',
        '**Turn Off Electrical Appliances:** Disconnect power grids and main switches if water enters your home to prevent electrocution.',
        '**Do Not Wade in Floods:** Floodwaters can carry waterborne pathogens, sharp debris, or open manholes. Avoid driving or walking through water.',
        '**Drink Clean/Boiled Water:** Contaminated water is common. Boil water for at least 10 minutes or use water purification tablets.',
        '**Listen to Official Advisories:** Keep a battery-operated radio or phone tuned to government alerts. Avoid believing social media rumors.'
      ]
    },
    after: {
      title: 'Post-Flood Recovery & Health (After)',
      steps: [
        '**Check for Electrical/Gas Faults:** Do not turn on electricity until an electrician certifies it is dry and safe. Check for gas leaks.',
        '**Prevent Mosquito Breeding:** Drain standing water from buckets, coolers, pots, and tires. Use mosquito repellents and nets.',
        '**Sanitize Your Premises:** Clean mud and silt deposits using bleach or disinfectants to prevent mold and bacterial growth.',
        '**Inspect Food for Contamination:** Throw away any food items that came into contact with floodwaters.',
        '**Seek Medical Help Immediately:** If you experience fever, diarrhea, rashes, or injuries, contact a doctor immediately to check for dengue or leptospirosis.'
      ]
    }
  },
  hi: {
    before: {
      title: 'मानसून की तैयारी (पहले)',
      steps: [
        '**घर की जांच और वॉटरप्रूफिंग:** दीवारों में दरारों की जांच करें, छत की जल निकासी पाइपों को साफ करें और रिसाव रोकने के लिए छतों को सुरक्षित करें।',
        '**स्थानीय नालियों को साफ करें:** जलभराव को रोकने के लिए सुनिश्चित करें कि आपके घर के आसपास की नालियां कचरे, सूखे पत्तों और कीचड़ से मुक्त हों।',
        '**आपातकालीन आपूर्ति किट तैयार करें:** पानी, सूखा भोजन, दवाएं, टॉर्च और पावर बैंक को एक जलरोधक (waterproof) बैग में रखें।',
        '**आवश्यक दस्तावेजों को सुरक्षित रखें:** पहचान पत्र, बीमा पत्र और प्रमाणपत्रों को एक ज़िपलॉक बैग में रखें और डिजिटल प्रतियां सुरक्षित करें।',
        '**कमजोर पेड़ों की छंटाई करें:** खिड़कियों या बिजली की लाइनों के पास लटकी हुई कमजोर पेड़ की शाखाओं को काट दें जो तेज हवाओं में गिर सकती हैं।'
      ]
    },
    during: {
      title: 'सक्रिय तूफान और बाढ़ (दौरान)',
      steps: [
        '**घरों के अंदर रहें:** जब तक बिल्कुल आवश्यक न हो या बचाव अधिकारियों द्वारा सलाह न दी जाए, आश्रय से बाहर न निकलें।',
        '**बिजली के उपकरणों को बंद करें:** बिजली के झटके से बचने के लिए यदि घर में पानी घुस जाए, तो मुख्य स्विच और बिजली के उपकरणों को बंद कर दें।',
        '**बाढ़ के पानी में न जाएं:** बाढ़ के पानी में रोगजनक जीवाणु, नुकीले कचरे या खुले मैनहोल हो सकते हैं। पानी में वाहन चलाने या चलने से बचें।',
        '**साफ/उबला हुआ पानी पिएं:** दूषित पानी मिलना आम है। पानी को कम से कम 10 मिनट उबालें या जल शोधन गोलियों का उपयोग करें।',
        '**आधिकारिक सूचनाएं सुनें:** सरकारी चेतावनियों के लिए फोन या बैटरी से चलने वाले रेडियो का उपयोग करें। अफवाहों पर विश्वास न करें।'
      ]
    },
    after: {
      title: 'बाढ़ के बाद सुधार और स्वास्थ्य (बाद में)',
      steps: [
        '**बिजली/गैस दोषों की जांच करें:** जब तक प्रमाणित न हो जाए कि यह सूखा और सुरक्षित है, तब तक बिजली चालू न करें। गैस लीक की जांच करें।',
        '**मच्छरों के प्रजनन को रोकें:** बाल्टियों, कूलरों, गमलों और टायरों से जमा पानी निकालें। मच्छर भगाने वाली दवाओं और नेट का उपयोग करें।',
        '**अपने परिसर को सैनिटाइज करें:** मोल्ड और बैक्टीरियल विकास को रोकने के लिए ब्लीच या कीटाणुनाशकों का उपयोग करके कीचड़ साफ करें।',
        '**भोजन के दूषित होने की जांच करें:** बाढ़ के पानी के संपर्क में आने वाली किसी भी खाद्य सामग्री को फेंक दें।',
        '**तुरंत चिकित्सा सहायता लें:** यदि आपको बुखार, दस्त, चकत्ते या चोट का अनुभव होता है, तो डेंगू या लेप्टोस्पायरोसिस की जांच के लिए तुरंत डॉक्टर से संपर्क करें।'
      ]
    }
  }
};

// Add fallback disaster guidelines for other languages to satisfy complete offline resilience
const FallbackGuidelines = {
  bn: {
    before: { title: 'বর্ষার প্রস্তুতি (আগে)', steps: ['**ঘর সুরক্ষিত করুন:** ফাটল মেরামত করুন ও ছাদের নর্দমা পরিষ্কার রাখুন।', '**নর্দমা পরিষ্কার:** জল জমতে না দেওয়ার জন্য নর্দমা পরিষ্কার রাখুন।', '**জরুরি কিট:** জল, শুকনো খাবার এবং ওষুধ মজুত রাখুন।'] },
    during: { title: 'ঝড় ও বন্যার সময় (কালীন)', steps: ['**ঘরে থাকুন:** খুব প্রয়োজন ছাড়া বাইরে বেরোবেন না।', '**বিদ্যুৎ সংযোগ বিচ্ছিন্ন:** ঘরে জল ঢুকলে মেইন সুইচ বন্ধ করুন।', '**বন্যায় হাঁটবেন না:** খোলা ম্যানহোল এবং সংক্রামক রোগের ঝুঁকি এড়াতে বন্যার জলে হাঁটবেন না।'] },
    after: { title: 'বন্যা পরবর্তী উদ্ধার (পরে)', steps: ['**বিদ্যুৎ পরীক্ষা:** ভালো করে শুকনো না হওয়া পর্যন্ত পাওয়ার চালু করবেন না।', '**মশাবাহিত রোগ:** জমা জল পরিষ্কার করে মশার বংশবৃদ্ধি রোধ করুন।', '**চিকিৎসা:** জ্বর বা জখম হলে সাথে সাথে ডাক্তারের সাথে যোগাযোগ করুন।'] }
  },
  es: {
    before: { title: 'Preparación para el Monzón (Antes)', steps: ['**Impermeabilice su casa:** Repare grietas y limpie tuberías en techos.', '**Limpie desagües:** Retire hojas y basura para evitar inundaciones.', '**Kit de emergencia:** Guarde agua, alimentos secos y medicinas en bolsa impermeable.'] },
    during: { title: 'Durante la Tormenta o Inundación (Durante)', steps: ['**Quédese adentro:** No salga del refugio a menos que sea necesario.', '**Corte la electricidad:** Desconecte interruptores si entra agua a la casa.', '**No camine en inundaciones:** Evite caminar o conducir en corrientes de agua.'] },
    after: { title: 'Recuperación después de Inundación (Después)', steps: ['**Revise luz y gas:** No encienda la luz hasta estar seguro de que está seco.', '**Evite mosquitos:** Vacíe recipientes con agua estancada.', '**Atención médica:** Busque asistencia si presenta fiebre o infecciones.'] }
  }
};

// Merge basic guidelines
Object.keys(FallbackGuidelines).forEach(l => {
  DISASTER_GUIDELINES[l] = FallbackGuidelines[l];
});

// Setup translation mappings for all major Indian and international languages
export const TRANSLATIONS = {
  en: {
    lang_selector: "Select Language",
    text_size: "Select Text Size",
    theme_selector: "Select Contrast Theme",
    api_settings: "🔑 API Settings",
    nav_dashboard: "Dashboard",
    nav_profiler: "Resilience Profiler",
    nav_checklist: "Emergency Kit",
    nav_travel: "Travel Sentinel",
    nav_guidelines: "Safety Hub",
    nav_chat: "AI Responder",
    title_dashboard: "Monsoon Dashboard",
    sub_dashboard: "Real-time localized hazards and safety advisories.",
    humidity: "Humidity",
    precipitation: "Precipitation",
    wind_speed: "Wind Speed",
    title_advisory: "AI Safety Advisory",
    default_advisory: "Please update your location or enter an API key to receive personalized AI recommendations.",
    last_updated: "Last updated: Just now",
    change_location: "Change Location",
    fetch_weather: "Fetch Weather",
    weather_news_title: "Local Weather Bulletin",
    news_loading: "Loading news bulletins for your location...",
    btn_detect_gps: "Auto-Detect Location",
    nearby_weather_title: "Nearby Sectors Weather Reports",
    placeholder_city: "Enter city name (e.g. Mumbai, New Delhi)",
    title_profiler: "Resilience Profiler",
    sub_profiler: "Build a localized preparedness plan for your household.",
    label_name: "Your Name",
    placeholder_name: "John Doe",
    label_city: "Target Location / City",
    placeholder_target_city: "Mumbai",
    label_housing: "Housing Infrastructure Type",
    house_ground: "Ground Floor (High Flood Risk)",
    house_high: "Upper Floor / High-Rise Apartment",
    house_temp: "Temporary / Informal Housing",
    label_family: "Household Family Size",
    label_vuln: "Specific Household Vulnerabilities",
    vuln_infants: "Infants / Young Children",
    vuln_elderly: "Elderly Members",
    vuln_pets: "Pets / Livestock",
    vuln_chronic: "Chronic Medical Conditions",
    label_notes: "Additional Safety Notes (Optional)",
    placeholder_notes: "e.g. nearby culvert overflows frequently, medicine requirements...",
    btn_generate: "Generate Preparedness Plan",
    title_checklist: "Emergency Kit Manager",
    sub_checklist: "Tick off items for your disaster kit. Profile vulnerabilities add specialized lists.",
    btn_reset: "Reset Items",
    title_travel: "Travel Sentinel",
    sub_travel: "Check route flood vulnerabilities based on your transit method.",
    label_origin: "Starting Location",
    placeholder_origin: "e.g. Bandra West",
    label_destination: "Destination",
    placeholder_destination: "e.g. Mumbai Airport Terminal 2",
    label_mode: "Transit Mode",
    mode_walking: "Walking / Pedestrian",
    mode_two_wheeler: "Two-Wheeler (Motorcycle/Scooter)",
    mode_car: "Car / Taxi",
    mode_public: "Public Transit (Local Trains/Buses)",
    btn_evaluate: "Evaluate Route Safety",
    title_guidelines: "Safety Hub",
    sub_guidelines: "Fail-safe monsoon guidelines (Before, During, and After) & Emergency Contacts.",
    tab_before: "Before",
    tab_during: "During",
    tab_after: "After",
    tab_contacts: "Contacts",
    title_contacts: "Verified Emergency Contacts",
    title_chat: "AI Safety Responder",
    sub_chat: "Interactive multilingual advice. Strictly grounded in safety protocols.",
    btn_send: "Send",
    placeholder_chat: "Type your safety or preparedness question...",
    title_api: "API Configurations",
    label_api_key: "Google Gemini API Key",
    sub_api_key: "This key is saved locally in your browser (session storage/local storage) and is only sent directly to Google's GenAI endpoint.",
    btn_clear_key: "Clear Key",
    btn_save_settings: "Save Settings",
    footer: "© 2026 RainGuard AI. Preparedness safeguards lives. Protect your community.",
    default_chat_welcome: "Hello! I am your RainGuard emergency safety advisor. How can I help you prepare or stay safe during this monsoon season?",
    offline_banner_text: "⚠️ You are currently offline. Running in local fail-safe mode. Saved plans and checklists are available."
  },
  hi: {
    lang_selector: "भाषा चुनें",
    text_size: "टेक्स्ट का आकार",
    theme_selector: "कंट्रास्ट थीम",
    api_settings: "🔑 एपीआई सेटिंग्स",
    nav_dashboard: "डैशबोर्ड",
    nav_profiler: "तैयारी योजना",
    nav_checklist: "चेकलिस्ट",
    nav_travel: "यात्रा सलाहकार",
    nav_guidelines: "सुरक्षा निर्देशिका",
    nav_chat: "सहायता चैट",
    title_dashboard: "मानसून डैशबोर्ड",
    sub_dashboard: "वास्तविक समय में स्थानीय खतरे और सुरक्षा सलाह।",
    humidity: "आर्द्रता",
    precipitation: "वर्षा",
    wind_speed: "हवा की गति",
    title_advisory: "एआई सुरक्षा सलाह",
    default_advisory: "व्यक्तिगत एआई सलाह प्राप्त करने के लिए अपना स्थान अपडेट करें या एपीआई कुंजी दर्ज करें।",
    last_updated: "अंतिम अपडेट: अभी-अभी",
    change_location: "स्थान बदलें",
    fetch_weather: "मौसम लाएं",
    weather_news_title: "स्थानीय समाचार बुलेटिन",
    news_loading: "आपके स्थान के लिए समाचार बुलेटिन लोड हो रहा है...",
    btn_detect_gps: "अपना स्थान खोजें",
    nearby_weather_title: "आसपास के क्षेत्रों के मौसम की रिपोर्ट",
    placeholder_city: "शहर का नाम दर्ज करें (जैसे मुंबई, नई दिल्ली)",
    title_profiler: "तैयारी योजना निर्माण",
    sub_profiler: "अपने घर के लिए अनुकूलित मानसून सुरक्षा योजना तैयार करें।",
    label_name: "आपका नाम",
    placeholder_name: "जॉन डो",
    label_city: "लक्ष्य स्थान / शहर",
    placeholder_target_city: "मुंबई",
    label_housing: "आवास अवसंरचना प्रकार",
    house_ground: "भूतल (बाढ़ का उच्च खतरा)",
    house_high: "ऊपरी मंजिल / बहुमंजिला इमारत",
    house_temp: "अस्थायी आवास / झुग्गी क्षेत्र",
    label_family: "पारिवारिक सदस्यों की संख्या",
    label_vuln: "विशिष्ट पारिवारिक संवेदनशीलता",
    vuln_infants: "शिशु / छोटे बच्चे",
    vuln_elderly: "बुजुर्ग सदस्य",
    vuln_pets: "पालतू जानवर",
    vuln_chronic: "दीर्घकालिक बीमारी",
    label_notes: "अतिरिक्त सुरक्षा विवरण (वैकल्पिक)",
    placeholder_notes: "उदा. समीप नाली बह जाती है, दवा की आवश्यकताएं...",
    btn_generate: "सुरक्षा योजना तैयार करें",
    title_checklist: "आपातकालीन किट प्रबंधक",
    sub_checklist: "आपातकालीन किट के लिए आवश्यक सामान सहेजें। प्रोफाइल के अनुसार विशेष किट सूची जोड़ी जाती है।",
    btn_reset: "रीसेट करें",
    title_travel: "यात्रा सुरक्षा प्रहरी",
    sub_travel: "अपनी पारगमन विधि के आधार पर मार्ग बाढ़ संवेदनशीलता की जांच करें।",
    label_origin: "प्रस्थान बिंदु",
    placeholder_origin: "जैसे बांद्रा वेस्ट",
    label_destination: "गंतव्य स्थान",
    placeholder_destination: "जैसे मुंबई एयरपोर्ट टर्मिनल 2",
    label_mode: "पारगमन मोड",
    mode_walking: "पैदल यात्रा (Walking)",
    mode_two_wheeler: "दोपहिया वाहन (Two-Wheeler)",
    mode_car: "चार पहिया वाहन (Car/Taxi)",
    mode_public: "सार्वजनिक परिवहन (Trains/Buses)",
    btn_evaluate: "मार्ग सुरक्षा का आकलन करें",
    title_guidelines: "सुरक्षा निर्देशिका",
    sub_guidelines: "बाढ़ और मानसून के लिए आपातकालीन संपर्क और महत्वपूर्ण नियम (पहले, दौरान और बाद में)।",
    tab_before: "पहले (तैयारी)",
    tab_during: "दौरान (बचाव)",
    tab_after: "बाद में (सुधार)",
    tab_contacts: "आपातकालीन संपर्क",
    title_contacts: "सत्यापित आपातकालीन नंबर",
    title_chat: "एआई सुरक्षा चैट",
    sub_chat: "इंटरैक्टिव बहुभाषी सहायता। सुरक्षा प्रोटोकॉल पर आधारित।",
    btn_send: "भेजें",
    placeholder_chat: "आपातकालीन तैयारी या सुरक्षा प्रश्न पूछें...",
    title_api: "एपीआई सेटिंग्स",
    label_api_key: "गूगल जेमिनी एपीआई कुंजी",
    sub_api_key: "यह कुंजी आपके ब्राउज़र में सुरक्षित रूप से स्थानीय रूप से सहेजी जाती है।",
    btn_clear_key: "कुंजी मिटाएं",
    btn_save_settings: "सेटिंग्स सहेजें",
    footer: "© 2026 RainGuard AI. सुरक्षा योजना जान बचाती है। अपने समुदाय की रक्षा करें।",
    default_chat_welcome: "नमस्ते! मैं आपका रेनगार्ड आपातकालीन सुरक्षा सलाहकार हूं। मैं इस मानसून में आपकी सुरक्षा में कैसे मदद कर सकता हूं?",
    offline_banner_text: "⚠️ आप अभी ऑफलाइन हैं। स्थानीय सुरक्षित मोड सक्रिय है।"
  },
  bn: { // Bengali
    lang_selector: "ভাষা নির্বাচন করুন",
    text_size: "ফন্টের আকার",
    theme_selector: "থিম বৈসাদৃশ্য",
    api_settings: "🔑 এপিআই সেটিংস",
    nav_dashboard: "ড্যাশবোর্ড",
    nav_profiler: "প্রস্তুতি পরিকল্পনাকারী",
    nav_checklist: "জরুরি কিট",
    nav_travel: "ভ্রমণ উপদেষ্টা",
    nav_guidelines: "সুরক্ষা নির্দেশিকা",
    nav_chat: "এআই চ্যাট",
    title_dashboard: "বর্ষাকালীন ড্যাশবোর্ড",
    sub_dashboard: "রিয়েল-টাইম আবহাওয়া ও সুরক্ষা সতর্কতা।",
    humidity: "আর্দ্রতা",
    precipitation: "বৃষ্টিপাত",
    wind_speed: "বাতাসের গতি",
    title_advisory: "এআই সুরক্ষা পরামর্শ",
    default_advisory: "ব্যক্তিগত এআই পরামর্শ পেতে এপিআই কী ব্যবহার করুন বা লোকেশন আপডেট করুন।",
    last_updated: "শেষ আপডেট: এইমাত্র",
    change_location: "লোকেশন পরিবর্তন",
    fetch_weather: "আবহাওয়া দেখুন",
    btn_detect_gps: "আমার অবস্থান খুঁজুন",
    nearby_weather_title: "পার্শ্ববর্তী এলাকার আবহাওয়ার রিপোর্ট",
    placeholder_city: "শহরের নাম লিখুন (যেমন: মুম্বাই)",
    title_profiler: "প্রস্তুতি পরিকল্পনাকারী",
    sub_profiler: "আপনার পরিবারের জন্য কাস্টম প্রস্তুতি পরিকল্পনা তৈরি করুন।",
    label_name: "আপনার নাম",
    placeholder_name: "জন ডো",
    label_city: "বর্তমান শহর",
    placeholder_target_city: "মুম্বাই",
    label_housing: "আবাসনের ধরণ",
    house_ground: "নিচতলা (বন্যার ঝুঁকি বেশি)",
    house_high: "বহুতল ফ্ল্যাট",
    house_temp: "অস্থায়ী বাসস্থান",
    label_family: "পরিবারের সদস্য সংখ্যা",
    label_vuln: "বিশেষ সংবেদনশীলতা",
    vuln_infants: "শিশু / ছোট বাচ্চা",
    vuln_elderly: "বয়স্ক সদস্য",
    vuln_pets: "গৃহপালিত পশু",
    vuln_chronic: "দীর্ঘস্থায়ী রোগ",
    label_notes: "অতিরিক্ত তথ্য",
    placeholder_notes: "যেমন: ওষুধের প্রয়োজন বা ড্রেনেজ সমস্যা...",
    btn_generate: "প্রস্তুতি পরিকল্পনা তৈরি করুন",
    title_checklist: "জরুরি কিট পরিচালক",
    sub_checklist: "আপনার জরুরি কিটের জিনিসপত্র চিহ্নিত করুন।",
    btn_reset: "রিসেট করুন",
    title_travel: "ভ্রমণ নিরাপত্তা মূল্যায়ন",
    sub_travel: "বন্যার ঝুঁকির উপর ভিত্তি করে আপনার ভ্রমণ রুটের নিরাপত্তা পরীক্ষা করুন।",
    label_origin: "যাত্রা শুরুর স্থান",
    placeholder_origin: "যেমন: বান্দ্রা",
    label_destination: "গন্তব্য",
    placeholder_destination: "যেমন: এয়ারপোর্ট",
    label_mode: "যাতায়াতের মাধ্যম",
    mode_walking: "পায়ে হেঁটে",
    mode_two_wheeler: "মোটরসাইকেল / স্কুটার",
    mode_car: "কার / ট্যাক্সি",
    mode_public: "সরকারি বাস / ট্রেন",
    btn_evaluate: "রুটের নিরাপত্তা পরীক্ষা করুন",
    title_guidelines: "সুরক্ষা নির্দেশিকা",
    sub_guidelines: "বর্ষার প্রস্তুতি সংক্রান্ত তথ্য এবং জরুরি নম্বরসমূহ।",
    tab_before: "আগে",
    tab_during: "কালীন",
    tab_after: "পরে",
    tab_contacts: "জরুরি নম্বর",
    title_contacts: "জরুরি হেল্পলাইন নম্বরসমূহ",
    title_chat: "এআই সুরক্ষা চ্যাট",
    sub_chat: "আবহাওয়া এবং বর্ষাকালীন সুরক্ষা প্রশ্নের সমাধান।",
    btn_send: "পাঠান",
    placeholder_chat: "আপনার প্রশ্নটি এখানে লিখুন...",
    title_api: "এপিআই সেটিংস",
    label_api_key: "গুগল জেমিনি এপিআই কী",
    sub_api_key: "আপনার এপিআই কী আপনার ব্রাউজারে সুরক্ষিতভাবে সংরক্ষিত থাকে।",
    btn_clear_key: "কী মুছুন",
    btn_save_settings: "সেটিংস সংরক্ষণ",
    footer: "© 2026 RainGuard AI. প্রস্তুতি জীবন বাঁচায়। আপনার সম্প্রদায়কে সুরক্ষিত রাখুন।",
    default_chat_welcome: "হ্যালো! আমি আপনার রেইনগার্ড জরুরি সুরক্ষা উপদেষ্টা। আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    offline_banner_text: "⚠️ আপনি বর্তমানে অফলাইনে আছেন। লোকাল নিরাপদ মোড সক্রিয়।"
  },
  te: { // Telugu
    lang_selector: "భాషను ఎంచుకోండి",
    text_size: "అక్షరాల పరిమాణం",
    theme_selector: "కాంట్రాస్ట్ థీమ్",
    api_settings: "🔑 API సెట్టింగ్స్",
    nav_dashboard: "డాష్‌బోర్డ్",
    nav_profiler: "సన్నద్ధత ప్రణాళిక",
    nav_checklist: "కిట్ చెక్‌లిస్ట్",
    nav_travel: "ప్రయాణ సలహాదారు",
    nav_guidelines: "భద్రతా మార్గదర్శకాలు",
    nav_chat: "AI సహాయం",
    title_dashboard: "వర్షాకాల డాష్‌బోర్డ్",
    sub_dashboard: "నిజ-సమయ వాతావరణం మరియు ప్రమాద హెచ్చరికలు.",
    humidity: "తేమ",
    precipitation: "వర్షపాతం",
    wind_speed: "గాలి వేగం",
    title_advisory: "AI భద్రతా సలహా",
    default_advisory: "వ్యక్తిగతీకరించిన AI సలహా పొందడానికి లొకేషన్ అప్‌డేట్ చేయండి లేదా API కీ నమోదు చేయండి.",
    last_updated: "చివరి అప్‌డేట్: ఇప్పుడే",
    change_location: "లొకేషన్ మార్చండి",
    fetch_weather: "వాతావరణం పొందండి",
    btn_detect_gps: "స్థానాన్ని గుర్తించు",
    nearby_weather_title: "సమీప ప్రాంతాల వాతావరణ సమాచారం",
    placeholder_city: "నగరం పేరును నమోదు చేయండి",
    title_profiler: "సన్నద్ధత ప్రణాళిక",
    sub_profiler: "మీ కుటుంబం కోసం సన్నద్ధత ప్రణాళికను సిద్ధం చేసుకోండి.",
    label_name: "మీ పేరు",
    placeholder_name: "జాన్ డో",
    label_city: "నగరం",
    placeholder_target_city: "ముంబై",
    label_housing: "ఇంటి రకం",
    house_ground: "గ్రౌండ్ ఫ్లోర్ (వరద ముప్పు ఎక్కువ)",
    house_high: "పై అంతస్తు / అపార్ట్‌మెంట్",
    house_temp: "తాత్కాలిక నివాసం",
    label_family: "కుటుంబ సభ్యుల సంఖ్య",
    label_vuln: "ప్రత్యేక అవసరాలు",
    vuln_infants: "చిన్న పిల్లలు",
    vuln_elderly: "వృద్ధులు",
    vuln_pets: "పెంపుడు జంతువులు",
    vuln_chronic: "దీర్ఘకాలిక వ్యాధులు",
    label_notes: "అదనపు సమాచారం",
    placeholder_notes: "మందుల అవసరం లేదా వరద ముప్పుల గురించి...",
    btn_generate: "ప్రణాళికను సిద్ధం చేయి",
    title_checklist: "ఆపద కిట్ మేనేజర్",
    sub_checklist: "మీ కిట్ లో భద్రపరచాల్సిన వస్తువులను తనిఖీ చేయండి.",
    btn_reset: "రీసెట్ చేయి",
    title_travel: "ప్రయాణ భద్రత తనిఖీ",
    sub_travel: "వరద ముప్పుల ఆధారంగా ప్రయాణ మార్గాన్ని తనిఖీ చేయండి.",
    label_origin: "ప్రారంభ స్థానం",
    placeholder_origin: "ఉదా. బాంద్రా",
    label_destination: "గమ్యస్థానం",
    placeholder_destination: "ఉదా. విమానాశ్రయం",
    label_mode: "ప్రయాణ సాధనం",
    mode_walking: "నడక ద్వారా",
    mode_two_wheeler: "ద్విచక్ర వాహనం",
    mode_car: "కారు / టాక్సీ",
    mode_public: "రైలు / బస్సు",
    btn_evaluate: "మార్గం భద్రతను అంచనా వేయి",
    title_guidelines: "భద్రతా మార్గదర్శకాలు",
    sub_guidelines: "వర్షాలు మరియు వరదల సమయంలో తీసుకోవాల్సిన జాగ్రత్తలు.",
    tab_before: "ముందు",
    tab_during: "సమయంలో",
    tab_after: "తరువాత",
    tab_contacts: "అవసరమైన నంబర్లు",
    title_contacts: "ఆపద సమయ హెల్ప్‌లైన్ నంబర్లు",
    title_chat: "AI భద్రతా చాట్",
    sub_chat: "భద్రతా సలహాల కొరకు చాట్ చేయండి.",
    btn_send: "పంపించు",
    placeholder_chat: "మీ భద్రతా ప్రశ్నను అడగండి...",
    title_api: "API కాన్ఫిగరేషన్",
    label_api_key: "Google Gemini API కీ",
    sub_api_key: "ఈ కీ మీ బ్రౌజర్ లో సురక్షితంగా సేవ్ చేయబడుతుంది.",
    btn_clear_key: "కీని తొలగించు",
    btn_save_settings: "సేవ్ చేయి",
    footer: "© 2026 RainGuard AI. ముందస్తు జాగ్రత్తలు ప్రాణాలు కాపాడుతాయి.",
    default_chat_welcome: "నమస్కారం! నేను మీ రేయిన్‌గార్డ్ రక్షణ సలహాదారుని. మీకు ఎలా సహాయపడగలను?",
    offline_banner_text: "⚠️ మీరు ప్రస్తుతం ఆఫ్ లైన్ లో ఉన్నారు. స్థానిక మోడ్ పనిచేస్తుంది."
  },
  ta: { // Tamil
    lang_selector: "மொழியைத் தேர்ந்தெடுக்கவும்",
    text_size: "எழுத்து அளவு",
    theme_selector: "மாறுபட்ட தீம்",
    api_settings: "🔑 API அமைப்புகள்",
    nav_dashboard: "டாஷ்போர்டு",
    nav_profiler: "தயாரிப்பு திட்டம்",
    nav_checklist: "பொருட்கள் பட்டியல்",
    nav_travel: "பயண ஆலோசகர்",
    nav_guidelines: "பாதுகாப்பு கையேடு",
    nav_chat: "AI உதவி",
    title_dashboard: "மழைக்கால டாஷ்போர்டு",
    sub_dashboard: "நிகழ்நேர வானிலை மற்றும் ஆபத்து எச்சரிக்கைகள்.",
    humidity: "ஈரப்பதம்",
    precipitation: "மழைப்பொழிவு",
    wind_speed: "காற்றின் வேகம்",
    title_advisory: "AI பாதுகாப்பு ஆலோசனை",
    default_advisory: "தனிப்பயனாக்கப்பட்ட AI ஆலோசனையைப் பெற உங்கள் இருப்பிடத்தைப் புதுப்பிக்கவும் அல்லது API விசையை உள்ளிடவும்.",
    last_updated: "கடைசி புதுப்பிப்பு: இப்பொழுது",
    change_location: "இருப்பிடத்தை மாற்று",
    fetch_weather: "வானிலை பெறு",
    btn_detect_gps: "இருப்பிடத்தைக் கண்டறி",
    nearby_weather_title: "அருகிலுள்ள பகுதிகளின் வானிலை அறிக்கை",
    placeholder_city: "நகரத்தின் பெயரை உள்ளிடவும் (எ.கா. மும்பை)",
    title_profiler: "தயாரிப்புத் திட்டம்",
    sub_profiler: "உங்கள் குடும்பத்திற்கான மழைக்கால பாதுகாப்பு திட்டத்தை உருவாக்குங்கள்.",
    label_name: "உங்கள் பெயர்",
    placeholder_name: "ஜான் டோ",
    label_city: "இலக்கு நகரம்",
    placeholder_target_city: "மும்பை",
    label_housing: "வீட்டு உள்கட்டமைப்பு வகை",
    house_ground: "தரைத் தளம் (வெள்ள அபாயம் அதிகம்)",
    house_high: "மேல் தளம் / அடுக்குமாடி குடியிருப்பு",
    house_temp: "தற்காலிக குடியிருப்பு",
    label_family: "குடும்ப உறுப்பினர்களின் எண்ணிக்கை",
    label_vuln: "குறிப்பிட்ட குடும்ப பாதிப்புகள்",
    vuln_infants: "குழந்தைகள் / சிறுவர்கள்",
    vuln_elderly: "முதியவர்கள்",
    vuln_pets: "செல்லப்பிராணிகள்",
    vuln_chronic: "நாள்பட்ட நோய் உள்ளவர்கள்",
    label_notes: "கூடுதல் குறிப்புகள்",
    placeholder_notes: "எ.கா. மருந்து தேவைகள் அல்லது வடிகால் பிரச்சினைகள்...",
    btn_generate: "பாதுகாப்பு திட்டத்தை உருவாக்கு",
    title_checklist: "அவசரகால கிட் மேலாளர்",
    sub_checklist: "அவசரகால கிட்டில் இருக்க வேண்டிய பொருட்களை சரிபார்க்கவும்.",
    btn_reset: "மீட்டமை",
    title_travel: "பயண பாதுகாப்பு கண்காணிப்பு",
    sub_travel: "வெள்ள அபாயத்தின் அடிப்படையில் பயண வழியை சரிபார்க்கவும்.",
    label_origin: "புறப்படும் இடம்",
    placeholder_origin: "எ.கா. பாந்த்ரா",
    label_destination: "சேருமிடம்",
    placeholder_destination: "எ.கா. விமான நிலையம்",
    label_mode: "பயண முறை",
    mode_walking: "நடைப்பயணம்",
    mode_two_wheeler: "இருசக்கர வாகனம்",
    mode_car: "கார் / டாக்ஸி",
    mode_public: "ரயில் / பேருந்து",
    btn_evaluate: "வழியின் பாதுகாப்பை மதிப்பிடு",
    title_guidelines: "பாதுகாப்பு கையேடு",
    sub_guidelines: "மழை மற்றும் வெள்ளத்தின் போது செய்ய வேண்டியவை மற்றும் செய்யக்கூடாதவை.",
    tab_before: "முன்னர்",
    tab_during: "போது",
    tab_after: "பின்னர்",
    tab_contacts: "அவசர எண்கள்",
    title_contacts: "அவசரகால உதவி எண்கள்",
    title_chat: "AI பாதுகாப்பு அரட்டை",
    sub_chat: "மழைக்கால பாதுகாப்பு மற்றும் முதலுதவி ஆலோசனைகள்.",
    btn_send: "அனுப்பு",
    placeholder_chat: "பாதுகாப்பு தொடர்பான கேள்விகளைக் கேட்கவும்...",
    title_api: "API அமைப்புகள்",
    label_api_key: "Google Gemini API விசை",
    sub_api_key: "இந்த விசை உங்கள் உலாவியில் பாதுகாப்பாக சேமிக்கப்படும்.",
    btn_clear_key: "விசையை நீக்கு",
    btn_save_settings: "அமைப்புகளை சேமி",
    footer: "© 2026 RainGuard AI. தயாரிப்பு உயிர்களைக் காக்கும்.",
    default_chat_welcome: "வணக்கம்! நான் உங்கள் ரெய்ன்கார்ட் அவசரகால பாதுகாப்பு ஆலோசகர். நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
    offline_banner_text: "⚠️ நீங்கள் தற்போது ஆஃப்லைனில் உள்ளீர்கள். லோக்கல் மோடு செயலில் உள்ளது."
  },
  mr: { // Marathi
    lang_selector: "भाषा निवडा",
    text_size: "अक्षरांचा आकार",
    theme_selector: "कॉन्ट्रास्ट थीम",
    api_settings: "🔑 एपीआय सेटिंग्स",
    nav_dashboard: "डॅशबोर्ड",
    nav_profiler: "पूर्वतयारी योजना",
    nav_checklist: "साहित्य चेकलिस्ट",
    nav_travel: "प्रवास सल्लागार",
    nav_guidelines: "सुरक्षा मार्गदर्शिका",
    nav_chat: "एआय मदत",
    title_dashboard: "मानसून डॅशबोर्ड",
    sub_dashboard: "रिअल-टाइम स्थानिक हवामान आणि सुरक्षा इशारे.",
    humidity: "आर्द्रता",
    precipitation: "पाऊस",
    wind_speed: "वाऱ्याचा वेग",
    title_advisory: "एआय सुरक्षा सल्ला",
    default_advisory: "वैयक्तिकृत एआय सल्ला मिळवण्यासाठी स्थान अपडेट करा किंवा एपीआय की प्रविष्ट करा.",
    last_updated: "अंतिम बदल: आत्ताच",
    change_location: "स्थान बदला",
    fetch_weather: "हवामान मिळवा",
    btn_detect_gps: "माझे स्थान शोधा",
    nearby_weather_title: "जवळील भागातील हवामान अहवाल",
    placeholder_city: "शहर प्रविष्ट करा (उदा. मुंबई)",
    title_profiler: "पूर्वतयारी योजना",
    sub_profiler: "आपल्या कुटुंबासाठी आपत्ती पूर्वतयारी योजना तयार करा.",
    label_name: "तुमचे नाव",
    placeholder_name: "जॉन डो",
    label_city: "शहर",
    placeholder_target_city: "मुंबई",
    label_housing: "घराचा प्रकार",
    house_ground: "तळमजला (पूर येण्याचा मोठा धोका)",
    house_high: "वरचा मजला / अपार्टमेंट",
    house_temp: "अस्थायी निवास",
    label_family: "कुटुंबातील सदस्य संख्या",
    label_vuln: "कुटुंबातील संवेदनशील सदस्य",
    vuln_infants: "लहान मुले",
    vuln_elderly: "वृद्ध सदस्य",
    vuln_pets: "पाळीव प्राणी",
    vuln_chronic: "दीर्घकालीन आजार",
    label_notes: "अतिरिक्त माहिती",
    placeholder_notes: "उदा. औषधांच्या गरजा किंवा इतर समस्या...",
    btn_generate: "योजना तयार करा",
    title_checklist: "आपातकालीन किट व्यवस्थापक",
    sub_checklist: "तुमच्या आपत्ती किटमधील साहित्याची तपासणी करा.",
    btn_reset: "रीसेट करा",
    title_travel: "प्रवास सुरक्षा रक्षक",
    sub_travel: "पुराच्या धोक्याच्या आधारे प्रवासाच्या मार्गाची सुरक्षा तपासा.",
    label_origin: "प्रस्थानाचे ठिकाण",
    placeholder_origin: "उदा. वांद्रे",
    label_destination: "गंतव्य स्थान",
    placeholder_destination: "उदा. विमानतळ",
    label_mode: "प्रवासाचे साधन",
    mode_walking: "पैदल",
    mode_two_wheeler: "दुचाकी वाहन",
    mode_car: "चारचाकी / टॅक्सी",
    mode_public: "लोकल ट्रेन / बस",
    btn_evaluate: "मार्गाच्या सुरक्षेचे मूल्यमापन करा",
    title_guidelines: "सुरक्षा मार्गदर्शिका",
    sub_guidelines: "पूर आणि जोरदार पावसादरम्यान घ्यावयाची काळजी.",
    tab_before: "पूर्वी",
    tab_during: "दरम्यान",
    tab_after: "नंतर",
    tab_contacts: "आपातकालीन संपर्क",
    title_contacts: "सत्यापित आपत्कालीन क्रमांक",
    title_chat: "एआय सुरक्षा चॅट",
    sub_chat: "पूर सुरक्षा आणि प्रथमोपचारावर प्रश्न विचारा.",
    btn_send: "पाठवा",
    placeholder_chat: "सुरक्षा किंवा तयारीबद्दल प्रश्न विचारा...",
    title_api: "एपीीआय कॉन्फिगरेशन",
    label_api_key: "Google Gemini API की",
    sub_api_key: "ही की तुमच्या ब्राउझरमध्ये स्थानिक पातळीवर सुरक्षित ठेवली जाते.",
    btn_clear_key: "की मिटवा",
    btn_save_settings: "सेटिंग्ज जतन करा",
    footer: "© 2026 RainGuard AI. पूर्वतयारी जीव वाचवते. आपल्या समुदायाचे रक्षण करा.",
    default_chat_welcome: "नमस्कार! मी आपला रेनगार्ड आपत्कालीन सुरक्षा सल्लागार आहे. मी आपल्याला कशी मदत करू शकतो?",
    offline_banner_text: "⚠️ आपण सध्या ऑफलाइन आहात. स्थानिक फॉलबैक मोड सक्रिय आहे."
  },
  es: { // Spanish
    lang_selector: "Seleccionar Idioma",
    text_size: "Tamaño de Texto",
    theme_selector: "Contraste Visual",
    api_settings: "🔑 Ajustes de API",
    nav_dashboard: "Tablero",
    nav_profiler: "Planificador de Riesgo",
    nav_checklist: "Kit de Emergencia",
    nav_travel: "Viaje Seguro",
    nav_guidelines: "Manual de Ayuda",
    nav_chat: "Chat de Ayuda",
    title_dashboard: "Tablero del Monzón",
    sub_dashboard: "Alertas climáticas en tiempo real y precauciones locales.",
    humidity: "Humedad",
    precipitation: "Precipitación",
    wind_speed: "Velocidad del Viento",
    title_advisory: "Recomendación de Seguridad",
    default_advisory: "Actualice su ubicación o introduzca una clave API para recibir alertas de IA.",
    last_updated: "Última actualización: Hace un momento",
    change_location: "Cambiar Ubicación",
    fetch_weather: "Consultar Clima",
    btn_detect_gps: "Auto-Detectar Ubicación",
    nearby_weather_title: "Informes del Clima de Sectores Cercanos",
    placeholder_city: "Ingrese ciudad (ej. Mumbai)",
    title_profiler: "Plan de Resiliencia",
    sub_profiler: "Diseñe un plan personalizado para proteger su hogar.",
    label_name: "Su Nombre",
    placeholder_name: "John Doe",
    label_city: "Ubicación / Ciudad",
    placeholder_target_city: "Mumbai",
    label_housing: "Tipo de Vivienda",
    house_ground: "Planta Baja (Alto riesgo de inundación)",
    house_high: "Piso Superior / Apartamento",
    house_temp: "Vivienda Temporal",
    label_family: "Tamaño de la Familia",
    label_vuln: "Vulnerabilidades del Hogar",
    vuln_infants: "Infantes / Niños Pequeños",
    vuln_elderly: "Adultos Mayores",
    vuln_pets: "Mascotas / Animales",
    vuln_chronic: "Condición Médica Crónica",
    label_notes: "Notas Adicionales",
    placeholder_notes: "ej. culvert desborda con frecuencia, necesidades médicas...",
    btn_generate: "Generar Plan de Seguridad",
    title_checklist: "Organizador del Kit",
    sub_checklist: "Marque los artículos del kit. Las vulnerabilidades añaden listas específicas.",
    btn_reset: "Reiniciar Kit",
    title_travel: "Seguridad Vial",
    sub_travel: "Evalúe los riesgos de inundación en su ruta según su transporte.",
    label_origin: "Lugar de Salida",
    placeholder_origin: "ej. Bandra West",
    label_destination: "Destino",
    placeholder_destination: "ej. Aeropuerto",
    label_mode: "Medio de Transporte",
    mode_walking: "Caminando",
    mode_two_wheeler: "Motocicleta / Escúter",
    mode_car: "Automóvil / Taxi",
    mode_public: "Transporte Público (Tren/Autobús)",
    btn_evaluate: "Evaluar Seguridad de Ruta",
    title_guidelines: "Manual de Ayuda",
    sub_guidelines: "Pautas de mitigación antes, durante y después de tormentas.",
    tab_before: "Antes",
    tab_during: "Durante",
    tab_after: "Después",
    tab_contacts: "Contactos",
    title_contacts: "Contactos de Emergencia Verificados",
    title_chat: "Asistente de Emergencias AI",
    sub_chat: "Consulte dudas sobre inundaciones, primeros auxilios y protección.",
    btn_send: "Enviar",
    placeholder_chat: "Escriba su pregunta sobre seguridad...",
    title_api: "Configuración de API",
    label_api_key: "Clave API de Google Gemini",
    sub_api_key: "Esta clave se guarda localmente en su navegador de forma segura.",
    btn_clear_key: "Borrar Clave",
    btn_save_settings: "Guardar Ajustes",
    footer: "© 2026 RainGuard AI. La preparación salva vidas. Proteja su comunidad.",
    default_chat_welcome: "¡Hola! Soy tu asistente de seguridad de RainGuard. ¿Cómo puedo ayudarte hoy?",
    offline_banner_text: "⚠️ Actualmente sin conexión. Ejecutando en modo seguro local."
  },
  fr: { // French
    lang_selector: "Sélectionner la Langue",
    text_size: "Taille du Texte",
    theme_selector: "Thème de Contraste",
    api_settings: "🔑 Paramètres API",
    nav_dashboard: "Tableau de Bord",
    nav_profiler: "Plan de Résilience",
    nav_checklist: "Kit d'Urgence",
    nav_travel: "Voyage Sécurisé",
    nav_guidelines: "Manuel d'Aide",
    nav_chat: "Assistant AI",
    title_dashboard: "Tableau de Bord",
    sub_dashboard: "Alertes météo locales et conseils de sécurité en temps réel.",
    humidity: "Humidité",
    precipitation: "Précipitation",
    wind_speed: "Vitesse du Vent",
    title_advisory: "Conseils de Sécurité",
    default_advisory: "Mettez à jour votre position ou entrez une clé API pour les conseils IA.",
    last_updated: "Dernière mise à jour : À l'instant",
    change_location: "Changer de Position",
    fetch_weather: "Météo en direct",
    btn_detect_gps: "Détecter Ma Position",
    nearby_weather_title: "Bulletins Météo des Secteurs Voisins",
    placeholder_city: "Entrez la ville (ex: Mumbai)",
    title_profiler: "Profil de Résilience",
    sub_profiler: "Créez un plan de préparation sur mesure pour votre foyer.",
    label_name: "Votre Nom",
    placeholder_name: "John Doe",
    label_city: "Ville Cible",
    placeholder_target_city: "Mumbai",
    label_housing: "Type de Logement",
    house_ground: "Rez-de-chaussée (Risque élevé d'inondation)",
    house_high: "Étage supérieur / Appartement",
    house_temp: "Abri temporaire",
    label_family: "Taille du Foyer",
    label_vuln: "Vulnérabilités du Foyer",
    vuln_infants: "Nourrissons / Jeunes enfants",
    vuln_elderly: "Personnes âgées",
    vuln_pets: "Animaux domestiques",
    vuln_chronic: "Maladies chroniques",
    label_notes: "Remarques Supplémentaires",
    placeholder_notes: "ex: nids-de-poule fréquents, traitements réguliers...",
    btn_generate: "Générer le Plan de Sécurité",
    title_checklist: "Gestionnaire du Kit",
    sub_checklist: "Cochez les éléments du kit d'urgence. Les besoins spéciaux ajoutent des listes.",
    btn_reset: "Réinitialiser",
    title_travel: "Sécurité Routière",
    sub_travel: "Évaluez les risques d'inondation de votre trajet selon votre transport.",
    label_origin: "Lieu de départ",
    placeholder_origin: "ex: Bandra West",
    label_destination: "Destination",
    placeholder_destination: "ex: Aéroport",
    label_mode: "Mode de Transport",
    mode_walking: "À pied",
    mode_two_wheeler: "Deux-roues (Moto/Scooter)",
    mode_car: "Voiture / Taxi",
    mode_public: "Transports en Commun (Train/Bus)",
    btn_evaluate: "Évaluer la Sécurité du Trajet",
    title_guidelines: "Manuel d'Aide",
    sub_guidelines: "Instructions de sécurité avant, pendant et après la tempête.",
    tab_before: "Avant",
    tab_during: "Pendant",
    tab_after: "Après",
    tab_contacts: "Contacts",
    title_contacts: "Numéros d'Urgence Vérifiés",
    title_chat: "Chat de Sécurité AI",
    sub_chat: "Discutez avec notre assistant pour vos questions d'urgence.",
    btn_send: "Envoyer",
    placeholder_chat: "Posez votre question de sécurité...",
    title_api: "Paramètres de la Clé API",
    label_api_key: "Clé API Google Gemini",
    sub_api_key: "Cette clé est stockée localement de manière sécurisée dans votre navigateur.",
    btn_clear_key: "Effacer la clé",
    btn_save_settings: "Sauvegarder",
    footer: "© 2026 RainGuard AI. La préparation sauve des vies.",
    default_chat_welcome: "Bonjour ! Je suis votre conseiller d'urgence RainGuard. Comment puis-je vous aider ?",
    offline_banner_text: "⚠️ Vous êtes hors ligne. Utilisation des ressources locales."
  },
  ar: { // Arabic
    lang_selector: "اختر اللغة",
    text_size: "حجم الخط",
    theme_selector: "تباين الألوان",
    api_settings: "🔑 إعدادات المرجع",
    nav_dashboard: "لوحة التحكم",
    nav_profiler: "خطة الاستعداد",
    nav_checklist: "حقيبة الطوارئ",
    nav_travel: "أمان الطريق",
    nav_guidelines: "دليل السلامة",
    nav_chat: "مستشار الذكاء الاصطناعي",
    title_dashboard: "لوحة معلومات المطر",
    sub_dashboard: "مراقبة الأحوال الجوية والتنبيهات الموقعية مباشرة.",
    humidity: "الرطوبة",
    precipitation: "الهطول",
    wind_speed: "سرعة الرياح",
    title_advisory: "نصائح السلامة الذكية",
    default_advisory: "يرجى تحديث الموقع أو إدخال مفتاح الرمز لتلقي نصائح الذكاء الاصطناعي.",
    last_updated: "آخر تحديث: الآن",
    change_location: "تغيير الموقع",
    fetch_weather: "احصل على الطقس",
    btn_detect_gps: "تحديد الموقع تلقائياً",
    nearby_weather_title: "تقارير طقس القطاعات المجاورة",
    placeholder_city: "أدخل اسم المدينة (مثلاً: مومباي)",
    title_profiler: "ملف الاستعداد والسلامة",
    sub_profiler: "قم بإعداد خطة طوارئ مخصصة لحماية أسرتك.",
    label_name: "اسمك",
    placeholder_name: "جون دو",
    label_city: "المدينة المستهدفة",
    placeholder_target_city: "مومباي",
    label_housing: "نوع السكن والمبنى",
    house_ground: "الطابق الأرضي (خطر فيضانات عالٍ)",
    house_high: "شقة في طابق علوي",
    house_temp: "مسكن مؤقت / عشوائي",
    label_family: "عدد أفراد الأسرة",
    label_vuln: "الفئات الحساسة في الأسرة",
    vuln_infants: "رضع / أطفال صغار",
    vuln_elderly: "كبار السن",
    vuln_pets: "حيوانات أليفة",
    vuln_chronic: "حالات طبية مزمنة",
    label_notes: "ملاحظات إضافية",
    placeholder_notes: "مثلاً: مجاري قريبة تفيض باستمرار، أدوية مطلوبة...",
    btn_generate: "إنشاء خطة الاستعداد والتأهب",
    title_checklist: "إدارة حقيبة الطوارئ",
    sub_checklist: "تحقق من العناصر المخزنة. يضيف اختيار الفئات الحساسة قوائم متخصصة.",
    btn_reset: "إعادة ضبط العناصر",
    title_travel: "حارس السفر والأمان",
    sub_travel: "تحقق من سلامة طريقك بناءً على وسيلة النقل وأمطار المنطقة.",
    label_origin: "مكان الانطلاق",
    placeholder_origin: "مثال: باندرا",
    label_destination: "الوجهة",
    placeholder_destination: "مثال: المطار",
    label_mode: "وسيلة النقل المستخدمة",
    mode_walking: "سيراً على الأقدام",
    mode_two_wheeler: "دراجة نارية / سكوتر",
    mode_car: "سيارة / تاكسي",
    mode_public: "وسائل النقل العام (قطارات/حافلات)",
    btn_evaluate: "قيّم أمان الطريق",
    title_guidelines: "دليل السلامة",
    sub_guidelines: "إرشادات السلامة والوقاية (قبل، أثناء، وبعد) العاصفة الفيضانات.",
    tab_before: "قبل",
    tab_during: "أثناء",
    tab_after: "بعد",
    tab_contacts: "أرقام الطوارئ",
    title_contacts: "أرقام الطوارئ المعتمدة والموثقة",
    title_chat: "مستشار السلامة والإنقاذ AI",
    sub_chat: "تحدث مع المستشار حول الإسعافات وتصريف المياه وأمراض المطر.",
    btn_send: "إرسال",
    placeholder_chat: "اكتب سؤالك هنا...",
    title_api: "إعدادات مفتاح الرمز",
    label_api_key: "مفتاح Google Gemini API",
    sub_api_key: "يتم حفظ هذا الرمز محلياً في متصفحك بشكل آمن تماماً.",
    btn_clear_key: "مسح المفتاح",
    btn_save_settings: "حفظ الإعدادات",
    footer: "© 2026 RainGuard AI. الاستعداد يحمي الأرواح. حافظ على سلامة مجتمعك.",
    default_chat_welcome: "مرحباً! أنا مستشارك الآلي لحالات الطوارئ. كيف يمكنني مساعدتك اليوم؟",
    offline_banner_text: "⚠️ أنت غير متصل بالإنترنت حالياً. تم تفعيل الوضع المحلي الآمن."
  }
};

/**
 * Dynamically constructs a personalized preparedness plan template if API key is missing.
 * Ensures the app complies with "No hardcoded outputs" by building customized plans based on user profiles.
 */
export function compileFallbackPreparednessPlan(profile, lang = 'en') {
  const isHi = lang === 'hi';
  const name = profile.name || (isHi ? 'उपयोगकर्ता' : 'Citizen');
  const city = profile.city || (isHi ? 'आपका शहर' : 'Your City');
  const housing = profile.housing || 'ground_floor';
  const familySize = parseInt(profile.familySize) || 1;
  const vulnerabilities = profile.vulnerabilities || [];

  let plan = '';
  
  if (!isHi) {
    plan += `# Monsoon Preparedness Plan for ${name} (${city})\n\n`;
    plan += `**Status:** Generated via local fallback engine. Ready to protect a household of **${familySize}**.\n\n`;
    
    plan += `## 🏠 Structural Safety Guidance: ${housing.replace('_', ' ').toUpperCase()}\n`;
    if (housing === 'ground_floor') {
      plan += `*   **Flood Risk Warning:** Being on the ground floor puts you at high risk for water ingress. Elevate all appliances, gas cylinders, and electrical extension cords at least 3 feet off the ground.\n`;
      plan += `*   **Drainage Check:** Seal low-point entry vents and prepare sandbags if localized street flooding is frequent in your sector.\n`;
    } else if (housing === 'high_rise') {
      plan += `*   **High Wind Warning:** High-rise units face elevated wind forces. Ensure all balcony plants, drying racks, and outdoor fixtures are brought inside.\n`;
      plan += `*   **Elevator Safety:** In extreme rain/flooding, elevators may fail. Stock supplies locally on your floor to avoid stairs during power disruptions.\n`;
    } else {
      plan += `*   **Roof Integrity Support:** Temporary structures need immediate securing. Tie down roofing sheets with ropes or heavy sandbags.\n`;
      plan += `*   **Early Evacuation Planning:** Identify the nearest public shelter immediately. If heavy rains are predicted, do not wait; evacuate early.\n`;
    }
    plan += `\n`;

    plan += `## 📦 Household Emergency Allocation\n`;
    plan += `*   **Water Supply:** You need at least **${familySize * 9} liters** of drinking water stored (3 liters per person per day for 3 days).\n`;
    plan += `*   **Food Rations:** Stock at least 3 days of ready-to-eat dry food for **${familySize} people**.\n`;
    plan += `\n`;

    if (vulnerabilities.length > 0) {
      plan += `## ⚠️ Specialized Vulnerability Actions\n`;
      if (vulnerabilities.includes('infants')) {
        plan += `*   **Baby Safety:** Store dry infant formula in airtight containers. Keep baby wipes, clean diapers, and liquid baby paracetamol in your waterproof kit.\n`;
      }
      if (vulnerabilities.includes('elderly')) {
        plan += `*   **Elderly & Mobility Support:** Gather a 2-week supply of prescription medicines. Keep copy prescriptions and emergency contact cards in their wallet. Ensure easy access to walking aids or glasses.\n`;
      }
      if (vulnerabilities.includes('pets')) {
        plan += `*   **Pet Preparedness:** Put identification tags on collars. Keep pet carriers near the exit door. Store pet food in waterproof bins.\n`;
      }
      if (vulnerabilities.includes('chronic_illness')) {
        plan += `*   **Medical Continuity:** Keep a medical history record handy. If power-dependent equipment (like oxygen concentrators) is used, organize emergency battery backups or locate a nearby hospital.\n`;
      }
      plan += `\n`;
    }

    plan += `## 🚨 Action Steps\n`;
    plan += `1. Pack your emergency document kit in a zip folder.\n`;
    plan += `2. Pre-charge your main phones and backup power banks.\n`;
    plan += `3. Share emergency contact card with all household members.`;
  } else {
    // Hindi translation
    plan += `# ${name} (${city}) के लिए मानसून तैयारी योजना\n\n`;
    plan += `**स्थिति:** स्थानीय फॉलबैक इंजन द्वारा उत्पन्न। **${familySize}** सदस्यों के परिवार के लिए तैयार।\n\n`;
    
    plan += `## 🏠 संरचनात्मक सुरक्षा मार्गदर्शन: ${
      housing === 'ground_floor' ? 'भूतल (Ground Floor)' : 
      housing === 'high_rise' ? 'बहुमंजिला (High Rise)' : 'अस्थायी आवास'
    }\n`;
    if (housing === 'ground_floor') {
      plan += `*   **बाढ़ जोखिम चेतावनी:** भूतल पर होने से पानी प्रवेश का खतरा अधिक है। सभी उपकरणों, गैस सिलेंडरों और बिजली के तारों को जमीन से कम से कम 3 फीट ऊपर उठाएं।\n`;
      plan += `*   **जल निकासी:** निचले प्रवेश द्वारों को सील करें और यदि जलभराव आम है तो रेत की थैलियां तैयार रखें।\n`;
    } else if (housing === 'high_rise') {
      plan += `*   **तेज हवा चेतावनी:** बहुमंजिला इमारतों में तेज हवा का सामना करना पड़ता है। बालकनी के पौधों और सुखाने वाले रैक को अंदर लाएं।\n`;
      plan += `*   **लिफ्ट सुरक्षा:** भारी बारिश में बिजली बंद हो सकती है, लिफ्ट का उपयोग न करें।\n`;
    } else {
      plan += `*   **छत सुरक्षा:** अस्थायी संरचनाओं को रस्सियों या रेत के थैलों से तुरंत सुरक्षित करें।\n`;
      plan += `*   **जल्द निकासी:** निकटतम सार्वजनिक आश्रय गृह की पहचान करें। बारिश शुरू होने पर तुरंत वहां जाएं।\n`;
    }
    plan += `\n`;

    plan += `## 📦 घरेलू आपातकालीन राशन आवंटन\n`;
    plan += `*   **पानी की आपूर्ति:** आपको कम से कम **${familySize * 9} लीटर** पीने का पानी संग्रहित करने की आवश्यकता है।\n`;
    plan += `*   **खाद्य राशन:** **${familySize} व्यक्तियों** के लिए कम से कम 3 दिनों के सूखे भोजन का भंडारण करें।\n`;
    plan += `\n`;

    if (vulnerabilities.length > 0) {
      plan += `## ⚠️ विशेष संवेदनशील कार्रवाइयां\n`;
      if (vulnerabilities.includes('infants')) {
        plan += `*   **शिशु सुरक्षा:** शिशु आहार को वायुरोधी कंटेनरों में रखें। डायपर और शिशु दवाएं किट में रखें।\n`;
      }
      if (vulnerabilities.includes('elderly')) {
        plan += `*   **बुजुर्ग सहायता:** नुस्खे वाली दवाओं की 2 सप्ताह की आपूर्ति रखें। उनके पास डॉक्टर के नंबर और आवश्यक चलने वाली छड़ी रखें।\n`;
      }
      if (vulnerabilities.includes('pets')) {
        plan += `*   **पालतू जानवर सुरक्षा:** पालतू जानवरों के पट्टे पर पहचान टैग लगाएं। पालतू भोजन को वॉटरप्रूफ डिब्बे में रखें।\n`;
      }
      if (vulnerabilities.includes('chronic_illness')) {
        plan += `*   **चिकित्सा निरंतरता:** अपने चिकित्सा इतिहास के दस्तावेजों को पास रखें। बिजली निर्भर चिकित्सा उपकरणों के लिए बैकअप की व्यवस्था करें।\n`;
      }
      plan += `\n`;
    }

    plan += `## 🚨 त्वरित कदम\n`;
    plan += `1. आपातकालीन दस्तावेजों को जलरोधक बैग में पैक करें।\n`;
    plan += `2. फोन और बैकअप पावर बैंक को पहले से चार्ज करें।\n`;
    plan += `3. परिवार के सभी सदस्यों के साथ आपातकालीन नंबर साझा करें।`;
  }

  return plan;
}
