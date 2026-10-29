/* إعدادات متجر كرز — عدّلي هذا الملف فقط لتغيير الروابط والأقسام.
   المنتجات لا تُكتب هنا: كل منتج صفحة هبوط HTML داخل مجلد products/<القسم>/. */
window.KARAZ_DATA = {
  products: [],          /* تُملأ تلقائيًا من مجلد products */

  /* مقالات النصائح: لا يظهر القسم إذا كانت القائمة فارغة. الشكل: {title, url, image} */
  articles: [],

  /* روابط التواصل الرسمية: أضيفي الروابط الحقيقية فقط */
  social: { facebook:"https://www.facebook.com/mybabykaraz", instagram:"https://www.instagram.com/karaz_kid", tiktok:"", youtube:"" },

  /* التواصل */
  contact: { email:"karazkid@gmail.com", whatsapp:"+201551767718" },

  /* النشرة البريدية: ضعي رابط الخدمة الفعلية لتفعيل النموذج */
  newsletterEndpoint: "",

  /* سياسة الاستبدال والإرجاع: اجعلي القيمة true فقط إذا كانت تنطبق فعلًا، واكتبي نصها في RETURNS_TEXT */
  returnsPolicy: false,
  RETURNS_TEXT: ""
};

/* الأقسام (هيكل الموقع). مفاتيح الأقسام الثلاثة تطابق أسماء المجلدات: girls / boys / baby */
window.KARAZ_CATEGORIES = {
  girls:{ name:"ملابس البنات", tagline:"إطلالات رقيقة ومميزة لكل يوم ومناسبة.", cta:"اكتشفي ملابس البنات", bg:"#fbe3e0", image:"images/site/cat-girls.webp",
    subs:["فساتين","تيشيرتات وبلوزات","بناطيل وليجنز","أطقم بناتي","بيجامات وملابس نوم","ملابس شتوية","ملابس صيفية"] },
  boys:{ name:"ملابس الأولاد", tagline:"راحة وحركة وأناقة طول اليوم.", cta:"اكتشف ملابس الأولاد", bg:"#dcecf4", image:"images/site/cat-boys.webp",
    subs:["تيشيرتات","بناطيل وشورتات","أطقم أولادي","سويت شيرت وهوديز","بيجامات وملابس نوم","ملابس شتوية","ملابس صيفية"] },
  baby:{ name:"ملابس البيبي", tagline:"نعومة تليق بأجمل البدايات.", cta:"اكتشفي ملابس البيبي", bg:"#e0e5d5", image:"images/site/cat-baby.webp",
    subs:["ملابس حديثي الولادة","سالوبيت ورومبير","أطقم البيبي","بودي وملابس داخلية","بيجامات","ملابس خروج"] }
};
window.KARAZ_EXTRA = [
  { key:"season", name:"ملابس الموسم", tagline:"اختيارات مناسبة لكل طقس.", cta:"تسوّقي ملابس الموسم", bg:"#fbf6f0", image:"images/site/cat-season.webp", href:"#/shop?season=1",
    subs:["ملابس صيفية","ملابس شتوية","جاكيتات","سويت شيرت","ملابس خفيفة للربيع"] },
  { key:"sets", name:"الأطقم المتكاملة", tagline:"إطلالة متناسقة بكل سهولة.", cta:"اكتشفي الأطقم", bg:"#e5dfef", image:"images/site/cat-sets.webp", href:"#/shop?sets=1",
    subs:["أطقم البنات","أطقم الأولاد","أطقم البيبي"] },
  { key:"offers", name:"العروض والخصومات", tagline:"اختيارات حلوة بأسعار مميزة.", cta:"اكتشفي العروض", bg:"#dae1ce", image:"images/site/cat-offers.webp", href:"#/shop?offers=1", subs:[] }
];
window.KARAZ_AGES = [
  { key:"0-12m", label:"من شهر إلى 12 شهرًا", em:"🍼" },
  { key:"1-2y",  label:"من سنة إلى سنتين",    em:"🧸" },
  { key:"3-5y",  label:"من 3 إلى 5 سنوات",   em:"🎈" },
  { key:"6-8y",  label:"من 6 إلى 8 سنوات",   em:"🎒" }
];
