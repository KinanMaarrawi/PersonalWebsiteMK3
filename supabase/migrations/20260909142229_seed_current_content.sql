-- Seeds the content currently hardcoded in src/i18n.js.
-- image_path values beginning with "/" are resolved by the frontend as bundled
-- assets in public/; anything else is treated as a storage object path. This
-- lets the existing images keep working without re-uploading them.

insert into public.projects
  (sort_order, published, title, github_url, tech, image_path, description_en, description_ar)
values
  (10, true, 'Jawab', 'https://github.com/KinanMaarrawi/jawab', 'Python + React', '/answer.webp',
   'AI-powered semantic search over the Quran that answers a question with a composed reading of related verses.',
   'بحث دلالي في القرآن مدعوم بالذكاء الاصطناعي، يجيب عن سؤالك بقراءة مركّبة من آيات مترابطة.'),
  (20, true, 'Säbener', 'https://github.com/KinanMaarrawi/Sabener', 'React + Express', '/13.webp',
   'Live FC Bayern dashboard — news, matchday and youth-academy deep cuts, with German headlines auto-translated.',
   'لوحة متابعة مباشرة لبايرن ميونخ: أخبار، مباريات، وأخبار أكاديمية الشباب، مع ترجمة تلقائية للعناوين الألمانية.'),
  (30, true, 'Dorz ''Book a Ride''', 'https://github.com/KinanMaarrawi/DorzMVP', 'Kotlin', '/8.webp',
   'Ride-booking MVP built for my Internship @ DORZ.',
   'نسخة MVP لحجز الرحلات، بنيتها خلال تدريبي في DORZ.'),
  (40, true, 'terra-tui', 'https://github.com/KinanMaarrawi/terra-tui', 'Haskell', '/11.webp',
   'A procedural terrain explorer and TUI sandbox, built in Haskell.',
   'مستكشف تضاريس إجرائي وبيئة TUI للتجربة، مبني بلغة Haskell.');

insert into public.site_settings (id, email, linkedin_url, github_url)
values (1, 'kinan@maarrawi.com',
        'https://www.linkedin.com/in/kinan-maarrawi/',
        'https://github.com/KinanMaarrawi')
on conflict (id) do nothing;
