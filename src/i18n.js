export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGE_STORAGE_KEY = 'site_language_v1';

export const LANGUAGES = {
  en: {
    label: 'English',
    shortLabel: 'EN',
    nextLabel: 'العربية',
    dir: 'ltr'
  },
  ar: {
    label: 'العربية',
    shortLabel: 'ع',
    nextLabel: 'English',
    dir: 'rtl'
  }
};

export const content = {
  en: {
    skipLink: 'Skip to content',
    nav: {
      ariaLabel: 'Section navigation',
      kicker: 'nav',
      items: {
        hero: 'hero',
        about: 'about',
        projects: 'projects',
        contact: 'contact'
      }
    },
    languageToggle: {
      ariaLabel: 'Switch language'
    },
    hero: {
      kicker: '> system_boot',
      title: 'أهلاً وسهلاً',
      subtitle: 'Welcome - for my non-Arabic speakers.',
      name: 'Kinan Maarrawi',
      buttons: {
        about: 'About',
        projects: 'Projects',
        contact: 'Contact'
      },
      systemStatus: '> system.status: online'
    },
    about: {
      kicker: '> profile_terminal',
      tablistLabel: 'Profile sections'
    },
    projects: {
      kicker: '> top_projects',
      stackCommand: 'stack:'
    },
    footer: {
      kicker: 'contact',
      email: 'email',
      linkedin: 'linkedin',
      github: 'github',
      cv: 'cv',
      copy: 'copy',
      copied: 'copied.',
      cvText: 'Download CV (PDF)'
    }
  },
  ar: {
    skipLink: 'تخطَّ إلى المحتوى',
    nav: {
      ariaLabel: 'التنقل بين أقسام الصفحة',
      kicker: 'nav',
      items: {
        hero: 'البداية',
        about: 'من أنا؟',
        projects: 'شغلي',
        contact: 'تواصل'
      }
    },
    languageToggle: {
      ariaLabel: 'تبديل اللغة'
    },
    hero: {
      kicker: '> system_boot',
      title: 'Welcome',
      subtitle: 'أهلاً وسهلاً - للزوار اللي ما بيحكوا إنجليزي.',
      name: 'كنان المعراوي',
      buttons: {
        about: 'من أنا؟',
        projects: 'شغلي',
        contact: 'تواصل'
      },
      systemStatus: '> system.status: online'
    },
    about: {
      kicker: '> profile_terminal',
      tablistLabel: 'أقسام الملف الشخصي'
    },
    projects: {
      kicker: '> top_projects',
      stackCommand: 'stack:'
    },
    footer: {
      kicker: 'contact',
      email: 'email',
      linkedin: 'linkedin',
      github: 'github',
      cv: 'cv',
      copy: 'نسخ',
      copied: 'تم النسخ.',
      cvText: 'تحميل السيرة الذاتية (PDF)'
    }
  }
};
