/* البيانات الافتراضية (تجريبية). تُستبدل بالكامل من لوحة الإدارة. */
window.DEFAULT_DATA = {
  meta: { demo: true },
  settings: {
    name: 'GRAVITY Agency', logo: 'assets/logo.png', footerLogo: '', placeholder: '',
    whatsapp: '', currency: 'ج.م', font: 'Readex Pro',
    seoTitle: 'GRAVITY Agency | تسويق وتصميم للمدرسين وأصحاب الأنشطة',
    seoDesc: 'وكالة تسويق وتصميم: إدارة صفحات، تصميمات، ريلز، ثمنيلات، أغلفة مذكرات ومنصات تعليمية.',
    colors: { brown: '#3b2a20', brownDark: '#241812', beige: '#f3ebdd', sand: '#e6d8c0', accent: '#b07a46', white: '#fffdf9' }
  },
  nav: [
    { label: 'الرئيسية', href: '#hero', visible: true },
    { label: 'أعمالنا', href: '#portfolio', visible: true, dropdown: 'categories' },
    { label: 'خدماتنا', href: '#services', visible: true },
    { label: 'الباقات', href: '#packages', visible: true },
    { label: 'خصص باقتك', href: '#builder', visible: true },
    { label: 'العروض', href: '#offers', visible: true },
    { label: 'من نحن', href: '#about', visible: true },
    { label: 'تواصل معنا', href: '#contact', visible: true }
  ],
  navCta: { text: 'اطلب خدمتك', link: '' },
  sections: [
    { id: 'hero', title: 'الرئيسية', subtitle: '', visible: true },
    { id: 'portfolio', title: 'أعمالنا', subtitle: 'نماذج من تصميماتنا وفيديوهاتنا ومنصاتنا والصفحات التي ندير تسويقها.', visible: true },
    { id: 'services', title: 'خدماتنا', subtitle: 'كل ما يحتاجه نشاطك التعليمي أو التجاري تحت سقف واحد.', visible: true },
    { id: 'packages', title: 'الباقات', subtitle: 'اختر الباقة المناسبة لحجم نشاطك.', visible: true },
    { id: 'builder', title: 'خصص باقتك', subtitle: 'اختر الخدمات والكميات وشاهد السعر يتغير مباشرة.', visible: true },
    { id: 'offers', title: 'العروض', subtitle: 'عروض لفترة محدودة.', visible: true },
    { id: 'about', title: 'من نحن', subtitle: '', visible: true },
    { id: 'testimonials', title: 'آراء العملاء', subtitle: '', visible: true },
    { id: 'faq', title: 'الأسئلة الشائعة', subtitle: '', visible: true },
    { id: 'contact', title: 'تواصل معنا', subtitle: '', visible: true }
  ],
  hero: {
    title: 'نصنع حضورًا رقميًا يجذب عملاءك ويبني ثقتهم',
    text: 'GRAVITY Agency وكالة تسويق وتصميم للمدرسين وأصحاب الأنشطة التجارية: إدارة صفحات، تصميمات، ريلز، ثمنيلات، أغلفة مذكرات ومنصات تعليمية.',
    btn1Text: 'اطلب خدمتك الآن', btn1Link: '', btn2Text: 'شاهد أعمالنا', btn2Link: '#portfolio', image: ''
  },
  categories: [
    { id: 'designs', name: 'التصميمات', visible: true, ratio: '4/3', fit: 'cover' },
    { id: 'reels', name: 'الريلز والفيديوهات', visible: true, ratio: '9/16', fit: 'cover' },
    { id: 'covers', name: 'أغلفة المذكرات والملازم', visible: true, ratio: '3/4', fit: 'contain' },
    { id: 'platforms', name: 'المنصات التعليمية', visible: true, ratio: '16/10', fit: 'cover' },
    { id: 'pages', name: 'الصفحات التي نديرها', visible: true, ratio: '1/1', fit: 'cover' },
    { id: 'thumbs', name: 'YouTube Thumbnails — الثمنيلات', visible: true, ratio: '16/9', fit: 'contain' }
  ],
  projects: [
    { id: 'p1', cat: 'designs', title: 'مثال: تصميم بوست إعلاني', client: 'عميل تجريبي', desc: 'مشروع توضيحي — استبدله بعملك الحقيقي من لوحة الإدارة.', image: '', gallery: [], video: '', link: '', featured: true, visible: true },
    { id: 'p2', cat: 'reels', title: 'مثال: ريل تعريفي', client: 'عميل تجريبي', desc: 'مشروع توضيحي — أضف رابط فيديو يوتيوب أو ارفع فيديو.', image: '', gallery: [], video: '', link: '', featured: false, visible: true },
    { id: 'p3', cat: 'covers', title: 'مثال: غلاف مذكرة', client: 'مدرس تجريبي', desc: 'مشروع توضيحي لغلاف مذكرة.', image: '', gallery: [], video: '', link: '', featured: false, visible: true },
    { id: 'p4', cat: 'platforms', title: 'مثال: منصة تعليمية', client: 'منصة تجريبية', desc: 'مشروع توضيحي. أضف لقطة شاشة ورابط المنصة.', image: '', gallery: [], video: '', link: '', featured: false, visible: true },
    { id: 'p5', cat: 'pages', title: 'مثال: صفحة نديرها', client: 'عميل تجريبي', desc: 'إدارة محتوى وإعلانات (مثال).', image: '', gallery: [], video: '', link: '', featured: false, visible: true },
    { id: 'p6', cat: 'thumbs', title: 'مثال: ثمنيل يوتيوب', client: 'قناة تجريبية', desc: 'مشروع توضيحي بنسبة 16:9.', image: '', gallery: [], video: '', link: '', featured: false, visible: true }
  ],
  services: [
    ['📣', 'إدارة صفحات السوشيال ميديا', 'إدارة يومية لصفحاتك: نشر وردود ومتابعة تفاعل.', 1500, 'شهريًا'],
    ['🗓️', 'إدارة المحتوى وخطط النشر', 'خطة محتوى شهرية مرتبة بأهداف واضحة.', 800, 'شهريًا'],
    ['🎨', 'تصميم البوستات والإعلانات', 'تصميمات سوشيال ميديا وإعلانات بهوية موحدة.', 60, 'للتصميم'],
    ['📘', 'تصميم أغلفة المذكرات والملازم', 'أغلفة جذابة للمذكرات والكتب التعليمية.', 250, 'للغلاف'],
    ['🖼️', 'تصميم YouTube Thumbnails', 'ثمنيلات تزيد من نسبة النقر على فيديوهاتك.', 80, 'للثمنيل'],
    ['🎓', 'تصميم الكروت والشهادات', 'كروت وشهادات تقدير وتفوق جاهزة للطباعة.', 70, 'للتصميم'],
    ['🎥', 'تصوير الحصص التعليمية', 'تصوير احترافي للحصص والمحاضرات.', 400, 'للساعة'],
    ['📱', 'تصوير وإنتاج الريلز', 'أفكار وتصوير وإنتاج ريلز قصيرة.', 200, 'للريل'],
    ['✂️', 'مونتاج الفيديوهات', 'مونتاج وتلوين وإضافة عناصر جرافيك.', 150, 'للفيديو'],
    ['🎯', 'إدارة الحملات الإعلانية', 'إعداد ومتابعة وتحسين الحملات الممولة.', 1200, 'شهريًا'],
    ['💻', 'إنشاء وإدارة المنصات التعليمية', 'منصة تعليمية متكاملة باسمك.', 0, ''],
    ['✨', 'خدمات تصميم وتسويق إضافية', 'لديك طلب خاص؟ تواصل معنا ونصمم لك الحل.', 0, '']
  ].map((a, i) => ({ id: 's' + (i + 1), icon: a[0], title: a[1], desc: a[2], price: a[3], unit: a[4], image: '', btnText: 'اطلب الخدمة', link: '', active: true })),
  packages: [
    { id: 'k1', name: 'الأساسية', desc: 'بداية مناسبة للمدرس أو النشاط الصغير.', price: 1800, oldPrice: 2200, period: 'شهريًا', features: ['إدارة صفحة واحدة', '8 تصميمات شهريًا', 'خطة نشر شهرية'], image: '', btnText: 'اطلب الباقة', link: '', popular: false, active: true },
    { id: 'k2', name: 'النمو', desc: 'الأنسب لمن يريد حضورًا أقوى.', price: 3500, oldPrice: 4200, period: 'شهريًا', features: ['إدارة صفحتين', '16 تصميمًا شهريًا', '4 ريلز شهريًا', 'ثمنيلات يوتيوب', 'تقرير أداء شهري'], image: '', btnText: 'اطلب الباقة', link: '', popular: true, active: true },
    { id: 'k3', name: 'الاحترافية', desc: 'حل متكامل للمنصات والمراكز.', price: 6500, oldPrice: 0, period: 'شهريًا', features: ['إدارة كاملة للصفحات', 'تصميمات وريلز بكميات أكبر', 'حملات إعلانية ممولة', 'تصوير حصص تعليمية'], image: '', btnText: 'اطلب الباقة', link: '', popular: false, active: true }
  ],
  builder: [
    ['إدارة صفحات السوشيال ميديا', 'نشر وردود ومتابعة', 1500, 'شهر', 'qty', 1, 12],
    ['تصميم البوستات', 'بوست واحد بهوية موحدة', 60, 'تصميم', 'qty', 1, 100],
    ['تصميم أغلفة المذكرات والملازم', 'غلاف واحد', 250, 'غلاف', 'qty', 1, 50],
    ['تصميم الثمنيلات', 'ثمنيل يوتيوب واحد', 80, 'ثمنيل', 'qty', 1, 100],
    ['تصميم الكروت والشهادات', 'كارت أو شهادة', 70, 'تصميم', 'qty', 1, 100],
    ['تصوير الحصص التعليمية', 'تصوير بالساعة', 400, 'ساعة', 'qty', 1, 40],
    ['تصوير وإنتاج الريلز', 'ريل واحد', 200, 'ريل', 'qty', 1, 60],
    ['مونتاج الفيديوهات', 'فيديو واحد', 150, 'فيديو', 'qty', 1, 60],
    ['كتابة المحتوى', 'مجموعة 10 منشورات', 300, 'مجموعة (10 منشورات)', 'qty', 1, 20],
    ['إعداد خطة النشر', 'خطة شهرية', 800, 'خطة', 'fixed', 1, 1],
    ['إدارة الإعلانات الممولة', 'إعداد ومتابعة الحملات', 1200, 'شهر', 'qty', 1, 12],
    ['إنشاء المنصات التعليمية', 'سعر ثابت — يُتفق عليه بعد المعاينة', 0, 'مشروع', 'fixed', 1, 1]
  ].map((a, i) => ({ id: 'b' + (i + 1), name: a[0], desc: a[1], price: a[2], unitLabel: a[3], mode: a[4], min: a[5], max: a[6], active: true })),
  offers: [
    { id: 'o1', title: 'عرض تجريبي: خصم على باقة النمو', desc: 'عرض توضيحي — عدّل بياناته أو احذفه.', image: '', oldPrice: 4200, discount: 15, price: 3570, start: '', end: '', packageIds: ['k2'], serviceIds: [], btnText: 'احصل على العرض', link: '', active: true, visible: true }
  ],
  about: {
    title: 'نبني حضورًا رقميًا يشبهك',
    text: 'GRAVITY Agency وكالة تسويق وتصميم تعمل مع المدرسين وأصحاب الأنشطة التجارية لتحويل أفكارهم إلى محتوى وتصميمات وحملات تصل لجمهورهم.',
    vision: 'أن نكون الشريك الأول للمدرسين وأصحاب الأنشطة في بناء حضور رقمي مؤثر.',
    mission: 'تقديم خدمات تسويق وتصميم واضحة ومنظمة تساعد عملاءنا على النمو.',
    features: ['خدمات متكاملة في مكان واحد', 'هوية موحدة لكل أعمالك', 'أسعار وباقات واضحة', 'تواصل مباشر عبر واتساب'],
    audience: ['المدرسون والمعلمون', 'المراكز والمنصات التعليمية', 'أصحاب الأنشطة التجارية', 'صنّاع المحتوى'],
    image: '', ctaText: 'ابدأ معنا', ctaLink: ''
  },
  testimonials: [],
  faq: [
    { q: 'كيف أطلب خدمة أو باقة؟', a: 'اضغط زر الطلب وستفتح رسالة واتساب جاهزة، أرسلها لنا ونتواصل معك للتأكيد.', visible: true },
    { q: 'هل يمكنني تخصيص باقة خاصة بي؟', a: 'نعم، من قسم «خصص باقتك» اختر الخدمات والكميات وسيظهر الإجمالي مباشرة.', visible: true },
    { q: 'هل إرسال رسالة واتساب يعني تأكيد الطلب؟', a: 'لا، الرسالة طلب مبدئي، ويتم تأكيد التفاصيل والسعر النهائي بعد التواصل معنا.', visible: true },
    { q: 'هل تقدمون خدماتكم لأنشطة غير تعليمية؟', a: 'نعم، نخدم أيضًا أصحاب الأنشطة التجارية وصنّاع المحتوى.', visible: true }
  ],
  faqVisible: true,
  contact: {
    title: 'جاهز نبدأ مشروعك؟', text: 'راسلنا على واتساب أو اترك بياناتك وسنرد عليك.', email: '', formEnabled: true,
    socials: [
      { label: 'Facebook', url: '', active: true }, { label: 'Instagram', url: '', active: true },
      { label: 'TikTok', url: '', active: true }, { label: 'YouTube', url: '', active: true }
    ]
  },
  footer: { text: 'وكالة تسويق وتصميم للمدرسين وأصحاب الأنشطة التجارية.', copyright: '© جميع الحقوق محفوظة — GRAVITY Agency' }
};
