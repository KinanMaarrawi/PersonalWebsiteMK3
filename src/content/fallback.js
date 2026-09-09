/**
 * Bundled copy of the site's content, shipped inside the JS bundle.
 *
 * This is what renders when Supabase is unreachable, unconfigured, or slow. It
 * mirrors the shape of a `projects` row so consumers never branch on the source
 * of the data. Keeping it in sync is optional — it exists so the site degrades to
 * a correct, complete page rather than an empty one.
 */

export const FALLBACK_PROJECTS = [
  {
    id: 'fallback-jawab',
    sort_order: 10,
    published: true,
    title: 'Jawab',
    github_url: 'https://github.com/KinanMaarrawi/jawab',
    tech: 'Python + React',
    image_path: '/answer.webp',
    description_en:
      'AI-powered semantic search over the Quran that answers a question with a composed reading of related verses.',
    description_ar:
      'بحث دلالي في القرآن مدعوم بالذكاء الاصطناعي، يجيب عن سؤالك بقراءة مركّبة من آيات مترابطة.'
  },
  {
    id: 'fallback-sabener',
    sort_order: 20,
    published: true,
    title: 'Säbener',
    github_url: 'https://github.com/KinanMaarrawi/Sabener',
    tech: 'React + Express',
    image_path: '/13.webp',
    description_en:
      'Live FC Bayern dashboard — news, matchday and youth-academy deep cuts, with German headlines auto-translated.',
    description_ar:
      'لوحة متابعة مباشرة لبايرن ميونخ: أخبار، مباريات، وأخبار أكاديمية الشباب، مع ترجمة تلقائية للعناوين الألمانية.'
  },
  {
    id: 'fallback-dorz',
    sort_order: 30,
    published: true,
    title: "Dorz 'Book a Ride'",
    github_url: 'https://github.com/KinanMaarrawi/DorzMVP',
    tech: 'Kotlin',
    image_path: '/8.webp',
    description_en: 'Ride-booking MVP built for my Internship @ DORZ.',
    description_ar: 'نسخة MVP لحجز الرحلات، بنيتها خلال تدريبي في DORZ.'
  },
  {
    id: 'fallback-terra-tui',
    sort_order: 40,
    published: true,
    title: 'terra-tui',
    github_url: 'https://github.com/KinanMaarrawi/terra-tui',
    tech: 'Haskell',
    image_path: '/11.webp',
    description_en: 'A procedural terrain explorer and TUI sandbox, built in Haskell.',
    description_ar: 'مستكشف تضاريس إجرائي وبيئة TUI للتجربة، مبني بلغة Haskell.'
  }
];

export const FALLBACK_SETTINGS = {
  email: 'kinan@maarrawi.com',
  linkedin_url: 'https://www.linkedin.com/in/kinan-maarrawi/',
  github_url: 'https://github.com/KinanMaarrawi',
  cv_url: '/CV.pdf',
  cv_updated_at: null
};
