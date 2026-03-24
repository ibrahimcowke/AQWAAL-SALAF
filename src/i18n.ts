import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      "app_name": "نور السلف",
      "home": "الرئيسية",
      "aqwaal": "الأقوال",
      "qisas": "القصص",
      "scholars": "العلماء",
      "search": "البحث",
      "favorites": "المفضلة",
      "settings": "الإعدادات",
      "daily_qawl": "قول اليوم",
      "continue_reading": "تابع القراءة",
      "categories": "استكشف المحتوى",
      "quick_links": "روابط سريعة",
      "read_more": "اقرأ المزيد",
      "share": "مشاركة",
      "save": "حفظ",
      "audio": "استماع",
      "source": "المصدر",
      "authenticity": "الصحة",
      "era": "العصر",
      "death": "الوفاة",
      "bio": "السيرة الذاتية",
      "all": "الكل",
      "authentic": "صحيح",
      "hasan": "حسن",
      "weak": "ضعيف",
      "theme_light": "نهاري",
      "theme_dark": "ليلي",
      "theme_paper": "ورقي",
      "font_size": "حجم الخط",
      "reading_mode": "وضع القراءة",
      "admin_panel": "لوحة الإدارة",
      "welcome": "مرحباً بك في نور السلف",
      "slogan": "ضياء من مكنونات السلف الصالح",
      "appearance": "المظهر والرؤية",
      "display_mode": "نمط العرض",
      "font_size_desc": "تعديل حجم خط القراءة والكتاب",
      "reading_mode_desc": "إخفاء العناصر المشتتة أثناء القراءة",
      "settings_subtitle": "تخصيص تجربة القراءة والتفاعل",
      "about": "عن المنصة",
      "website": "الموقع الرسمي",
      "privacy_policy": "سياسة الخصوصية",
      "contact_us": "اتصل بنا",
      "clear_data": "مسح جميع البيانات المحلية وإعادة التشغيل",
      "clear_data_desc": "سيتم تسجيل الخروج ومسح المفضلة والإعدادات المحفوظة",
      "cache_cleared": "تم مسح البيانات المحلية بنجاح"
    }
  },
  en: {
    translation: {
      "app_name": "Noor Al-Salaf",
      "home": "Home",
      "aqwaal": "Sayings",
      "qisas": "Stories",
      "scholars": "Scholars",
      "search": "Search",
      "favorites": "Favorites",
      "settings": "Settings",
      "daily_qawl": "Daily Wisdom",
      "continue_reading": "Continue Reading",
      "categories": "Explore Content",
      "quick_links": "Quick Links",
      "read_more": "Read More",
      "share": "Share",
      "save": "Save",
      "audio": "Listen",
      "source": "Source",
      "authenticity": "Grade",
      "era": "Era",
      "death": "Death",
      "bio": "Biography",
      "all": "All",
      "authentic": "Authentic",
      "hasan": "Hasan",
      "weak": "Weak",
      "theme_light": "Light",
      "theme_dark": "Dark",
      "theme_paper": "Paper",
      "font_size": "Font Size",
      "reading_mode": "Reader Mode",
      "admin_panel": "Admin Panel",
      "welcome": "Welcome to Noor Al-Salaf",
      "slogan": "Light from the Righteous Predecessors",
      "appearance": "Appearance & Vision",
      "display_mode": "Display Mode",
      "font_size_desc": "Adjust reading and book font size",
      "reading_mode_desc": "Hide distracting elements while reading",
      "settings_subtitle": "Personalize your reading experience",
      "about": "About Platform",
      "website": "Official Website",
      "privacy_policy": "Privacy Policy",
      "contact_us": "Contact Us",
      "clear_data": "Clear Local Data & Restart",
      "clear_data_desc": "Logging out, favorites and settings will be cleared",
      "cache_cleared": "Local data cleared successfully"
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
