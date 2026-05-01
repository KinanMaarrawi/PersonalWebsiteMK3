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
      role: 'CS Student @ UoBD',
      buttons: {
        about: 'About',
        projects: 'Projects',
        contact: 'Contact'
      },
      systemStatus: '> system.status: online'
    },
    about: {
      kicker: '> profile_terminal',
      commands: [
        {
          id: 'whoami',
          image: '/about-whoami.webp',
          imageAlt: 'Kinan Maarrawi portrait',
          lines: [
            '>whoami',
            'I’m a Computer Science student who likes building things that feel useful, not just impressive in a demo.',
            'I care about the parts people do not always see: how systems are designed, how they fail, how they stay secure, and how they become something real people can actually use.',
            'Computer Science with Software Engineering (Year 2) @ University of Birmingham Dubai'
          ]
        },
        {
          id: 'origin',
          image: '/about-origin.webp',
          imageAlt: 'Kinan Maarrawi outdoors',
          lines: [
            '>origin',
            'From Damascus, Syria',
            'Raised in Dubai',
            'I’m Syrian, and I grew up in Dubai, so a lot of who I am comes from both places. Syria is not just where my family is from, and Dubai is not just where I lived. Both shaped how I think: stay practical, adapt quickly, and build things that have real value instead of just looking good.'
          ]
        },
        {
          id: 'interests',
          image: '/about-interests.webp',
          imageAlt: 'Kinan Maarrawi by a car',
          lines: [
            '>interests', 
            'Linux', 
            'PC hardware + homelabbing', 
            'Outside of tech, I\'m into cars, fitness, music and history.'
          ]
        },
        {
          id: 'currently',
          image: '/about-currently.webp',
          imageAlt: 'Kinan Maarrawi in a city setting',
          lines: [
            '>currently',
            'Working through uni assignments',
            'Building projects that teach me something useful',
            'Trying to become a better software engineer while still having a life outside my computer screen'
          ]
        }
      ]
    },
    projects: {
      kicker: '> top_projects',
      stackCommand: 'stack:',
      stackItems: ['Java', 'Python', 'JavaScript', 'Haskell', 'C', 'SQL', 'Git', 'React', 'Next.js', 'Linux', 'TailwindCSS'],
      items: [
        {
          title: "Dorz 'Book a Ride'",
          image: '/8.png',
          github: 'https://github.com/KinanMaarrawi/DorzMVP',
          description: 'Ride-booking MVP built for my Internship @ DORZ.',
          tech: 'Kotlin'
        },
        {
          title: 'PM_CLI',
          image: '/7.png',
          github: 'https://github.com/KinanMaarrawi/PM_CLI',
          description: 'Terminal password manager built to learn C and encryption.',
          tech: 'C'
        },
        {
          title: 'GWTIT',
          image: '/10.png',
          github: 'https://github.com/KinanMaarrawi/GWTIT',
          description: 'Flask-based API project that aggregates geographic data for a country in a simple web interface.',
          tech: 'Flask'
        },
        {
          title: 'terra-tui',
          image: '/11.png',
          github: 'https://github.com/KinanMaarrawi/terra-tui',
          description: 'A procedural terrain explorer and TUI sandbox, built in Haskell.',
          tech: 'Haskell'
        }
      ]
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
      role: 'طالب CS @ UoBD',
      buttons: {
        about: 'من أنا؟',
        projects: 'شغلي',
        contact: 'تواصل'
      },
      systemStatus: '> system.status: online'
    },
    about: {
      kicker: '> profile_terminal',
      commands: [
        {
          id: 'whoami',
          image: '/about-whoami.webp',
          imageAlt: 'صورة لكنان معراوي',
          lines: [
            '>whoami',
            'أنا طالب كمبيوتر ساينس, بحب برمج وإشتغل عمشاريع مو بس شكل, من المهم عندي تكون هي المشاريع  فعلاً مفيدة.',
            'بهتم بالتفاصيل اللي الناس غالباً ما بتشوفها: كيف النظام بينبنى، وين ممكن يوقع، كيف منخليه آمن، وكيف منصممه ليصير شي حقيقي الناس تقدر تستخدمه بسهولة.',
            'حالياً, عمأدرس علوم حاسوب مع هندسة برمجيات - السنة الثانية بجامعة برمنغهام بدبي'          
          ]
        },
        {
          id: 'origin',
          image: '/about-origin.webp',
          imageAlt: 'كنان معراوي في الخارج',
          lines: [
            '>origin',
            'من دمشق، سوريا',
            'عشت وكبرت بدبي',
            'أنا سوري وكبرت بدبي، فطبيعي جزء كبير مني جاي من المكانين. سوريا بالنسبة إلي مو بس وطن، ودبي مو بس مدينة عشت فيها. التنين شكلوا طريقة تفكيري: كون عملي، أتأقلم بسرعة، وأبني شي له قيمة بدل ما يكون بس شكل.'
          ]
        },
        {
          id: 'interests',
          image: '/about-interests.webp',
          imageAlt: 'كنان معراوي بجانب سيارة',
          lines: [
            '>interests', 
            'Linux', 
            'الكمبيوترات والهاردوير', 'وخارج عالم التكنولوجيا: بحب السيارات، الرياضة، الموسيقى، والتاريخ.'
          ]
        },
        {
          id: 'currently',
          image: '/about-currently.webp',
          imageAlt: 'كنان معراوي في أجواء مدينة',
          lines: [
            '>currently', 
            'عم حاول خلّص شغل الجامعة', 
            'بشتغل عمشاريع بتعلمني شي مفيد لما يكون عندي وقت'
          ]
        }
      ]
    },
    projects: {
      kicker: '> top_projects',
      stackCommand: 'stack:',
      stackItems: ['Java', 'Python', 'JavaScript', 'Haskell', 'C', 'SQL', 'Git', 'React', 'Next.js', 'Linux', 'TailwindCSS'],
      items: [
        {
          title: "Dorz 'Book a Ride'",
          image: '/8.png',
          github: 'https://github.com/KinanMaarrawi/DorzMVP',
          description: 'نسخة MVP لحجز الرحلات، بنيتها خلال تدريبي في DORZ.',
          tech: 'Kotlin'
        },
        {
          title: 'PM_CLI',
          image: '/7.png',
          github: 'https://github.com/KinanMaarrawi/PM_CLI',
          description: 'مدير كلمات مرور في الطرفية، بنيته لتعلم C ومبادئ التشفير.',
          tech: 'C'
        },
        {
          title: 'GWTIT',
          image: '/10.png',
          github: 'https://github.com/KinanMaarrawi/GWTIT',
          description: 'مشروع Flask يجمع بيانات جغرافية عن دولة ويعرضها بواجهة بسيطة.',
          tech: 'Flask'
        },
        {
          title: 'terra-tui',
          image: '/11.png',
          github: 'https://github.com/KinanMaarrawi/terra-tui',
          description: 'مستكشف تضاريس إجرائي وبيئة TUI للتجربة، مبني بلغة Haskell.',
          tech: 'Haskell'
        }
      ]
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
