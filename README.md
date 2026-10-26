# متجر كرز Karaz

## هيكل المجلد
- `index.html` الصفحة الرئيسية للمتجر (الأقسام والبحث والمفضلة).
- `assets/` التصميم والإعدادات. روابط التواصل في `assets/config.js`.
- `products/girls` و`products/boys` و`products/baby` كل منتج صفحة هبوط HTML داخل فولدر قسمه.
- `images/<اسم-المنتج>/` صور كل منتج.
- `products/products.js` فهرس المنتجات، يُنشأ تلقائيًا ولا يُعدَّل يدويًا.

## إضافة منتج جديد
1. أرسلي لي بيانات المنتج وصوره (الاسم، القسم، الوصف، المقاسات، الألوان، الخامة، رابط الشراء، التقييمات إن وجدت).
2. أنشئ لك صفحة الهبوط وصورها: ملف `products/<القسم>/<اسم>.html` وفولدر `images/<اسم>/`.
3. أضيفي الملف والفولدر إلى الـ repo على GitHub وارفعيهما (commit ثم push).
4. خلال دقيقة يشغّل GitHub ملف `.github/workflows/build-index.yml` فيحدّث `products/products.js` تلقائيًا، ويظهر المنتج في قسمه وفي البحث بدون تعديل أي ملف آخر.

لإخفاء منتج: غيّري `"hidden": false` إلى `true` في بيانات المنتج داخل ملفه. للحذف: احذفي ملفه وفولدر صوره.

## تشغيل يدوي (اختياري)
- `python3 tools/build-index.py` لتحديث الفهرس على جهازك.
- `python3 tools/new-landing.py tools/example-spec.json` لإنشاء صفحة من ملف مواصفات (انظري `tools/example-spec.json`).

## ملاحظة
لتفعيل التحديث التلقائي على GitHub: من Settings ← Actions ← General اختاري «Read and write permissions» ثم احفظي.
