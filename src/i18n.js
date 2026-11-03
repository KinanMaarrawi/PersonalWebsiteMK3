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
        experience: 'experience',
        projects: 'projects',
        contact: 'contact'
      }
    },
    languageToggle: {
      ariaLabel: 'Switch language'
    },
    fxToggle: {
      ariaLabel: 'Animations and custom cursor',
      title: 'Turn animations and the custom cursor on or off'
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
    experience: {
      kicker: '> git log --graph experience',
      now: 'now',
      present: 'present',
      graduation: 'Graduation',
      initialCommit: org => `Initial commit — started at ${org}`,
      did: 'did',
      learned: 'learned',
      seeProject: 'see project'
    },
    projects: {
      kicker: '> top_projects',
      stackCommand: 'stack:',
      open: 'Open details for',
      dialog: {
        close: 'esc',
        closeLabel: 'Close',
        source: 'source',
        live: 'live',
        highlights: 'highlights'
      }
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
        experience: 'خبرتي',
        projects: 'شغلي',
        contact: 'تواصل'
      }
    },
    languageToggle: {
      ariaLabel: 'تبديل اللغة'
    },
    fxToggle: {
      ariaLabel: 'الحركات والمؤشر الخاص',
      title: 'شغّل أو طفّي الحركات والمؤشر الخاص'
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
    experience: {
      kicker: '> git log --graph experience',
      now: 'الآن',
      present: 'حتى الآن',
      graduation: 'التخرج',
      initialCommit: org => `أول commit — بلّشت بـ${org}`,
      did: 'عملت',
      learned: 'تعلّمت',
      seeProject: 'شوف المشروع'
    },
    projects: {
      kicker: '> top_projects',
      stackCommand: 'stack:',
      open: 'تفاصيل',
      dialog: {
        close: 'esc',
        closeLabel: 'إغلاق',
        source: 'الكود',
        live: 'جرّبه',
        highlights: 'أبرز النقاط'
      }
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
