
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'id';

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const translations = {
  en: {
    // General
    'app.name': 'Copytology',
    'app.tagline': 'Master Copywriting with Real Case Challenges',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.history': 'History',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.title': 'Your Challenges',
    'dashboard.refresh': 'Refresh Challenges',
    'dashboard.generating': 'Generating...',
    'dashboard.all': 'All',
    'dashboard.copywriting': 'Copywriting',
    'dashboard.content': 'Content',
    'dashboard.uxwriting': 'UX Writing',
    'dashboard.loading': 'Loading challenges...',
    'dashboard.error': 'Error loading challenges.',
    'dashboard.try.again': 'Try Again',
    'dashboard.no.challenges': 'No challenges available.',
    'dashboard.generate.new': 'Generate New Challenges',
    'dashboard.start.challenge': 'Start Challenge',
    
    // Challenge
    'challenge.back': 'Back to Dashboard',
    'challenge.description': 'Description:',
    'challenge.your.challenge': 'Your Challenge:',
    'challenge.your.response': 'Your Response:',
    'challenge.words': 'words',
    'challenge.submit': 'Submit Response',
    'challenge.analyzing': 'Analyzing...',
    'challenge.guidelines': 'Challenge Guidelines',
    'challenge.estimated.time': 'Estimated time:',
    'challenge.keep.in.mind': 'Keep in mind:',
    'challenge.word.limit': 'Word limit:',
    'challenge.need.hint': 'Need a hint?',
    'challenge.results': 'Challenge Results',
    'challenge.score': 'Score:',
    'challenge.strengths': 'Strengths',
    'challenge.to.improve': 'To Improve:',
    'challenge.xp.gained': 'XP Gained',
    'challenge.to': 'to',
    'challenge.view.history': 'View History',
    'challenge.more.challenges': 'More Challenges',
    'challenge.writing.hints': 'Writing Hints',
    'challenge.tip': 'Here are some tips to help with this challenge.',
    'challenge.tip.consider': 'For this {type} challenge, consider the specific audience and purpose. What action do you want the reader to take?',
    'challenge.tip.approaches': 'Some possible approaches:',
    'challenge.tip.benefits': 'Focus on benefits, not just features',
    'challenge.tip.language': 'Use clear, concise language',
    'challenge.tip.connection': 'Create emotional connection',
    'challenge.tip.cta': 'Include a call to action',
    'challenge.got.it': 'Got it',
    
    // History
    'history.title': 'Your Submission History',
    'history.all.types': 'All Types',
    'history.no.submissions': 'No submissions found.',
    'history.start.challenge': 'Start a Challenge',
    'history.submitted.on': 'Submitted on',
    'history.view': 'View',
    'history.delete': 'Delete',
    'history.delete.confirm.title': 'Are you sure you want to delete this submission?',
    'history.delete.confirm.desc': 'Deleting this submission will remove {xp} XP from your total. This action cannot be undone.',
    'history.delete.confirm.cancel': 'Cancel',
    'history.delete.confirm.delete': 'Delete',
    'history.delete.deleting': 'Deleting...',
    
    // Landing page
    'landing.hero.title': 'Master Copywriting with Real Case Challenges',
    'landing.hero.subtitle': 'Build professional writing skills through interactive challenges, earn XP, and climb the career ladder from Intern to CMO.',
    'landing.hero.feature1': 'AI-generated challenges for copywriting, content, and UX writing',
    'landing.hero.feature2': 'Instant scoring and personalized AI feedback',
    'landing.hero.feature3': 'Track your progress with levels and career milestones',
    'landing.hero.getstarted': 'Get Started',
    'landing.hero.learnmore': 'Learn More',
    'landing.features.title': 'Develop Professional Writing Skills',
    'landing.features.subtitle': 'Everything you need to build your skills and transition to a writing career',
    'landing.cta.title': 'Ready to Start Your Writing Journey?',
    'landing.cta.subtitle': 'Join thousands of aspiring writers who have transformed their skills and careers with Copytology.',
    'landing.cta.getstarted': 'Get Started for Free',
    'landing.cta.viewpricing': 'View Pricing',
    'landing.cta.nocreditcard': 'No credit card required. Start with our free tier and upgrade anytime.',
    'landing.testimonials.title': 'Success Stories',
    'landing.testimonials.subtitle': 'See how others have transformed their careers with Copytology',
    'landing.careerpath.title': 'Your Writing Career Path',
    'landing.careerpath.subtitle': 'Track your progress through real-world career milestones as you complete writing challenges',

    // Footer
    'footer.resources': 'Resources',
    'footer.about': 'About',
    'footer.pricing': 'Pricing',
    'footer.blog': 'Blog',
    'footer.help': 'Help Center',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookie': 'Cookie Policy',
    'footer.connect': 'Connect',
    'footer.contact': 'Contact Us',
    'footer.rights': '© {year} Copytology. All rights reserved.',
    
    // Language settings
    'language.english': 'English',
    'language.indonesian': 'Bahasa Indonesia',
  },
  id: {
    // General
    'app.name': 'Copytology',
    'app.tagline': 'Kuasai Copywriting dengan Tantangan Kasus Nyata',
    
    // Navigation
    'nav.dashboard': 'Dasbor',
    'nav.history': 'Riwayat',
    'nav.profile': 'Profil',
    'nav.login': 'Masuk',
    'nav.register': 'Daftar',
    'nav.logout': 'Keluar',
    
    // Dashboard
    'dashboard.title': 'Tantangan Anda',
    'dashboard.refresh': 'Segarkan Tantangan',
    'dashboard.generating': 'Menghasilkan...',
    'dashboard.all': 'Semua',
    'dashboard.copywriting': 'Copywriting',
    'dashboard.content': 'Konten',
    'dashboard.uxwriting': 'UX Writing',
    'dashboard.loading': 'Memuat tantangan...',
    'dashboard.error': 'Error memuat tantangan.',
    'dashboard.try.again': 'Coba Lagi',
    'dashboard.no.challenges': 'Tidak ada tantangan tersedia.',
    'dashboard.generate.new': 'Hasilkan Tantangan Baru',
    'dashboard.start.challenge': 'Mulai Tantangan',
    
    // Challenge
    'challenge.back': 'Kembali ke Dasbor',
    'challenge.description': 'Deskripsi:',
    'challenge.your.challenge': 'Tantangan Anda:',
    'challenge.your.response': 'Respons Anda:',
    'challenge.words': 'kata',
    'challenge.submit': 'Kirim Respons',
    'challenge.analyzing': 'Menganalisis...',
    'challenge.guidelines': 'Panduan Tantangan',
    'challenge.estimated.time': 'Estimasi waktu:',
    'challenge.keep.in.mind': 'Perlu diingat:',
    'challenge.word.limit': 'Batas kata:',
    'challenge.need.hint': 'Butuh petunjuk?',
    'challenge.results': 'Hasil Tantangan',
    'challenge.score': 'Skor:',
    'challenge.strengths': 'Kekuatan',
    'challenge.to.improve': 'Untuk Ditingkatkan:',
    'challenge.xp.gained': 'XP Diperoleh',
    'challenge.to': 'hingga',
    'challenge.view.history': 'Lihat Riwayat',
    'challenge.more.challenges': 'Lebih Banyak Tantangan',
    'challenge.writing.hints': 'Petunjuk Menulis',
    'challenge.tip': 'Berikut beberapa tips untuk membantu tantangan ini.',
    'challenge.tip.consider': 'Untuk tantangan {type} ini, pertimbangkan audiens dan tujuan yang spesifik. Tindakan apa yang Anda inginkan dari pembaca?',
    'challenge.tip.approaches': 'Beberapa pendekatan yang mungkin:',
    'challenge.tip.benefits': 'Fokus pada manfaat, bukan hanya fitur',
    'challenge.tip.language': 'Gunakan bahasa yang jelas dan ringkas',
    'challenge.tip.connection': 'Ciptakan koneksi emosional',
    'challenge.tip.cta': 'Sertakan ajakan bertindak',
    'challenge.got.it': 'Mengerti',
    
    // History
    'history.title': 'Riwayat Pengajuan Anda',
    'history.all.types': 'Semua Tipe',
    'history.no.submissions': 'Tidak ada pengajuan ditemukan.',
    'history.start.challenge': 'Mulai Tantangan',
    'history.submitted.on': 'Diajukan pada',
    'history.view': 'Lihat',
    'history.delete': 'Hapus',
    'history.delete.confirm.title': 'Apakah Anda yakin ingin menghapus pengajuan ini?',
    'history.delete.confirm.desc': 'Menghapus pengajuan ini akan mengurangi {xp} XP dari total Anda. Tindakan ini tidak dapat dibatalkan.',
    'history.delete.confirm.cancel': 'Batal',
    'history.delete.confirm.delete': 'Hapus',
    'history.delete.deleting': 'Menghapus...',
    
    // Landing page
    'landing.hero.title': 'Kuasai Copywriting dengan Tantangan Kasus Nyata',
    'landing.hero.subtitle': 'Bangun keterampilan menulis profesional melalui tantangan interaktif, dapatkan XP, dan naiki jenjang karir dari Magang hingga CMO.',
    'landing.hero.feature1': 'Tantangan dihasilkan AI untuk copywriting, konten, dan UX writing',
    'landing.hero.feature2': 'Penilaian instan dan umpan balik AI personal',
    'landing.hero.feature3': 'Lacak kemajuan Anda dengan level dan pencapaian karir',
    'landing.hero.getstarted': 'Mulai',
    'landing.hero.learnmore': 'Pelajari Lebih Lanjut',
    'landing.features.title': 'Kembangkan Keterampilan Menulis Profesional',
    'landing.features.subtitle': 'Semua yang Anda butuhkan untuk membangun keterampilan dan beralih ke karir menulis',
    'landing.cta.title': 'Siap Memulai Perjalanan Menulis Anda?',
    'landing.cta.subtitle': 'Bergabunglah dengan ribuan penulis aspirasi yang telah mengubah keterampilan dan karir mereka dengan Copytology.',
    'landing.cta.getstarted': 'Mulai Gratis',
    'landing.cta.viewpricing': 'Lihat Harga',
    'landing.cta.nocreditcard': 'Tidak perlu kartu kredit. Mulai dengan tier gratis dan upgrade kapan saja.',
    'landing.testimonials.title': 'Kisah Sukses',
    'landing.testimonials.subtitle': 'Lihat bagaimana orang lain telah mengubah karir mereka dengan Copytology',
    'landing.careerpath.title': 'Jalur Karir Menulis Anda',
    'landing.careerpath.subtitle': 'Lacak kemajuan Anda melalui tonggak karir dunia nyata saat Anda menyelesaikan tantangan menulis',

    // Footer
    'footer.resources': 'Sumber Daya',
    'footer.about': 'Tentang',
    'footer.pricing': 'Harga',
    'footer.blog': 'Blog',
    'footer.help': 'Pusat Bantuan',
    'footer.legal': 'Legal',
    'footer.privacy': 'Kebijakan Privasi',
    'footer.terms': 'Ketentuan Layanan',
    'footer.cookie': 'Kebijakan Cookie',
    'footer.connect': 'Hubungi',
    'footer.contact': 'Hubungi Kami',
    'footer.rights': '© {year} Copytology. Hak cipta dilindungi.',
    
    // Language settings
    'language.english': 'English',
    'language.indonesian': 'Bahasa Indonesia',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string) => {
    const translatedText = translations[language][key as keyof typeof translations[typeof language]];
    if (!translatedText) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }
    
    // Handle special cases like current year
    if (key === 'footer.rights') {
      return translatedText.replace('{year}', new Date().getFullYear().toString());
    }
    
    return translatedText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
