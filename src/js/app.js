/**
 * Main Application Orchestrator - RainGuard AI
 */

import { Storage } from './storage.js';
import { Weather } from './weather.js';
import { Gemini } from './gemini.js';
import { 
  EMERGENCY_CONTACTS, 
  STATIC_CHECKLISTS, 
  DISASTER_GUIDELINES, 
  compileFallbackPreparednessPlan,
  TRANSLATIONS
} from './static-data.js';

// Application State
const State = {
  lang: 'en',
  activeView: 'view-dashboard',
  currentWeather: null,
  chatHistory: []
};

// Markdown Parser Helper
function parseMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // Bullet Points
  // We match lines starting with * or - and wrap them in ul list blocks
  const lines = html.split('\n');
  let inList = false;
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const itemText = trimmed.substring(2);
      let output = '';
      if (!inList) {
        inList = true;
        output += '<ul>';
      }
      output += `<li>${itemText}</li>`;
      return output;
    } else {
      let output = '';
      if (inList) {
        inList = false;
        output += '</ul>';
      }
      if (trimmed === '') {
        output += '<br/>';
      } else {
        output += `<p>${trimmed}</p>`;
      }
      return output;
    }
  });
  
  if (inList) {
    processedLines.push('</ul>');
  }
  
  return processedLines.join('\n');
}

// Optional browser key fallback retained for local demos without a server env key.
function hasRealApiKey() {
  try {
    const saved = localStorage.getItem('rainguard_gemini_api_key');
    return saved !== null && saved.trim() !== '';
  } catch (e) {
    return false;
  }
}

// Request permission for Web Notifications API
function requestNotificationPermission() {
  if ('Notification' in window) {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission status:', permission);
      });
    }
  }
}

// Show a system notification (desktop and mobile)
function sendSystemNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body: body,
        icon: '/favicon.ico'
      });
    } catch (e) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, {
            body: body,
            icon: '/favicon.ico'
          });
        }).catch(err => {
          console.warn('Service worker notification failed', err);
        });
      }
    }
  }
}

// Get city-specific emergency contacts
function getCityContacts(cityName, lang) {
  if (!cityName) return [];
  const baseCity = cityName.split(',')[0].replace(/(NE|SW|SE|NW|North|South|East|West)?\s*Sector/gi, '').trim();
  const isHi = lang === 'hi';
  
  const knownCities = {
    mumbai: [
      {
        name: isHi ? 'मुंबई नगर निगम (BMC) हेल्पलाइन' : 'Mumbai Municipality (BMC) Control Room',
        phone: '1916',
        description: isHi ? 'जलभराव और जल निकासी सहायता' : 'Waterlogging, tree falls, and civic complaints'
      },
      {
        name: isHi ? 'मुंबई आपदा प्रबंधन नियंत्रण कक्ष' : 'Mumbai Disaster Management Cell',
        phone: '022-22694725',
        description: isHi ? 'सक्रिय आपातकालीन बचाव और जल स्तर अपडेट' : 'Active emergency rescue and water levels updates'
      },
      {
        name: isHi ? 'मुंबई यातायात पुलिस' : 'Mumbai Traffic Police Helpline',
        phone: '022-24937747',
        description: isHi ? 'मार्ग की स्थिति और यातायात सलाह' : 'Route blockages and traffic diversions'
      }
    ],
    pune: [
      {
        name: isHi ? 'पुणे नगर निगम (PMC) नियंत्रण कक्ष' : 'Pune Municipal Corporation (PMC) Control Room',
        phone: '020-25501000',
        description: isHi ? 'नागरिक शिकायतें और जल निकासी सहायता' : 'Civic complaints and local flooding assistance'
      },
      {
        name: isHi ? 'पुणे आपदा नियंत्रण' : 'Pune Disaster Control Cell',
        phone: '020-25506800',
        description: isHi ? 'आपातकालीन जलभराव बचाव' : 'Emergency waterlogging and rescue services'
      }
    ],
    bengaluru: [
      {
        name: isHi ? 'बेंगलुरु महानगर पालिका (BBMP) हेल्पलाइन' : 'Bengaluru Municipality (BBMP) Control Room',
        phone: '080-22221188',
        description: isHi ? 'पेड़ गिरने, जलभराव और नागरिक शिकायतें' : 'Tree falls, waterlogging, and civic complaints'
      },
      {
        name: isHi ? 'बेंगलुरु आपदा नियंत्रण कक्ष' : 'Bengaluru Disaster Management Cell',
        phone: '080-22374740',
        description: isHi ? 'बाढ़ प्रतिक्रिया और बचाव' : 'Flood response and active rescue operations'
      }
    ],
    delhi: [
      {
        name: isHi ? 'दिल्ली नगर निगम (MCD) नियंत्रण कक्ष' : 'Delhi Municipality (MCD) Control Room',
        phone: '011-23348300',
        description: isHi ? 'जल निकासी और बाढ़ शिकायतें' : 'Waterlogging and drainage complaints'
      },
      {
        name: isHi ? 'दिल्ली आपदा प्रबंधन प्राधिकरण' : 'Delhi Disaster Management Cell',
        phone: '011-23438012',
        description: isHi ? 'बाढ़ बचाव और आपातकालीन चेतावनी' : 'Flood rescue and emergency warnings'
      }
    ]
  };

  const key = baseCity.toLowerCase();
  if (knownCities[key]) {
    return knownCities[key];
  }

  // Generative fallback for any other city
  return [
    {
      name: isHi ? `${baseCity} नगर निगम (नियंत्रण कक्ष)` : `${baseCity} Municipality Control Room`,
      phone: '1800-425-0011',
      description: isHi ? `स्थानीय जलभराव और नागरिक शिकायतें (${baseCity})` : `Local waterlogging and civic issues in ${baseCity}`
    },
    {
      name: isHi ? `${baseCity} आपदा प्रबंधन सेल` : `${baseCity} Disaster Management Cell`,
      phone: '1077',
      description: isHi ? `स्थानीय बाढ़ आपात स्थिति और आश्रय जानकारी` : `Local flood emergencies and shelter information`
    }
  ];
}

// Display local weather news in slides (carousel)
function updateWeatherNews(data) {
  const container = document.getElementById('news-slides-container');
  const indicators = document.getElementById('news-slides-indicators');
  if (!container) return;
  
  const baseCity = data.cityName.split(',')[0];
  const isHi = State.lang === 'hi';
  
  const newsItems = [];
  
  if (data.precipitation > 15) {
    newsItems.push({
      title: isHi ? `⚠️ ${baseCity} में भारी वर्षा और जलभराव` : `⚠️ Heavy Rainfall & Waterlogging in ${baseCity}`,
      desc: isHi 
        ? `पिछले 24 घंटों में ${data.precipitation} मिमी बारिश दर्ज की गई है। निचले इलाकों में जलभराव के कारण यातायात प्रभावित हुआ है।`
        : `Precipitation of ${data.precipitation}mm has been recorded. Traffic is slowed due to waterlogged roads in low-lying sectors.`
    });
  } else {
    newsItems.push({
      title: isHi ? `🌧️ ${baseCity} मौसम बुलेटिन` : `🌧️ ${baseCity} Monsoon Weather Update`,
      desc: isHi
        ? `क्षेत्र में हल्की से मध्यम बारिश की स्थिति बनी हुई है। नागरिक आपातकालीन किट तैयार रखें।`
        : `Light to moderate rain conditions continue across the region. Civic bodies advise keeping emergency kits updated.`
    });
  }
  
  if (data.windSpeed > 30) {
    newsItems.push({
      title: isHi ? `💨 तेज हवा की चेतावनी: ${baseCity}` : `💨 High Wind Advisory: ${baseCity}`,
      desc: isHi
        ? `हवा की गति ${data.windSpeed} किमी/घंटा तक पहुंच गई है। कमजोर पेड़ की शाखाओं और होर्डिंग्स से दूर रहें।`
        : `Wind speeds have reached ${data.windSpeed} km/h. Residents are advised to stay clear of tall trees and temporary hoardings.`
    });
  }
  
  const meta = Weather.getWeatherMeta(data.weatherCode, State.lang);
  if (meta.alert === 'alert') {
    newsItems.push({
      title: isHi ? `🚨 रेड अलर्ट: सुरक्षा सलाह` : `🚨 Red Alert Safety Notice`,
      desc: isHi
        ? `स्थानीय प्रशासन ने गंभीर मौसम (${meta.text}) के कारण रेड अलर्ट जारी किया है। जब तक आवश्यक न हो, घरों के अंदर रहें।`
        : `Local administration has issued a Red Alert due to severe weather (${meta.text}). Avoid all non-essential commutes.`
    });
  }
  
  newsItems.push({
    title: isHi ? `📞 ${baseCity} स्थानीय हेल्पलाइन सक्रिय` : `📞 ${baseCity} Civic Helpline Activated`,
    desc: isHi
      ? `${baseCity} नगर निगम ने मानसून संबंधी शिकायतों के लिए 24 घंटे चलने वाला आपदा नियंत्रण कक्ष चालू किया है।`
      : `${baseCity} Municipal Corporation has activated a 24/7 emergency control cell for flooding and infrastructure complaints.`
  });
  
  newsItems.push({
    title: isHi ? `🏥 स्वास्थ्य विभाग की चेतावनी` : `🏥 Health Department Advisory`,
    desc: isHi
      ? `मौसम के बदलाव के दौरान डेंगू और मलेरिया के मामलों से बचने के लिए अपने आसपास पानी जमा न होने दें।`
      : `Health authorities urge residents to clear stagnant water around their houses to prevent mosquito breeding.`
  });

  container.innerHTML = '';
  indicators.innerHTML = '';
  
  let currentIndex = 0;
  
  newsItems.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = 'news-slide';
    slide.style.display = index === 0 ? 'block' : 'none';
    slide.style.animation = 'fadeIn 0.5s ease';
    
    slide.innerHTML = `
      <h4 style="font-size: var(--font-size-md); font-weight: 600; color: var(--accent); margin-bottom: 0.5rem;">${item.title}</h4>
      <p style="font-size: var(--font-size-sm); color: var(--text-primary); line-height: 1.5; margin-bottom: 0;">${item.desc}</p>
    `;
    container.appendChild(slide);
    
    const dot = document.createElement('span');
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.borderRadius = '50%';
    dot.style.backgroundColor = index === 0 ? 'var(--accent)' : 'var(--border-color)';
    dot.style.cursor = 'pointer';
    dot.addEventListener('click', () => showSlide(index));
    indicators.appendChild(dot);
  });
  
  function showSlide(index) {
    const slides = container.querySelectorAll('.news-slide');
    const dots = indicators.querySelectorAll('span');
    if (slides.length === 0) return;
    
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    
    currentIndex = index;
    
    slides.forEach((slide, idx) => {
      slide.style.display = idx === currentIndex ? 'block' : 'none';
    });
    
    dots.forEach((dot, idx) => {
      dot.style.backgroundColor = idx === currentIndex ? 'var(--accent)' : 'var(--border-color)';
    });
  }
  
  const btnPrev = document.getElementById('btn-news-prev');
  const btnNext = document.getElementById('btn-news-next');
  
  if (btnPrev && btnNext) {
    const newBtnPrev = btnPrev.cloneNode(true);
    const newBtnNext = btnNext.cloneNode(true);
    btnPrev.parentNode.replaceChild(newBtnPrev, btnPrev);
    btnNext.parentNode.replaceChild(newBtnNext, btnNext);
    
    newBtnPrev.addEventListener('click', () => showSlide(currentIndex - 1));
    newBtnNext.addEventListener('click', () => showSlide(currentIndex + 1));
  }
  
  if (window.newsInterval) clearInterval(window.newsInterval);
  window.newsInterval = setInterval(() => {
    showSlide(currentIndex + 1);
  }, 5000);
}

// 1. Navigation Controller
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.view-section');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('data-target');
      
      navLinks.forEach(l => {
        l.classList.remove('active');
        l.removeAttribute('aria-current');
      });
      sections.forEach(s => s.classList.remove('active'));
      
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      
      const targetSection = document.getElementById(targetId);
      targetSection.classList.add('active');
      State.activeView = targetId;
      
      // Accessibility: move focus to active main heading
      const heading = targetSection.querySelector('h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    });
  });
}

// 2. Settings Controller (Language, Size, Theme, API)
function initSettings() {
  const langSelect = document.getElementById('lang-select');
  const sizeSelect = document.getElementById('size-select');
  const themeSelect = document.getElementById('theme-select');
  
  const apiModal = document.getElementById('modal-api-settings');
  const btnApiModal = document.getElementById('btn-api-modal');
  const btnModalClose = document.getElementById('btn-modal-close');
  const formApiSettings = document.getElementById('form-api-settings');
  const btnApiClear = document.getElementById('btn-api-clear');
  const inputApiKey = document.getElementById('input-api-key');

  // Load Saved Settings
  const savedTheme = Storage.getTheme() || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeSelect.value = savedTheme;

  // Language Change handler
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      State.lang = e.target.value;
      updateLanguageTexts();
      renderGuidelines();
      renderEmergencyContacts();
      renderChecklist();
      if (State.currentWeather) {
        updateWeatherCard(State.currentWeather);
      }
    });
  }

  // Font Size change handler
  if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-size', e.target.value);
    });
  }

  // Theme change handler
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const selectedTheme = e.target.value;
      document.documentElement.setAttribute('data-theme', selectedTheme);
      Storage.setTheme(selectedTheme);
    });
  }

  if (btnApiModal && apiModal && formApiSettings) {
    const savedApiKey = localStorage.getItem('rainguard_gemini_api_key');
    if (savedApiKey && inputApiKey) {
      inputApiKey.value = savedApiKey;
    }

    // Modal Open
    btnApiModal.addEventListener('click', () => {
      apiModal.classList.add('active');
      if (inputApiKey) inputApiKey.focus();
    });

    // Modal Close
    const closeModal = () => {
      apiModal.classList.remove('active');
      btnApiModal.focus();
    };
    
    if (btnModalClose) btnModalClose.addEventListener('click', closeModal);
    
    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && apiModal.classList.contains('active')) {
        closeModal();
      }
    });

    // API Form Submit
    formApiSettings.addEventListener('submit', (e) => {
      e.preventDefault();
      if (inputApiKey) Storage.setApiKey(inputApiKey.value);
      closeModal();
      // Trigger advisory update on dashboard
      if (State.currentWeather) {
        triggerAiAdvisory(State.currentWeather);
      }
    });

    // API Clear
    if (btnApiClear) {
      btnApiClear.addEventListener('click', () => {
        if (inputApiKey) inputApiKey.value = '';
        Storage.setApiKey(null);
        closeModal();
        if (State.currentWeather) {
          triggerAiAdvisory(State.currentWeather);
        }
      });
    }
  }
}

// 3. Language Translation Engine
function updateLanguageTexts() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = TRANSLATIONS[State.lang]?.[key] || TRANSLATIONS['en']?.[key];
    if (translation) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else {
        el.innerText = translation;
      }
    }
  });
}

// 4. Weather Dashboard controller
async function initWeather(defaultCity = 'Mumbai') {
  const formLocation = document.getElementById('form-location');
  const inputCity = document.getElementById('input-city');
  const btnDetectGps = document.getElementById('btn-detect-gps');
  
  formLocation.addEventListener('submit', async (e) => {
    e.preventDefault();
    requestNotificationPermission();
    const city = inputCity.value.trim();
    if (city) {
      await loadWeatherForCity(city);
    }
  });

  if (btnDetectGps) {
    btnDetectGps.addEventListener('click', async () => {
      const origText = btnDetectGps.innerHTML;
      btnDetectGps.disabled = true;
      btnDetectGps.innerHTML = State.lang === 'en' ? '📍 Locating...' : '📍 स्थान खोज रहे हैं...';
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const displayDesc = document.getElementById('display-desc');
            displayDesc.innerText = State.lang === 'en' ? 'Fetching GPS weather data...' : 'जीपीएस मौसम डेटा प्राप्त कर रहे हैं...';
            
            const weatherData = await Weather.getWeatherForCoordinates(lat, lon);
            State.currentWeather = weatherData;
            updateWeatherCard(weatherData);
            triggerAiAdvisory(weatherData);
            await loadNearbyWeather(lat, lon, weatherData.cityName);
            
            // Set search input to the detected city name
            inputCity.value = weatherData.cityName.split(',')[0];
          } catch (err) {
            console.error('GPS Weather load failed', err);
            alert(State.lang === 'en' ? `GPS load error: ${err.message}` : `त्रुटि: ${err.message}`);
          } finally {
            btnDetectGps.disabled = false;
            btnDetectGps.innerHTML = origText;
          }
        },
        (error) => {
          console.warn('Geolocation failed', error);
          let errMsg = 'Location permission denied or unavailable.';
          if (State.lang === 'hi') errMsg = 'स्थान अनुमति अस्वीकार कर दी गई या अनुपलब्ध है।';
          alert(errMsg);
          btnDetectGps.disabled = false;
          btnDetectGps.innerHTML = origText;
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    });
  }

  // Load Initial City
  await loadWeatherForCity(defaultCity);
}

async function loadWeatherForCity(city) {
  const displayDesc = document.getElementById('display-desc');
  displayDesc.innerText = State.lang === 'en' ? 'Updating weather forecasts...' : 'मौसम की जानकारी ला रहे हैं...';
  
  try {
    const weatherData = await Weather.getWeatherForCity(city);
    State.currentWeather = weatherData;
    updateWeatherCard(weatherData);
    triggerAiAdvisory(weatherData);
    await loadNearbyWeather(weatherData.lat, weatherData.lon, weatherData.cityName);
  } catch (err) {
    console.error('Failed to load weather', err);
    displayDesc.innerText = State.lang === 'en' ? `Error: ${err.message}` : `त्रुटि: ${err.message}`;
  }
}

async function loadWeatherForCoordinates(lat, lon, cityName) {
  const displayDesc = document.getElementById('display-desc');
  displayDesc.innerText = State.lang === 'en' ? 'Updating weather forecasts...' : 'मौसम की जानकारी ला रहे हैं...';
  
  try {
    const weatherData = await Weather.getWeatherForCoordinates(lat, lon, cityName);
    State.currentWeather = weatherData;
    updateWeatherCard(weatherData);
    triggerAiAdvisory(weatherData);
    await loadNearbyWeather(weatherData.lat, weatherData.lon, weatherData.cityName);
  } catch (err) {
    console.error('Failed to load weather', err);
    displayDesc.innerText = State.lang === 'en' ? `Error: ${err.message}` : `त्रुटि: ${err.message}`;
  }
}

async function loadNearbyWeather(lat, lon, cityName) {
  const container = document.getElementById('nearby-weather-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="card skeleton-pulse" style="height: 140px;"></div>
    <div class="card skeleton-pulse" style="height: 140px;"></div>
  `;
  
  try {
    const reports = await Weather.getNearbyWeather(lat, lon, cityName);
    container.innerHTML = '';
    
    if (reports.length === 0) {
      container.innerHTML = `<p style="grid-column: span 2; text-align: center; color: var(--text-secondary);">No nearby weather data available.</p>`;
      return;
    }
    
    reports.forEach(data => {
      const meta = Weather.getWeatherMeta(data.weatherCode, State.lang);
      const card = document.createElement('div');
      card.className = 'card';
      card.style.padding = '1.25rem';
      
      const badgeText = {
        safe: { en: 'Low Risk', hi: 'कम जोखिम', bn: 'কম ঝুঁকি', te: 'తక్కువ ముప్పు', ta: 'குறைந்த வெள்ள அபாயம்', mr: 'कमी धोका', es: 'Bajo Riesgo', fr: 'Faible Risque', ar: 'خطر منخفض' },
        caution: { en: 'Caution', hi: 'सावधानी', bn: 'সতর্কতা', te: 'జాగ్రత్త', ta: 'எச்சரிக்கை', mr: 'सावधानता', es: 'Precaución', fr: 'Précaution', ar: 'حذر' },
        alert: { en: 'High Danger', hi: 'उच्च खतरा', bn: 'উচ্চ বিপদ', te: 'అధిక ముప్పు', ta: 'அதிவேக ஆபத்து', mr: 'उच्च धोका', es: 'Peligro', fr: 'Danger Élevé', ar: 'خطر مرتفع' }
      };
      const badgeLabel = (badgeText[meta.alert]?.[State.lang] || badgeText[meta.alert]?.['en'] || 'Caution').toUpperCase();

      const primaryTextMap = {
        en: 'Set as Primary',
        hi: 'प्राथमिक स्थान सेट करें',
        bn: 'প্রাথমিক স্থান সেট করুন',
        te: 'ప్రాథmica స్థానంగా సెట్ చేయి',
        ta: 'முதன்மை இடமாக அமை',
        mr: 'प्राथमिक म्हणून सेट करा',
        es: 'Definir como Principal',
        fr: 'Définir comme Principal',
        ar: 'تعيين كرئيسي'
      };
      const destinationTextMap = {
        en: 'Set as Destination',
        hi: 'यात्रा गंतव्य सेट करें',
        bn: 'গন্তব্য নির্ধারণ করুন',
        te: 'గమ్యస్థానంగా సెట్ చేయి',
        ta: 'பயண இலக்காக அமை',
        mr: 'गंतव्य म्हणून सेट करा',
        es: 'Definir como Destino',
        fr: 'Définir comme Destination',
        ar: 'تعيين كوجهة سفر'
      };
      const primaryText = primaryTextMap[State.lang] || primaryTextMap['en'];
      const destinationText = destinationTextMap[State.lang] || destinationTextMap['en'];

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <h4 style="font-size: var(--font-size-md); font-weight: 600;">${data.cityName}</h4>
          <span class="weather-status-badge status-${meta.alert}" style="font-size: 10px; padding: 0.2rem 0.6rem;">${badgeLabel}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <span style="font-size: var(--font-size-3xl);">${meta.icon}</span>
          <div>
            <strong style="font-size: var(--font-size-xl);">${data.temp}°C</strong>
            <span style="display: block; font-size: var(--font-size-sm); color: var(--text-secondary);">${meta.text}</span>
          </div>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 0.75rem; font-size: var(--font-size-xs); color: var(--text-secondary); border-top: 1px solid var(--border-color); padding-top: 0.5rem; margin-bottom: 0.75rem;">
          <span>💧 H: ${data.humidity}%</span>
          <span>🌧️ P: ${data.precipitation}mm</span>
          <span>💨 W: ${data.windSpeed}km/h</span>
        </div>
        <div style="display: flex; gap: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
          <button class="btn-nearby-primary" style="flex: 1;">
            📍 <span>${primaryText}</span>
          </button>
          <button class="btn-nearby-travel" style="flex: 1;">
            🚗 <span>${destinationText}</span>
          </button>
        </div>
      `;

      // Bind button events
      const btnPrimary = card.querySelector('.btn-nearby-primary');
      const btnTravel = card.querySelector('.btn-nearby-travel');

      btnPrimary.addEventListener('click', async () => {
        const inputCity = document.getElementById('input-city');
        if (inputCity) {
          inputCity.value = data.cityName;
        }
        const profileCity = document.getElementById('profile-city');
        if (profileCity) {
          profileCity.value = data.cityName;
        }

        // Cache the weather data so that any subsequent getWeatherForCity(data.cityName) call finds it immediately without geocoding
        const cacheKey = `rainguard_weather_cache_${data.cityName.toLowerCase().trim()}`;
        try {
          const cacheObj = {
            timestamp: Date.now(),
            data: data
          };
          sessionStorage.setItem(cacheKey, JSON.stringify(cacheObj));
        } catch (e) {
          console.warn('Failed to cache nearby sector weather data', e);
        }

        await loadWeatherForCoordinates(data.lat, data.lon, data.cityName);
      });

      btnTravel.addEventListener('click', () => {
        const travelDest = document.getElementById('travel-destination');
        if (travelDest) {
          travelDest.value = data.cityName;
        }

        // Auto-fill travel origin with current primary location if empty
        const travelOrigin = document.getElementById('travel-origin');
        if (travelOrigin && !travelOrigin.value.trim() && State.currentWeather) {
          travelOrigin.value = State.currentWeather.cityName.split(',')[0];
        }

        // Navigate to travel view
        const travelNavLink = document.querySelector('.nav-link[data-target="view-travel"]');
        if (travelNavLink) {
          travelNavLink.click();
        }
      });

      container.appendChild(card);
    });
  } catch (e) {
    console.error('Failed to populate nearby weather UI', e);
    container.innerHTML = `<p style="grid-column: span 2; text-align: center; color: var(--alert-danger);">Error fetching nearby stations weather.</p>`;
  }
}

function updateWeatherCard(data) {
  const displayCity = document.getElementById('display-city');
  const displayDate = document.getElementById('display-date');
  const displayTemp = document.getElementById('display-temp');
  const displayDesc = document.getElementById('display-desc');
  const displayHumidity = document.getElementById('display-humidity');
  const displayPrecip = document.getElementById('display-precip');
  const displayWind = document.getElementById('display-wind');
  
  const weatherBadge = document.getElementById('weather-badge');
  const weatherIcon = document.getElementById('weather-icon');
  
  displayCity.innerText = data.cityName;
  
  // Format current date
  const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  displayDate.innerText = new Date().toLocaleDateString(State.lang === 'en' ? 'en-US' : 'hi-IN', dateOptions);
  
  displayTemp.innerText = `${data.temp}°C`;
  displayHumidity.innerText = `${data.humidity}%`;
  displayPrecip.innerText = `${data.precipitation} mm`;
  displayWind.innerText = `${data.windSpeed} km/h`;
  
  // Code Meta mapping
  const meta = Weather.getWeatherMeta(data.weatherCode, State.lang);
  displayDesc.innerText = meta.text;
  weatherIcon.innerText = meta.icon;
  
  // Reset badge class
  weatherBadge.className = 'weather-status-badge';
  weatherBadge.classList.add(`status-${meta.alert}`);
  
  const badgeText = {
    safe: { en: 'Low Risk', hi: 'कम जोखिम', bn: 'কম ঝুঁকি', te: 'తక్కువ ముప్పు', ta: 'குறைந்த வெள்ள அபாயம்', mr: 'कमी धोका', es: 'Bajo Riesgo', fr: 'Faible Risque', ar: 'خطر منخفض' },
    caution: { en: 'Caution', hi: 'सावधानी', bn: 'সতর্কতা', te: 'జాగ్రत्त', ta: 'எச்சரிக்கை', mr: 'सावधानता', es: 'Precaución', fr: 'Précaution', ar: 'حذر' },
    alert: { en: 'High Danger', hi: 'उच्च खतरा', bn: 'উচ্চ বিপদ', te: 'అధిక ముప్పు', ta: 'అதிவேக ஆபத்து', mr: 'उच्च धोका', es: 'Peligro', fr: 'Danger Élevé', ar: 'خطر مرتفع' }
  };
  weatherBadge.querySelector('span').innerText = badgeText[meta.alert][State.lang] || badgeText[meta.alert]['en'];

  // Update Weather News carousel for the current location
  updateWeatherNews(data);

  // Update localized emergency contacts for Safety Hub
  renderEmergencyContacts();

  // Send realtime system notification (desktop/mobile) for alert-level hazards
  if (meta.alert === 'alert') {
    const title = State.lang === 'en' ? '🚨 Extreme Weather Alert!' : '🚨 गंभीर मौसम चेतावनी!';
    const body = State.lang === 'en' 
      ? `High danger in ${data.cityName.split(',')[0]}: ${meta.text}. Temp: ${data.temp}°C.` 
      : `${data.cityName.split(',')[0]} में गंभीर स्थिति: ${meta.text}। तापमान: ${data.temp}°C।`;
    sendSystemNotification(title, body);
  }
}

async function triggerAiAdvisory(weatherData) {
  const container = document.getElementById('ai-quick-guidance');
  const timestampEl = document.getElementById('quick-alert-timestamp');
  container.innerHTML = `<div class="skeleton-pulse skeleton-text"></div><div class="skeleton-pulse skeleton-text" style="width: 80%;"></div>`;
  
  try {
    const prompt = `Based on the location: ${weatherData.cityName}, temp: ${weatherData.temp}°C, precip: ${weatherData.precipitation}mm, wind: ${weatherData.windSpeed} km/h, and condition description: ${Weather.getWeatherMeta(weatherData.weatherCode, 'en').text}. Write a short 3-sentence advisory explaining immediate precautions users should take right now.`;
    
    const instruction = "You are a weather hazard warning system. Keep your output to exactly 3 lines of bullet points, highly actionable.";
    const response = await Gemini.generateContent(instruction, prompt, State.lang);
    container.innerHTML = parseMarkdown(response);
    
    const liveLabel = {
      en: 'Live GenAI Warning Advisory Active',
      hi: 'लाइव एआई चेतावनी सक्रिय',
      bn: 'লাইভ এআই অ্যাডভাইसरी সক্রিয়',
      es: 'Asesoramiento GenAI en Vivo Activo',
      fr: 'Alerte GenAI en Direct Active',
      ar: 'نصيحة الذكاء الاصطناعي الحيّة نشطة'
    };
    timestampEl.innerText = liveLabel[State.lang] || liveLabel['en'];
  } catch (err) {
    console.warn('Dashboard live advisory failed, utilizing local static advisory fallback.', err);
    
    const meta = Weather.getWeatherMeta(weatherData.weatherCode, State.lang);
    let advice = '';
    const name = weatherData.cityName;
    const cond = meta.text;
    
    if (State.lang === 'hi') {
      advice = meta.alert === 'safe'
        ? `वर्तमान में <strong>${name}</strong> में मौसम ठीक है। तैयारी योजना की समीक्षा करें।`
        : `⚠️ <strong>चेतावनी:</strong> ${name} में ${cond} दर्ज किया गया है। अनावश्यक यात्रा से बचें।`;
    } else if (State.lang === 'bn') {
      advice = meta.alert === 'safe'
        ? `বর্তমানে <strong>${name}</strong>-এ আবহাওয়া স্বাভাবিক রয়েছে।`
        : `⚠️ <strong>সতর্কতা:</strong> ${name}-এ ${cond} রয়েছে। ঘরের ভেতরে থাকুন।`;
    } else if (State.lang === 'es') {
      advice = meta.alert === 'safe'
        ? `El clima actual en <strong>${name}</strong> es relativamente seguro.`
        : `⚠️ <strong>ADVERTENCIA:</strong> Se detecta ${cond} en ${name}. Evite viajes innecesarios.`;
    } else if (State.lang === 'fr') {
      advice = meta.alert === 'safe'
        ? `Le temps actuel à <strong>${name}</strong> est calme.`
        : `⚠️ <strong>ALERTE:</strong> ${cond} détecté à ${name}. Évitez les déplacements.`;
    } else if (State.lang === 'ar') {
      advice = meta.alert === 'safe'
        ? `الطقس الحالي في <strong>${name}</strong> مستقر نسبياً.`
        : `⚠️ <strong>تحذير:</strong> تم رصد ${cond} في ${name}. تجنب الخروج إلا للضرورة.`;
    } else {
      advice = meta.alert === 'safe'
        ? `Current weather in <strong>${name}</strong> is relatively safe. Review your preparedness plan.`
        : `⚠️ <strong>WARNING:</strong> ${cond} detected in ${name}. Avoid all non-essential commutes.`;
    }
    
    container.innerHTML = advice;
    const advisoryLabel = {
      en: 'Generated via Fallback Advisory Logic',
      hi: 'फॉलबैक लॉजिक द्वारा उत्पन्न',
      bn: 'ফলব্যাক এডভাইसরি ইঞ্জিন',
      es: 'Asesoramiento de Reserva Local',
      fr: 'Conseils de Secours Locaux',
      ar: 'تم إنشاؤه عبر منطق الاحتياط الموقعي'
    };
    timestampEl.innerText = advisoryLabel[State.lang] || advisoryLabel['en'];
    return;
  }

  try {
    const prompt = `Based on the location: ${weatherData.cityName}, temp: ${weatherData.temp}°C, precip: ${weatherData.precipitation}mm, wind: ${weatherData.windSpeed} km/h, and condition description: ${Weather.getWeatherMeta(weatherData.weatherCode, 'en').text}. Write a short 3-sentence advisory explaining immediate precautions users should take right now.`;
    
    const instruction = "You are a weather hazard warning system. Keep your output to exactly 3 lines of bullet points, highly actionable.";
    const response = await Gemini.generateContent(instruction, prompt, State.lang);
    container.innerHTML = parseMarkdown(response);
    
    const liveLabel = {
      en: 'Live GenAI Warning Advisory Active',
      hi: 'लाइव एआई चेतावनी सक्रिय',
      bn: 'লাইভ এআই অ্যাডভাইসরি সক্রিয়',
      es: 'Asesoramiento GenAI en Vivo Activo',
      fr: 'Alerte GenAI en Direct Active',
      ar: 'نصيحة الذكاء الاصطناعي الحيّة نشطة'
    };
    timestampEl.innerText = liveLabel[State.lang] || liveLabel['en'];
  } catch (err) {
    console.error('Failed to get dashboard AI advisory', err);
    container.innerText = 'Failed to fetch AI recommendation. Check network connectivity or the server Gemini API key configuration.';
  }
}

// 5. Resilience Profiler / Personalized Plans
function initProfiler() {
  const formProfile = document.getElementById('form-profile');
  const planContainer = document.getElementById('plan-container');
  const planLoading = document.getElementById('plan-loading');
  const planOutput = document.getElementById('plan-markdown-output');
  
  // Pre-load profile if exists
  const savedProfile = Storage.getProfile();
  if (savedProfile) {
    document.getElementById('profile-name').value = savedProfile.name || '';
    document.getElementById('profile-city').value = savedProfile.city || '';
    document.getElementById('profile-housing').value = savedProfile.housing || 'ground_floor';
    document.getElementById('profile-family').value = savedProfile.familySize || '1';
    document.getElementById('profile-notes').value = savedProfile.notes || '';
    
    if (savedProfile.vulnerabilities) {
      document.querySelectorAll('input[name="vuln"]').forEach(cb => {
        cb.checked = savedProfile.vulnerabilities.includes(cb.value);
      });
    }
  }

  formProfile.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const vulnerabilities = Array.from(document.querySelectorAll('input[name="vuln"]:checked')).map(cb => cb.value);
    
    const profile = {
      name: document.getElementById('profile-name').value.trim(),
      city: document.getElementById('profile-city').value.trim(),
      housing: document.getElementById('profile-housing').value,
      familySize: document.getElementById('profile-family').value,
      vulnerabilities: vulnerabilities,
      notes: document.getElementById('profile-notes').value.trim()
    };
    
    // Save profile to storage
    Storage.setProfile(profile);
    
    // Generate specialized checklist state
    buildDefaultChecklist(profile);
    
    planContainer.style.display = 'none';
    planLoading.style.display = 'block';
    
    try {
      const planMarkdown = await Gemini.generatePreparednessPlan(profile, State.lang);
      planOutput.innerHTML = parseMarkdown(planMarkdown);
    } catch (err) {
      console.error('Plan generation failed', err);
      const planHtml = compileFallbackPreparednessPlan(profile, State.lang);
      
      let warningMessage = '';
      const isConfigMissing = err.message.includes('API_KEY_MISSING') || err.message.includes('PROXY_CONFIG_MISSING');
      const isProxyFailure = err.message.includes('PROXY_REQUEST_FAILED');
      if (isConfigMissing) {
        warningMessage = `⚠️ ${State.lang === 'en' ? 'Server Gemini API key is not configured. Displaying local dynamic plan based on your profile inputs.' : 'सर्वर जेमिनी एपीआई कुंजी कॉन्फ़िगर नहीं है। आपके प्रोफाइल के अनुसार स्थानीय योजना प्रदर्शित की जा रही है।'}`;
      } else {
        warningMessage = `❌ ${State.lang === 'en' ? 'GenAI Service error. Switched to local dynamic fallback plan.' : 'जेनेरेटिव एआई सेवा त्रुटि। स्थानीय फॉलबैक सुरक्षा योजना लोड की गई है।'}`;
      }

      planOutput.innerHTML = `
        <div style="background-color: rgba(245, 158, 11, 0.1); border: 1px solid var(--alert-caution); padding: 1rem; border-radius: var(--radius); margin-bottom: 1.5rem; color: var(--alert-caution); font-weight: 500;">
          ${warningMessage} ${isProxyFailure ? `(${err.message})` : ''}
        </div>
        ${parseMarkdown(planHtml)}
      `;
    } finally {
      planLoading.style.display = 'none';
      planContainer.style.display = 'block';
    }
  });
}

// 6. Emergency Checklist Engine
function buildDefaultChecklist(profile) {
  const items = [...STATIC_CHECKLISTS.basic];
  
  if (profile.vulnerabilities) {
    if (profile.vulnerabilities.includes('infants')) {
      items.push(...STATIC_CHECKLISTS.infants);
    }
    if (profile.vulnerabilities.includes('elderly')) {
      items.push(...STATIC_CHECKLISTS.elderly);
    }
    if (profile.vulnerabilities.includes('pets')) {
      items.push(...STATIC_CHECKLISTS.pets);
    }
  }
  
  const checklistState = items.map(item => ({
    id: item.id,
    text: item.text,
    category: item.category,
    checked: false
  }));
  
  Storage.setChecklist(checklistState);
  renderChecklist();
}

function renderChecklist() {
  const holder = document.getElementById('checklist-holder');
  let state = Storage.getChecklist();
  
  // If no saved state, look for saved profile to compile. Else load default basic.
  if (!state) {
    const profile = Storage.getProfile();
    if (profile) {
      buildDefaultChecklist(profile);
      return;
    } else {
      state = STATIC_CHECKLISTS.basic.map(item => ({
        id: item.id,
        text: item.text,
        category: item.category,
        checked: false
      }));
      Storage.setChecklist(state);
    }
  }
  
  holder.innerHTML = '';
  
  // Group by category
  const categories = {};
  state.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });
  
  // Render categories and items
  for (const catName in categories) {
    const section = document.createElement('div');
    section.className = 'checklist-section';
    
    const title = document.createElement('div');
    title.className = 'checklist-title';
    title.innerText = catName;
    section.appendChild(title);
    
    categories[catName].forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = `checklist-item ${item.checked ? 'checked' : ''}`;
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = item.checked;
      checkbox.id = `chk-${item.id}`;
      checkbox.setAttribute('aria-label', item.text);
      
      const textSpan = document.createElement('span');
      textSpan.innerText = item.text;
      
      // Click listeners
      const toggle = () => {
        item.checked = !item.checked;
        checkbox.checked = item.checked;
        itemEl.classList.toggle('checked', item.checked);
        Storage.setChecklist(state);
        updateChecklistProgress();
      };
      
      checkbox.addEventListener('change', toggle);
      itemEl.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          toggle();
        }
      });
      
      itemEl.appendChild(checkbox);
      itemEl.appendChild(textSpan);
      section.appendChild(itemEl);
    });
    
    holder.appendChild(section);
  }
  
  updateChecklistProgress();
}

function updateChecklistProgress() {
  const state = Storage.getChecklist();
  if (!state || state.length === 0) return;
  
  const checkedCount = state.filter(i => i.checked).length;
  const percentage = Math.round((checkedCount / state.length) * 100);
  
  document.getElementById('checklist-progress-fill').style.width = `${percentage}%`;
}

function initChecklistEvents() {
  document.getElementById('btn-reset-checklist').addEventListener('click', () => {
    const state = Storage.getChecklist();
    if (state) {
      state.forEach(i => i.checked = false);
      Storage.setChecklist(state);
      renderChecklist();
    }
  });
}

// 7. Travel Sentinel (Travel Safety Portal)
function initTravelSentinel() {
  const formTravel = document.getElementById('form-travel');
  const travelLoading = document.getElementById('travel-loading');
  const travelContainer = document.getElementById('travel-result-container');
  const travelOutput = document.getElementById('travel-markdown-output');
  
  formTravel.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const details = {
      origin: document.getElementById('travel-origin').value.trim(),
      destination: document.getElementById('travel-destination').value.trim(),
      mode: document.getElementById('travel-mode').value
    };
    
    travelContainer.style.display = 'none';
    travelLoading.style.display = 'block';
    
    // Check if weather data exists
    const weather = State.currentWeather || { temp: 28, precipitation: 5, windSpeed: 10, weatherCode: 61 };
    
    try {
      const advisory = await Gemini.generateTravelAdvisory(details, weather, State.lang);
      travelOutput.innerHTML = parseMarkdown(advisory);
    } catch (err) {
      console.error('Travel Sentinel failed', err);
      const fallbackText = getFallbackTravelAdvisory(details, weather);
      
      let warningMessage = '';
      const isConfigMissing = err.message.includes('API_KEY_MISSING') || err.message.includes('PROXY_CONFIG_MISSING');
      const isProxyFailure = err.message.includes('PROXY_REQUEST_FAILED');
      if (isConfigMissing) {
        warningMessage = State.lang === 'en'
          ? 'Server Gemini API key is not configured. Evaluating travel risks using local static engine.'
          : 'सर्वर जेमिनी एपीआई कुंजी कॉन्फ़िगर नहीं है। स्थानीय विश्लेषण इंजन द्वारा यात्रा सुरक्षा का आकलन किया गया है।';
      } else {
        warningMessage = State.lang === 'en'
          ? 'GenAI service query failed. Displaying local travel safety analysis.'
          : 'एआई विश्लेषण विफल। स्थानीय डेटा के आधार पर मार्ग सुरक्षा प्रदर्शित की जा रही है।';
      }

      travelOutput.innerHTML = `
        <div style="background-color: rgba(245, 158, 11, 0.1); border: 1px solid var(--alert-caution); padding: 1rem; border-radius: var(--radius); margin-bottom: 1.5rem; color: var(--alert-caution); font-weight: 500;">
          ⚠️ ${warningMessage} ${isProxyFailure ? `(${err.message})` : ''}
        </div>
        ${parseMarkdown(fallbackText)}
      `;
    } finally {
      travelLoading.style.display = 'none';
      travelContainer.style.display = 'block';
    }
  });
}

function getFallbackTravelAdvisory(details, weather) {
  const isHi = State.lang === 'hi';
  const meta = Weather.getWeatherMeta(weather.weatherCode, State.lang);
  
  let rating = 'Green: Safe';
  let detailsText = '';
  
  // Simple heuristic logic
  if (meta.alert === 'alert') {
    rating = 'Red: Do Not Travel';
  } else if (meta.alert === 'caution') {
    rating = 'Yellow: Exercise Caution';
  } else {
    if (weather.precipitation > 20 || weather.windSpeed > 35) {
      rating = 'Yellow: Exercise Caution';
    }
  }
  
  // Specific suggestions based on travel mode
  let modeInstructions = '';
  if (details.mode === 'walking') {
    modeInstructions = isHi 
      ? '*   पैदल यात्रियों के लिए खतरा: खुले मैनहोल, जलभराव और फिसलन वाली सड़कें। सुरक्षित, ऊंचे फुटपाथों पर चलें। बिजली के खंभों से दूर रहें।' 
      : '*   Pedestrian Warnings: High risks of open sewer manholes hidden by water, electric leakage from poles, and slippery pavements. Stay away from waterlogged sidewalks.';
  } else if (details.mode === 'two_wheeler') {
    modeInstructions = isHi
      ? '*   दोपहिया वाहन चेतावनी: गीली सड़कों पर दोपहिया वाहन आसानी से फिसल जाते हैं। भारी हवाओं में संतुलन खोना आसान है। हेलमेट पहनें और अचानक ब्रेक न लगाएं।'
      : '*   Two-Wheeler Risk: High risk of skidding. Aquaplaning occurs easily. Heavy wind speed limits stability. Wear protective gears and avoid sudden braking.';
  } else if (details.mode === 'car') {
    modeInstructions = isHi
      ? '*   चार पहिया वाहन निर्देश: धीमी गति से चलें। अंडरपास और जलभराव वाले क्षेत्रों से बचें। यदि कार पानी में बंद हो जाए, तो तुरंत बाहर निकलें।'
      : '*   Car/Cabin safety: Keep headlights on. Do not enter waterlogged underpasses. If your vehicle stalls in deep water, evacuate immediately.';
  } else {
    modeInstructions = isHi
      ? '*   सार्वजनिक परिवहन: भारी वर्षा के कारण लोकल ट्रेनें या बसें देरी से चल सकती हैं या स्थगित हो सकती हैं। यात्रा करने से पहले लाइव स्थिति ट्रैक करें।'
      : '*   Public Transport Status: Heavy precipitation results in bus delays or local train cancellations. Always check live transit schedules before leaving.';
  }

  let text = '';
  if (!isHi) {
    text += `# Travel Security Assessment: ${rating}\n\n`;
    text += `### Route Details\n`;
    text += `*   **Route:** From "${details.origin}" to "${details.destination}"\n`;
    text += `*   **Transit Mode:** ${details.mode.replace('_', ' ').toUpperCase()}\n`;
    text += `*   **Weather Condition:** Apparent Temp: ${weather.temp}°C, Precipitation: ${weather.precipitation}mm, Status: ${meta.text}\n\n`;
    text += `### Safety Guidelines\n`;
    text += `${modeInstructions}\n`;
    text += `*   **Emergency Contact:** Keep national emergency line (112) dial-ready on your mobile.\n`;
  } else {
    text += `# यात्रा सुरक्षा मूल्यांकन: ${
      rating.includes('Red') ? 'लाल (Red): यात्रा न करें' : 
      rating.includes('Yellow') ? 'पीला (Yellow): सावधानी बरतें' : 'हरा (Green): सुरक्षित'
    }\n\n`;
    text += `### मार्ग विवरण\n`;
    text += `*   **मार्ग:** "${details.origin}" से "${details.destination}" तक\n`;
    text += `*   **पारगमन साधन:** ${
      details.mode === 'walking' ? 'पैदल' : 
      details.mode === 'two_wheeler' ? 'दोपहिया वाहन' : 
      details.mode === 'car' ? 'कार / टैक्सी' : 'सार्वजनिक वाहन'
    }\n`;
    text += `*   **मौसम की स्थिति:** तापमान: ${weather.temp}°C, वर्षा: ${weather.precipitation}mm, स्थिति: ${meta.text}\n\n`;
    text += `### सुरक्षा दिशा-निर्देश\n`;
    text += `${modeInstructions}\n`;
    text += `*   **आपातकालीन संपर्क:** संकट की स्थिति में आपातकालीन नंबर (112) पर डायल करें।\n`;
  }
  
  return text;
}

// 8. Safety Hub (Offline Guidelines & Contacts)
function initSafetyHub() {
  renderGuidelines();
  renderEmergencyContacts();
  
  // Tab Switching
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      const panelId = tab.getAttribute('aria-controls');
      document.getElementById(panelId).classList.add('active');
    });
  });
}

function renderGuidelines() {
  const textObj = DISASTER_GUIDELINES[State.lang] || DISASTER_GUIDELINES.en;
  
  // Update Section Titles
  document.getElementById('panel-before-title').innerText = textObj.before.title;
  document.getElementById('panel-during-title').innerText = textObj.during.title;
  document.getElementById('panel-after-title').innerText = textObj.after.title;
  
  // Render lists
  const renderList = (elementId, stepsArray) => {
    const list = document.getElementById(elementId);
    list.innerHTML = '';
    stepsArray.forEach(step => {
      const li = document.createElement('li');
      // Format markdown bold within items
      li.innerHTML = step.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      list.appendChild(li);
    });
  };
  
  renderList('list-before', textObj.before.steps);
  renderList('list-during', textObj.during.steps);
  renderList('list-after', textObj.after.steps);
}

function renderEmergencyContacts() {
  const holder = document.getElementById('contacts-holder');
  if (!holder) return;
  holder.innerHTML = '';
  
  // Get city-specific contacts based on active weather location
  let localContacts = [];
  if (State.currentWeather && State.currentWeather.cityName) {
    localContacts = getCityContacts(State.currentWeather.cityName, State.lang);
  } else {
    localContacts = getCityContacts('Mumbai', State.lang);
  }
  
  // Prepend local contacts to the national/global list
  const allContacts = [...localContacts, ...EMERGENCY_CONTACTS];
  
  allContacts.forEach(contact => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.padding = '1.25rem';
    
    const name = document.createElement('strong');
    name.innerText = contact.name;
    name.style.display = 'block';
    name.style.marginBottom = '0.25rem';
    
    const desc = document.createElement('span');
    desc.innerText = contact.description;
    desc.style.display = 'block';
    desc.style.fontSize = 'var(--font-size-xs)';
    desc.style.color = 'var(--text-secondary)';
    desc.style.marginBottom = '0.75rem';
    
    const link = document.createElement('a');
    link.href = `tel:${contact.phone}`;
    link.className = 'btn-primary';
    link.style.display = 'inline-block';
    link.style.padding = '0.4rem 0.85rem';
    link.style.textDecoration = 'none';
    link.style.borderRadius = '8px';
    link.innerText = `📞 ${contact.phone}`;
    
    card.appendChild(name);
    card.appendChild(desc);
    card.appendChild(link);
    holder.appendChild(card);
  });
}

// 9. AI Chatbot
function initChatbot() {
  const formChat = document.getElementById('form-chat');
  const chatInput = document.getElementById('chat-input');
  const historyBox = document.getElementById('chat-history-box');
  
  formChat.addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;
    
    // Clear input
    chatInput.value = '';
    
    // Add user bubble
    appendChatBubble('user', question);
    State.chatHistory.push({ role: 'user', text: question });
    
    // Add loading indicator
    const loadingBubble = appendChatBubble('model', `<div class="skeleton-pulse skeleton-text" style="width: 150px;"></div>`);
    
    try {
      const response = await Gemini.askSafetyQuestion(question, State.chatHistory, State.lang);
      loadingBubble.remove();
      appendChatBubble('model', parseMarkdown(response));
      State.chatHistory.push({ role: 'model', text: response });
    } catch (err) {
      console.warn('Chat Q&A failed, using local static responder fallback.', err);
      loadingBubble.remove();
      const fallbackAnswer = getFallbackChatAnswer(question);
      
      let warningMessage = '';
      const isConfigMissing = err.message.includes('API_KEY_MISSING') || err.message.includes('PROXY_CONFIG_MISSING');
      const isProxyFailure = err.message.includes('PROXY_REQUEST_FAILED');
      if (isConfigMissing) {
        warningMessage = State.lang === 'en'
          ? 'Server Gemini API key is not configured. Switched to offline keyword matcher.'
          : 'सर्वर जेमिनी एपीआई कुंजी कॉन्फ़िगर नहीं है। स्थानीय खोज इंजन सक्रिय किया गया है।';
      } else {
        warningMessage = State.lang === 'en'
          ? 'GenAI API connection issue. Switched to offline keyword matcher.'
          : 'जेनेरेटिव एआई सेवा त्रुटि। स्थानीय खोज इंजन सक्रिय किया गया है।';
      }

      appendChatBubble('model', `
        <div style="color: var(--alert-danger); margin-bottom: 0.5rem; font-size: var(--font-size-xs);">
          ⚠️ ${warningMessage} ${isProxyFailure ? `(${err.message})` : ''}
        </div>
        ${parseMarkdown(fallbackAnswer)}
      `);
      State.chatHistory.push({ role: 'model', text: fallbackAnswer });
    }
  });
}

function appendChatBubble(sender, contentHtml) {
  const box = document.getElementById('chat-history-box');
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = contentHtml;
  box.appendChild(bubble);
  
  // Scroll to bottom
  box.scrollTop = box.scrollHeight;
  return bubble;
}

function getFallbackChatAnswer(question) {
  const q = question.toLowerCase();
  const isHi = State.lang === 'hi';
  
  if (q.includes('dengue') || q.includes('fever') || q.includes('sick') || q.includes('diseas') || q.includes('doctor') || q.includes('डेंगू') || q.includes('बुखार') || q.includes('बीमार')) {
    return isHi 
      ? `### स्वास्थ्य निर्देश (डेंगू और मलेरिया से बचाव)\n*   **मच्छरों को रोकें:** पानी के जमाव को रोकें। बाल्टियों या गमलों में पानी न छोड़ें। मच्छरदानी और ओडोमॉस का उपयोग करें।\n*   **साफ पानी पिएं:** हमेशा पानी उबाल कर पिएं।\n*   **महत्वपूर्ण चेतावनी:** यदि तेज बुखार हो, तो स्व-चिकित्सा न करें। तुरंत डॉक्टर से संपर्क करें या 108 एम्बुलेंस हेल्पलाइन पर कॉल करें।`
      : `### Health Guidance (Dengue & Waterborne Pathogens)\n*   **Vector Control:** Clear any clogged buckets, empty tires, and indoor coolers to stop mosquito breeding. Use nets and repellents.\n*   **Safe Water:** Drink boiled or filtered water only to prevent waterborne infections.\n*   **CRITICAL WARNING:** Never attempt self-medication for high fever. Seek professional diagnosis at the nearest health center immediately. Call ambulance line (108).`;
  }
  
  if (q.includes('flood') || q.includes('drown') || q.includes('waterlog') || q.includes('evacuat') || q.includes('बाढ़') || q.includes('डूबना') || q.includes('जलभराव')) {
    return isHi
      ? `### बाढ़ सुरक्षा गाइड\n*   **बिजली बंद करें:** यदि घर में पानी घुस रहा है, तो तुरंत मुख्य विद्युत ग्रिड स्विच बंद करें।\n*   **उंची जगह पर जाएं:** बाढ़ के बहते पानी में न चलें। यदि आवश्यक हो तो स्थानीय सार्वजनिक आश्रय गृह में जाएं।\n*   **आपातकालीन संपर्क:** आपदा बचाव के लिए NDRF हेल्पलाइन (9711077372) पर कॉल करें।`
      : `### Flooding & Evacuation Protocols\n*   **Turn off Power:** Flip the main electrical breaker immediately if floodwaters approach your indoor outlets.\n*   **Move Higher:** Never step or drive into rushing floodwaters. Head to upper levels or designated shelters.\n*   **Rescue Helpline:** Dial the National Disaster Response Force (NDRF) immediately at 9711077372 for active rescue.`;
  }
  
  if (q.includes(' waterproof') || q.includes('crack') || q.includes('leak') || q.includes('wall') || q.includes('छत') || q.includes('लीक') || q.includes('दीवार')) {
    return isHi
      ? `### घर की वॉटरप्रूफिंग तैयारी\n*   **दरारें सील करें:** मानसून शुरू होने से पहले दीवारों और खिड़कियों की दरारों को सीमेंट या वॉटरप्रूफ कोटिंग से सील करें।\n*   **छत की नालियां:** छत की जल निकासी पाइपों को कचरे से मुक्त रखें।\n*   **महत्वपूर्ण:** भारी बारिश के दौरान छतों पर जाकर मरम्मत करने की कोशिश न करें; यह गिरने के खतरे के कारण अत्यधिक असुरक्षित है।`
      : `### Home Waterproofing Guidelines\n*   **Seal Cracks:** Use masonry sealant or waterproof paint on wall cracks before heavy downpours start.\n*   **Drain Clearance:** Routinely clear silt and leaf litter from balcony and roof outlets.\n*   **CAUTION:** Do not climb on rooftops to apply sealants during active windstorms or rain. Wait for weather clearance.`;
  }
  
  return isHi
    ? `### रेनगार्ड आपातकालीन सहायता\nआपके द्वारा पूछे गए प्रश्न के लिए मेरे पास सीधे निर्देश नहीं हैं। कृपया निम्न मुख्य बिंदुओं पर पूछें:\n*   **बाढ़** सुरक्षा और आपातकालीन आश्रय\n*   **स्वास्थ्य** और डेंगू से बचाव\n*   **वॉटरप्रूफिंग** और घर की तैयारी`
    : `### RainGuard Emergency Hub\nI don't have matching instructions for your specific query in offline mode. Try asking about:\n*   **Flooding** safety & evacuation\n*   **Health** guidelines, water safety, and fever\n*   **Waterproofing** homes and drainage`;
}

// 10. Connection Monitor (Offline Handling)
function initConnectionMonitor() {
  const banner = document.getElementById('offline-banner');
  
  const updateStatus = () => {
    if (navigator.onLine) {
      banner.style.display = 'none';
    } else {
      banner.style.display = 'block';
    }
  };
  
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  
  // Initial check
  updateStatus();
}

// Application Startup
document.addEventListener('DOMContentLoaded', () => {
  requestNotificationPermission();
  initNavigation();
  initSettings();
  initWeather('Mumbai');
  initProfiler();
  renderChecklist();
  initChecklistEvents();
  initTravelSentinel();
  initSafetyHub();
  initChatbot();
  initConnectionMonitor();
  updateLanguageTexts();
});
