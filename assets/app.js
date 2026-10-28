(function(){
"use strict";
let loaded=false;
const D = window.KARAZ_DATA, CATS = window.KARAZ_CATEGORIES, EXTRA = window.KARAZ_EXTRA, AGES = window.KARAZ_AGES;
const $ = (s,r=document)=>r.querySelector(s);
const esc = s => String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money = n => Number(n).toLocaleString("ar-EG")+" ج.م";
const catName = k => (CATS[k]||{}).name || "";
const catShort = k => ({girls:"بنات",boys:"أولاد",baby:"بيبي"}[k]||"");
const hasOffer = p => p.oldPrice && p.price && p.oldPrice>p.price;
const offPct = p => Math.round((1-p.price/p.oldPrice)*100);

/* ---------- أيقونات ورسومات ---------- */
const ICON = {
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.800-8 11-8 11z"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  comfy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3 3 6l2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0z"/></svg>',
  variety:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>',
  tag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.500" cy="8" r="1.200"/></svg>',
  love:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 21s-8-5.200-8-11a4.600 4.600 0 0 1 8-3 4.600 4.600 0 0 1 8 3c0 5.800-8 11-8 11z"/></svg>'
};
const cherry = (w=44)=>`<svg width="${w}" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8c-4 10-10 20-14 30M32 8c3 10 8 20 14 30" stroke="#6BA86B" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 8c8-6 18-4 22 2-8 2-16 2-22-2z" fill="#6BA86B"/><circle cx="17" cy="45" r="11" fill="#E9A6A0"/><circle cx="47" cy="43" r="11" fill="#d98981"/><circle cx="13.500" cy="41" r="2.500" fill="#fff" opacity=".6"/><circle cx="43.500" cy="39" r="2.500" fill="#fff" opacity=".6"/></svg>`;
const garment = (kind,c1="#E9A6A0",c2="#fff")=>{
  const p={
    dress:`<path d="M42 14l-8 10h-6l-8-10-8 6 8 14-6 38h44l-6-38 8-14z" fill="${c1}"/><path d="M28 24h6" stroke="${c2}" stroke-width="3"/><path d="M20 62h30" stroke="${c2}" stroke-width="2" stroke-dasharray="3 4"/>`,
    tee:`<path d="M24 12l-16 8 6 14 8-3v40h32V31l8 3 6-14-16-8c-2 6-6 9-14 9s-12-3-14-9z" fill="${c1}"/><path d="M40 36l3 5 5 .8-3.600 3.600.9 5-4.300-2.400-4.300 2.400.9-5L32 41.800l5-.8z" fill="${c2}" opacity=".9"/>`,
    romper:`<path d="M26 12c0 6 4 9 9 9s9-3 9-9l12 6-4 14-6-1v14l8 24H48l-5-14h-2l-5 14H20l8-24V31l-6 1-4-14z" fill="${c1}" transform="translate(-4 0)"/><circle cx="35" cy="34" r="2.500" fill="${c2}"/><circle cx="35" cy="42" r="2.500" fill="${c2}"/>`,
    star:`<path d="M35 8l7 16 17 2-13 12 4 17-15-9-15 9 4-17L11 26l17-2z" fill="${c1}"/>`
  };
  return `<svg viewBox="0 0 70 80" aria-hidden="true">${p[kind]||p.tee}</svg>`;
};
const catArt = k => ({
  girls:garment("dress","#E9A6A0"), boys:garment("tee","#1F4E5F","#B7CFA1"), baby:garment("romper","#B7CFA1","#FFF9F0"),
  season:garment("star","#E0A43A"), sets:garment("dress","#C79AB5"), offers:cherry(70)
}[k]||garment("tee"));
const logoMark = `<svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" fill="#FFF9F0" stroke="#B7CFA1" stroke-width="2"/><path d="M33 14c-3 8-8 16-11 25M33 14c2 8 6 16 11 25" stroke="#6BA86B" stroke-width="2.600" fill="none" stroke-linecap="round"/><path d="M33 14c6-5 14-3 17 2-6 1-12 1-17-2z" fill="#6BA86B"/><circle cx="21" cy="44" r="9" fill="#E9A6A0"/><circle cx="44" cy="42" r="9" fill="#d98981"/></svg>`;

/* ---------- المفضلة ---------- */
const favs = {
  get(){ try{return JSON.parse(localStorage.getItem("karaz_favs")||"[]")}catch(e){return []} },
  set(a){ try{localStorage.setItem("karaz_favs",JSON.stringify(a))}catch(e){} },
  has(id){ return this.get().includes(id) },
  toggle(id){ let a=this.get(); a=a.includes(id)?a.filter(x=>x!==id):[...a,id]; this.set(a); return a.includes(id); }
};
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(toast.t); toast.t=setTimeout(()=>t.classList.remove("show"),2200); }

/* ---------- مكوّنات قابلة لإعادة الاستخدام ---------- */
function Header(){
  const navCats = Object.entries(CATS).map(([k,c])=>`
    <li><a class="nav-link" href="#/shop?cat=${k}" data-nav="${k}">${c.name}</a>
      <ul class="dropdown">${c.subs.map(s=>`<li><a href="#/shop?cat=${k}&sub=${encodeURIComponent(s)}">${s}</a></li>`).join("")}</ul></li>`).join("");
  const drawerCats = Object.entries(CATS).map(([k,c])=>`
    <li><details><summary>${c.name}</summary><ul><li><a href="#/shop?cat=${k}">كل ${c.name}</a></li>${c.subs.map(s=>`<li><a href="#/shop?cat=${k}&sub=${encodeURIComponent(s)}">${s}</a></li>`).join("")}</ul></details></li>`).join("");
  return `
  <header class="site-header">
    <div class="container header-row">
      <a href="#/" class="logo" aria-label="كرز Karaz — الرئيسية">${logoMark}
        <span class="logo-text"><b>كرز<span>Karaz</span></b><small>حلاوة طفولتهم.. في كل تفصيلة</small></span></a>
      <nav class="main-nav" aria-label="القائمة الرئيسية"><ul>
        <li><a class="nav-link" href="#/" data-nav="home">الرئيسية</a></li>
        ${navCats}
        <li><a class="nav-link" href="#/shop?offers=1" data-nav="offers">العروض والخصومات</a></li>
        <li><a class="nav-link" href="#/about" data-nav="about">من نحن</a></li>
        <li><a class="nav-link" href="#/contact" data-nav="contact">تواصل معنا</a></li>
      </ul></nav>
      <div class="header-tools">
        <button class="icon-btn" id="searchToggle" aria-label="بحث" aria-expanded="false">${ICON.search}</button>
        <a class="icon-btn" href="#/favorites" aria-label="المفضلة">${ICON.heart}<span class="badge" id="favBadge" hidden>0</span></a>
        <button class="icon-btn burger" id="burger" aria-label="فتح القائمة">${ICON.menu}</button>
      </div>
    </div>
    <div class="search-bar" id="searchBar"><div class="container">
      <form id="searchForm" role="search"><input type="search" id="searchInput" placeholder="ابحثي باسم المنتج أو النوع أو القسم" aria-label="بحث عن المنتجات"><button class="btn btn-primary" type="submit">بحث</button></form>
    </div></div>
  </header>
  <div class="drawer-bg" id="drawerBg"></div>
  <aside class="drawer" id="drawer" aria-label="القائمة الجانبية" aria-hidden="true">
    <button class="icon-btn close" id="drawerClose" aria-label="إغلاق">${ICON.close}</button>
    <ul>
      <li><a href="#/">الرئيسية</a></li>${drawerCats}
      <li><a href="#/shop?offers=1">العروض والخصومات</a></li>
      <li><a href="#/about">من نحن</a></li>
      <li><a href="#/contact">تواصل معنا</a></li>
      <li><a href="#/favorites">المفضلة</a></li>
    </ul>
  </aside>`;
}
function socialLinks(){
  const names={facebook:"فيسبوك",instagram:"إنستجرام",tiktok:"تيك توك",youtube:"يوتيوب"};
  const wa=D.contact.whatsapp?`<a href="https://wa.me/${esc(D.contact.whatsapp.replace(/\D/g,""))}" target="_blank" rel="noopener noreferrer">واتساب</a>`:"";
  return Object.entries(D.social).filter(([,u])=>u).map(([k,u])=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${names[k]||k}</a>`).join("")+wa;
}
function Footer(){
  const soc = socialLinks();
  const aff = D.products.some(p=>p.buyType==="affiliate");
  return `<footer class="site-footer"><div class="container">
    <div class="foot-grid">
      <div><a href="#/" class="logo">${logoMark}<span class="logo-text"><b>كرز<span>Karaz</span></b></span></a>
        <p style="margin-top:10px"><b>كرز — حلاوة طفولتهم.. في كل تفصيلة</b></p>
        <p class="foot-tag">«أناقة تبدأ من الطفولة»</p>
        <p>اختيارات متنوعة من ملابس الأطفال، لتكتشفي ما يناسب طفلك بسهولة.</p>
        ${aff?'<p class="disclosure">بعض الروابط في الموقع هي روابط عمولة؛ قد نحصل على عمولة عند الشراء عبرها دون أي تكلفة إضافية عليكِ.</p>':''}</div>
      <div><h4>تسوّقي</h4><ul>
        <li><a href="#/shop?cat=girls">ملابس البنات</a></li><li><a href="#/shop?cat=boys">ملابس الأولاد</a></li>
        <li><a href="#/shop?cat=baby">ملابس البيبي</a></li><li><a href="#/shop?season=1">ملابس الموسم</a></li>
        <li><a href="#/shop?offers=1">العروض والخصومات</a></li></ul></div>
      <div><h4>معلومات</h4><ul>
        <li><a href="#/about">من نحن</a></li><li><a href="#/contact">تواصل معنا</a></li>
        <li><a href="#/faq">الأسئلة الشائعة</a></li><li><a href="#/privacy">سياسة الخصوصية</a></li>
        ${D.returnsPolicy?'<li><a href="#/returns">سياسة الاستبدال والإرجاع</a></li>':''}</ul></div>
      <div><h4>تابعينا</h4>${soc?`<div class="socials" style="justify-content:flex-start">${soc}</div>`:'<p>سنضيف حساباتنا الرسمية هنا قريبًا.</p>'}</div>
    </div>
    <div class="foot-bottom">© كرز Karaz — جميع الحقوق محفوظة.</div>
  </div></footer>`;
}
function ProductCard(p){
  const img = p.images&&p.images[0] ? `<img src="${esc(p.images[0])}" alt="${esc(p.name)} — ${esc(catName(p.category))}" loading="lazy" width="400" height="400">` : garment("tee");
  const isFav = favs.has(p.id);
  const ages = (p.ages||[]).map(a=>(AGES.find(x=>x.key===a)||{}).label).filter(Boolean);
  const meta = p.sizes&&p.sizes.length ? "المقاسات: "+p.sizes.join("، ") : ages.join(" · ");
  return `<article class="prod-card">
    <a href="${esc(p.url||"#/shop")}" class="prod-img" aria-label="${esc(p.name)}">${img}</a>
    ${hasOffer(p)?`<span class="tag-off">خصم ${offPct(p)}٪</span>`:''}
    <button class="fav" data-fav="${esc(p.id)}" aria-pressed="${isFav}" aria-label="إضافة ${esc(p.name)} إلى المفضلة">${ICON.heart}</button>
    <div class="prod-body">
      <span class="prod-cat">${catShort(p.category)}</span>
      <h3><a href="${esc(p.url||"#/shop")}">${esc(p.name)}</a></h3>
      ${meta?`<span class="prod-meta">${esc(meta)}</span>`:''}
      ${p.rating?`<span class="stars" aria-label="التقييم ${p.rating} من 5">${"★".repeat(Math.round(p.rating))}</span>`:''}
      ${p.price?`<div class="price">${money(p.price)}${hasOffer(p)?`<del>${money(p.oldPrice)}</del>`:''}</div>`:''}
      <a class="btn btn-ghost btn-sm" href="${esc(p.url||"#/shop")}">عرض التفاصيل</a>
    </div></article>`;
}
function Empty(msg,withBtn){
  return `<div class="empty">${cherry(70)}<p>${msg}</p>${withBtn?'<a class="btn btn-primary btn-sm" href="#/shop">تصفحي كل الأقسام</a>':''}</div>`;
}
function ProductGrid(list,cls=""){
  return `<div class="prod-grid ${cls}">${list.length?list.map(ProductCard).join(""):Empty(loaded?"جاري تجهيز المنتجات.. تابعينا قريبًا لاكتشاف الجديد 🍒":"جاري تحميل المنتجات..")}</div>`;
}
function PageHead(title,desc,crumb){
  return `<div class="page-head"><div class="container"><div class="crumbs"><a href="#/">الرئيسية</a> ‹ ${crumb||title}</div><h1>${title}</h1>${desc?`<p>${desc}</p>`:''}</div></div>`;
}

/* ---------- الصفحات ---------- */
function Home(){
  const marq = ["جودة وراحة لطفلك في كل تفصيلة.","عروض وخصومات مميزة.","اختيارات متنوعة لكل الأعمار.","أناقة صغيرة.. وفرحة كبيرة."];
  const mk = marq.map(t=>`<span class="marquee-item">${t}</span>`).join("");
  const feats=[["comfy","راحة في كل اختيار","ملابس تناسب حركة طفلك ويومه."],["variety","تشكيلة متنوعة","اختيارات للبنات والأولاد والبيبي."],["tag","عروض مميزة","تابعي أحدث العروض المتاحة."],["love","اختيارات بحب","تفاصيل صغيرة تصنع فرحة كبيرة."]];
  const catCards = [
    ...Object.entries(CATS).map(([k,c])=>({key:k,...c,href:`#/shop?cat=${k}`})),
    ...EXTRA
  ].map(c=>`<article class="cat-card"><a class="cat-media" href="${c.href}" style="background:${c.bg}" aria-label="${c.name}">
      ${c.image?`<img src="${esc(c.image)}" alt="${esc(c.name)}" loading="lazy">`:catArt(c.key)}</a>
    <div class="cat-body"><h3>${c.name}</h3><p>${c.tagline}</p>
      ${c.subs.length?`<div class="cat-subs">${c.subs.slice(0,4).map(s=>`<a href="${c.href}${CATS[c.key]?`&sub=${encodeURIComponent(s)}`:''}">${s}</a>`).join("")}</div>`:''}
      <a class="btn btn-primary btn-sm" href="${c.href}">${c.cta}</a></div></article>`).join("");
  const featured = D.products.filter(p=>p.featured).slice(0,4);
  const featList = featured.length?featured:D.products.slice(0,4);
  const fresh = [...D.products].filter(p=>p.createdAt).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,4);
  const tips = D.articles.length?`<section class="block"><div class="container"><div class="sec-head"><h2>نصائح صغيرة.. لراحة أكبر</h2><p>محتوى بسيط يساعدك في اختيار الأنسب لطفلك.</p></div>
    <div class="tips-grid">${D.articles.slice(0,4).map(a=>`<a class="tip" href="${esc(a.url)}"><div class="tip-img">${a.image?`<img src="${esc(a.image)}" alt="${esc(a.title)}" loading="lazy">`:''}</div><div class="b"><h3>${esc(a.title)}</h3></div></a>`).join("")}</div></div></section>`:"";
  return `
  <div class="marquee" aria-label="عبارات ترحيبية"><div class="marquee-track" aria-hidden="false">${mk}${mk}${mk}${mk}</div></div>
  <section class="hero"><div class="container hero-grid">
    <div><span class="eyebrow">اختيارات بحب.. لطفلك</span>
      <h1>حلاوة <em>طفولتهم</em>.. في كل تفصيلة</h1>
      <p>اكتشفي تشكيلة متنوعة من ملابس الأطفال، تجمع بين الأناقة والراحة، واختاري لأطفالك إطلالات تناسب كل يوم وكل مناسبة.</p>
      <div class="hero-actions"><a class="btn btn-primary" href="#categories" data-scroll="categories">اكتشفي التشكيلة</a><a class="btn btn-ghost" href="#/shop?offers=1">تصفحي العروض</a></div></div>
    <div class="hero-art" aria-hidden="true"><div class="blob"></div>
      <svg class="scene" viewBox="0 0 400 400"><g transform="translate(40 60) scale(2.1)">${garment("dress","#E9A6A0").replace('<svg viewBox="0 0 70 80" aria-hidden="true">','').replace('</svg>','')}</g>
      <g transform="translate(205 140) scale(1.7)">${garment("tee","#1F4E5F","#B7CFA1").replace('<svg viewBox="0 0 70 80" aria-hidden="true">','').replace('</svg>','')}</g>
      <g transform="translate(290 40) scale(1.2)"><path d="M32 8c-4 10-10 20-14 30M32 8c3 10 8 20 14 30" stroke="#6BA86B" stroke-width="3" fill="none"/><circle cx="17" cy="45" r="11" fill="#E9A6A0"/><circle cx="47" cy="43" r="11" fill="#d98981"/></g></svg></div>
  </div></section>
  <section class="features"><div class="container"><div class="features-grid">
    ${feats.map(f=>`<div class="feature"><span class="ic">${ICON[f[0]]}</span><div><h3>${f[1]}</h3><p>${f[2]}</p></div></div>`).join("")}</div></div></section>
  <section class="block" id="categories"><div class="container"><div class="sec-head"><h2>اختاري لطفلك أحلى إطلالة 🍒</h2><p>كل اللي بتحبيه لطفلك في مكان واحد.</p></div>
    <div class="cat-grid">${catCards}</div></div></section>
  <section class="block alt"><div class="container"><div class="sec-head"><h2>اختيارات كرز المميزة</h2><p>اكتشفي قطعًا لطيفة تناسب تفاصيل يوم طفلك.</p></div>${ProductGrid(featList)}</div></section>
  ${fresh.length?`<section class="block"><div class="container"><div class="sec-head"><h2>وصل حديثًا إلى كرز</h2><p>أحدث الاختيارات الصغيرة اللي هتحبي تكتشفيها.</p></div>${ProductGrid(fresh)}
    <p style="text-align:center;margin-top:22px"><a class="btn btn-ghost" href="#/shop?sort=new">شاهدي كل المنتجات الجديدة</a></p></div></section>`:''}
  <section class="block ${fresh.length?'alt':''}"><div class="container"><div class="promo">
    <span class="deco d1">${cherry(90)}</span><span class="deco d2">${cherry(90)}</span>
    <h2>اختيارات حلوة.. وعروض تستاهل</h2><p>تابعي المنتجات المتاحة والعروض الحالية، واختاري اللي يناسب ذوقك وميزانيتك.</p>
    <a class="btn btn-primary" href="#/shop?offers=1">تصفحي العروض</a></div></div></section>
  <section class="block"><div class="container"><div class="sec-head"><h2>لكل مرحلة حكاية</h2><p>اختاري حسب عمر طفلك.</p></div>
    <div class="age-grid">${AGES.map(a=>`<a class="age-card" href="#/shop?age=${a.key}"><span class="em" aria-hidden="true">${a.em}</span><b>${a.label}</b><span>اكتشفي الملابس المناسبة</span></a>`).join("")}</div></div></section>
  <section class="block alt"><div class="container why">
    <div><h2>كرز.. اختيارات بحب لطفولتهم</h2>
      <p>في كرز، بنحب التفاصيل الصغيرة اللي بتخلي طفولة أولادنا أجمل. علشان كده بنجمع لك اختيارات متنوعة من ملابس الأطفال، تساعدك تكتشفي الإطلالة المناسبة لطفلك بسهولة.</p>
      <ul><li>تنوع في اختيارات ملابس الأطفال.</li><li>أقسام منظمة تسهّل الوصول للمنتجات.</li><li>تجربة تصفح واضحة ومريحة.</li></ul></div>
    <div class="art" aria-hidden="true">${cherry(240)}</div></div></section>
  ${tips}
  <section class="block ${D.articles.length?'alt':''}"><div class="container"><div class="sec-head"><h2>عندك سؤال؟ إحنا هنا لمساعدتك</h2></div>${FaqList(true)}
    <p style="text-align:center;margin-top:18px"><a class="btn btn-ghost btn-sm" href="#/faq">كل الأسئلة الشائعة</a></p></div></section>
  <section class="block"><div class="container">${Newsletter()}</div></section>`;
}
function Newsletter(){
  const soc = socialLinks();
  const form = D.newsletterEndpoint ? `<form method="post" action="${esc(D.newsletterEndpoint)}" target="_blank"><input type="email" name="email" required placeholder="بريدك الإلكتروني" aria-label="البريد الإلكتروني"><button class="btn btn-green" type="submit">اشتركي</button></form>
    <small>باشتراكك توافقين على استخدام بريدك لإرسال جديد المتجر فقط. تفاصيل أكثر في <a href="#/privacy" style="text-decoration:underline">سياسة الخصوصية</a>.</small>` : "";
  return `<div class="news"><h2>خليكي قريبة من كرز 🍒</h2><p>تابعي جديد ملابس الأطفال والعروض والاختيارات المميزة.</p>${form}${soc?`<div class="socials">${soc}</div>`:''}</div>`;
}
const FAQ = [
  ["كيف أختار المقاس المناسب لطفلي؟","المقاسات والأعمار قد تختلف من علامة لأخرى. راجعي المقاسات المذكورة في صفحة كل منتج ودليل المقاسات عند توفره، وفي حال التردد اختاري المقاس الأكبر قليلًا للصغار."],
  ["كيف أعرف تفاصيل الخامة؟","تجدين الخامة في صفحة كل منتج كما وردت في مواصفاته الرسمية، ولا نذكر خامة غير مؤكدة."],
  ["كيف أتابع العروض الجديدة؟","من قسم «العروض والخصومات»، ويمكنك الاشتراك في النشرة البريدية أو متابعة حساباتنا الرسمية عند توفرها."],
  ["كيف أشتري المنتج؟","كرز يعرض الاختيارات ويوجّهك إلى رابط الشراء الصحيح. عند الضغط على «اطلب الآن» ستنتقلين إلى المتجر الذي يبيع المنتج، وتتم عملية الشراء والدفع والتوصيل هناك وفق سياساته."],
  ["كيف أتواصل مع كرز؟","من صفحة «تواصل معنا». ستجدين وسائل التواصل الرسمية فور إتاحتها."]
];
function FaqList(){ return `<div class="faq">${FAQ.map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join("")}</div>`; }

/* البحث والتصفية */
function parseQS(h){ const q={}; const s=(h.split("?")[1]||""); s.split("&").forEach(p=>{ if(!p) return; const [k,v]=p.split("="); q[decodeURIComponent(k)]=decodeURIComponent((v||"").replace(/\+/g," ")); }); return q; }
function filterProducts(q){
  let l=D.products.slice();
  if(q.cat) l=l.filter(p=>p.category===q.cat);
  if(q.sub) l=l.filter(p=>p.sub===q.sub);
  if(q.age) l=l.filter(p=>(p.ages||[]).includes(q.age));
  if(q.size) l=l.filter(p=>(p.sizes||[]).includes(q.size));
  if(q.color) l=l.filter(p=>(p.colors||[]).includes(q.color));
  if(q.type) l=l.filter(p=>p.type===q.type);
  if(q.min) l=l.filter(p=>p.price>=+q.min);
  if(q.max) l=l.filter(p=>p.price<=+q.max);
  if(q.offers) l=l.filter(hasOffer);
  if(q.sets) l=l.filter(p=>p.set);
  if(q.season) l=l.filter(p=>p.season);
  if(q.q){ const t=q.q.trim().toLowerCase(); l=l.filter(p=>[p.name,p.type,p.sub,catName(p.category),p.description].join(" ").toLowerCase().includes(t)); }
  if(q.sort==="new") l.sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));
  return l;
}
const uniq = (key,flat) => [...new Set(D.products.flatMap(p=>flat?(p[key]||[]):[p[key]]).filter(Boolean))];
function Shop(q){
  const c = CATS[q.cat];
  let title = q.offers?"العروض والخصومات":q.sets?"الأطقم المتكاملة":q.season?"ملابس الموسم":q.q?`نتائج البحث عن «${esc(q.q)}»`:c?c.name:"كل المنتجات";
  if(q.sub) title += " — "+esc(q.sub);
  const ageL = (AGES.find(a=>a.key===q.age)||{}).label;
  if(ageL) title = "ملابس "+ageL;
  const res = filterProducts(q);
  const sel=(id,label,opts,val)=>`<div class="f-group"><label class="t" for="${id}">${label}</label><select id="${id}"><option value="">الكل</option>${opts.map(o=>`<option value="${esc(o.v)}" ${o.v===val?'selected':''}>${esc(o.t)}</option>`).join("")}</select></div>`;
  const chips = c?`<div class="chips"><a class="chip ${!q.sub?'on':''}" href="#/shop?cat=${q.cat}">الكل</a>${c.subs.map(s=>`<a class="chip ${q.sub===s?'on':''}" href="#/shop?cat=${q.cat}&sub=${encodeURIComponent(s)}">${s}</a>`).join("")}</div>`:"";
  return `${PageHead(title,c?c.tagline:"",title)}<div class="container">${chips}
  <div class="listing">
    <div><button class="btn btn-ghost btn-sm filter-toggle" id="filterToggle" aria-expanded="false">تصفية النتائج</button>
    <form class="filters" id="filters" aria-label="فلاتر المنتجات">
      <h3>تصفية النتائج</h3>
      <div class="f-group"><label class="t" for="f_q">بحث</label><input type="text" id="f_q" value="${esc(q.q||"")}" placeholder="اسم المنتج أو نوعه"></div>
      ${sel("f_cat","القسم",Object.entries(CATS).map(([k,v])=>({v:k,t:v.name})),q.cat)}
      ${sel("f_age","العمر",AGES.map(a=>({v:a.key,t:a.label})),q.age)}
      ${sel("f_size","المقاس",uniq("sizes",true).map(v=>({v,t:v})),q.size)}
      ${sel("f_color","اللون",uniq("colors",true).map(v=>({v,t:v})),q.color)}
      ${sel("f_type","نوع الملابس",uniq("type").map(v=>({v,t:v})),q.type)}
      <div class="f-group"><span class="label t" style="display:block;font-weight:700;font-size:.9rem;color:var(--petrol)">السعر (ج.م)</span><div class="f-row"><input type="number" min="0" id="f_min" placeholder="من" value="${esc(q.min||"")}" aria-label="أقل سعر"><input type="number" min="0" id="f_max" placeholder="إلى" value="${esc(q.max||"")}" aria-label="أعلى سعر"></div></div>
      <label class="f-check"><input type="checkbox" id="f_offers" ${q.offers?'checked':''}> المنتجات التي عليها عروض</label>
      <div class="f-actions"><button class="btn btn-primary btn-sm" type="submit">تطبيق الفلاتر</button><button class="btn btn-ghost btn-sm" type="button" id="clearFilters">مسح الفلاتر</button></div>
    </form></div>
    <div><p class="result-count" aria-live="polite">${res.length?`عدد المنتجات: ${res.length.toLocaleString("ar-EG")}`:''}</p>
    <div class="prod-grid list">${res.length?res.map(ProductCard).join(""):
      Empty(!loaded?"جاري تحميل المنتجات..":D.products.length?"ملقيناش منتجات مطابقة لاختياراتك. جرّبي تغيير البحث أو الفلاتر.":"جاري تجهيز المنتجات.. تابعينا قريبًا لاكتشاف الجديد 🍒",true)}</div></div>
  </div></div>`;
}
function Favorites(){
  const l=D.products.filter(p=>favs.has(p.id));
  return PageHead("المفضلة","المنتجات اللي حفظتيها للرجوع إليها لاحقًا.")+`<div class="container" style="padding:30px 0"><div class="prod-grid">${l.length?l.map(ProductCard).join(""):Empty("لسه ما أضفتيش منتجات للمفضلة. تصفحي الأقسام واضغطي على القلب للحفظ.",true)}</div></div>`;
}
function About(){
  const imgs=D.products.filter(p=>p.images&&p.images[0]).slice(0,3);
  const tiles=imgs.map((p,k)=>`<figure class="ab-tile t${k+1}"><img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy"></figure>`).join("");
  const art=imgs.length?`<div class="ab-art n${imgs.length}" aria-hidden="false">${tiles}<span class="ab-cherry" aria-hidden="true">${cherry(64)}</span></div>`
    :`<div class="ab-art empty" aria-hidden="true">${cherry(160)}</div>`;
  return `<section class="about"><div class="container ab-grid">
    <div class="ab-text">
      <span class="ab-eyebrow">من نحن</span>
      <h1>حلاوة طفولتهم.. في كل تفصيلة 🍒</h1>
      <p>في كرز، بنحب التفاصيل الصغيرة اللي بتخلي طفولة أولادنا أجمل. علشان كده، بنجمع لكِ اختيارات متنوعة من ملابس البنات والأولاد والبيبي، لتختاري لطفلك إطلالة تناسب ذوقك واحتياجاته بسهولة.</p>
      <a class="btn btn-primary ab-btn" href="#/shop">تصفحي المنتجات <span aria-hidden="true">←</span></a>
    </div>${art}
  </div></section>`;
}
function Contact(){
  const c=D.contact, soc=socialLinks();
  const rows=[c.email?`<p>البريد الإلكتروني: <a href="mailto:${esc(c.email)}" style="text-decoration:underline">${esc(c.email)}</a></p>`:'',c.whatsapp?`<p>واتساب: <a href="https://wa.me/${esc(c.whatsapp.replace(/\D/g,""))}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">راسلينا</a></p>`:''].join("");
  return PageHead("تواصل معنا","يسعدنا سماعك")+`<div class="container"><div class="prose"><div class="contact-box">
   ${rows||'<p>وسائل التواصل الرسمية ستظهر هنا فور إتاحتها. شكرًا لصبرك 🍒</p>'}${soc?`<div class="socials" style="justify-content:flex-start;margin-top:10px">${soc.replace(/<a /g,'<a style="background:var(--green-soft);color:var(--petrol)" ')}</div>`:''}</div></div></div>`;
}
function Faq(){ return PageHead("الأسئلة الشائعة","عندك سؤال؟ إحنا هنا لمساعدتك")+`<div class="container" style="padding:30px 0">${FaqList()}</div>`; }
function Privacy(){
  return PageHead("سياسة الخصوصية","")+`<div class="container"><div class="prose">
  <p>نحترم خصوصيتك. لا نجمع منك بيانات شخصية إلا ما تقدمينه بنفسك، مثل بريدك الإلكتروني عند الاشتراك في النشرة البريدية (إن كانت متاحة).</p>
  <h2>المفضلة</h2><p>تُحفظ قائمة المفضلة على جهازك فقط داخل متصفحك، ولا تُرسل إلينا.</p>
  <h2>روابط الشراء الخارجية</h2><p>عند الانتقال إلى متجر خارجي لإتمام الشراء، تخضع بياناتك لسياسة خصوصية ذلك المتجر.</p>
  <h2>تواصل</h2><p>لأي استفسار عن الخصوصية، تواصلي معنا من صفحة «تواصل معنا».</p></div></div>`;
}
function Returns(){ return PageHead("سياسة الاستبدال والإرجاع","")+`<div class="container"><div class="prose"><p>${esc(D.RETURNS_TEXT||"")}</p></div></div>`; }

/* ---------- الراوتر ---------- */
const META = {
  "":["كرز | ملابس أطفال للبنات والأولاد والبيبي","كرز Karaz متجر مصري لعرض ملابس الأطفال للبنات والأولاد والبيبي. اكتشفي اختيارات أنيقة ومريحة وعروضًا مميزة بسهولة."],
  girls:["ملابس بنات أطفال | كرز","تشكيلة من ملابس البنات الأطفال: فساتين وأطقم وبيجامات وملابس لكل موسم."],
  boys:["ملابس أولاد أطفال | كرز","تشكيلة من ملابس الأولاد الأطفال: تيشيرتات وأطقم وسويت شيرت وبيجامات."],
  baby:["ملابس بيبي وحديثي الولادة | كرز","ملابس البيبي وحديثي الولادة: سالوبيت وأطقم وبودي وملابس خروج."],
  offers:["عروض وخصومات ملابس الأطفال | كرز","تابعي عروض وخصومات ملابس الأطفال الفعلية من كرز."],
  about:["من نحن | كرز","تعرّفي على كرز Karaz، متجر ملابس الأطفال."],
  contact:["تواصل معنا | كرز","تواصلي مع كرز."],
  faq:["الأسئلة الشائعة | كرز","إجابات عن أسئلة الأمهات حول المقاسات والعروض والشراء."],
  privacy:["سياسة الخصوصية | كرز","سياسة الخصوصية في كرز."],
  other:["ملابس أطفال | كرز","تصفحي ملابس الأطفال من كرز."]
};
function setMeta(key){
  const m = META[key]||META.other;
  document.title=m[0];
  let d=$('meta[name="description"]'); if(d) d.setAttribute("content",m[1]);
}
function route(){
  const h = location.hash.replace(/^#/,"") || "/";
  if(h.startsWith("categories")) return;
  const path = h.split("?")[0], q = parseQS(h);
  let html="", nav="", metaKey="other";
  if(path==="/"){ html=Home(); nav="home"; metaKey=""; }
  else if(path==="/shop"){ html=Shop(q); nav=q.offers?"offers":(q.cat||""); metaKey=q.offers?"offers":(q.cat||"other"); }
  else if(path==="/favorites"){ html=Favorites(); }
  else if(path==="/about"){ html=About(); nav="about"; metaKey="about"; }
  else if(path==="/contact"){ html=Contact(); nav="contact"; metaKey="contact"; }
  else if(path==="/faq"){ html=Faq(); metaKey="faq"; }
  else if(path==="/privacy"){ html=Privacy(); metaKey="privacy"; }
  else if(path==="/returns" && D.returnsPolicy){ html=Returns(); }
  else { html=PageHead("الصفحة غير موجودة","")+`<div class="container" style="padding:30px 0">${Empty("الصفحة اللي بتدوري عليها مش موجودة.",true)}</div>`; }
  $("#main").innerHTML=html;
  setMeta(metaKey);
  document.querySelectorAll("[data-nav]").forEach(a=>a.classList.toggle("active",a.dataset.nav===nav));
  closeDrawer(); window.scrollTo(0,0);
  bindPage(path);
}
function bindPage(path){
  const f=$("#filters");
  if(f){
    f.addEventListener("submit",e=>{ e.preventDefault();
      const g=id=>($("#"+id)||{}).value||"";
      const p={q:g("f_q"),cat:g("f_cat"),age:g("f_age"),size:g("f_size"),color:g("f_color"),type:g("f_type"),min:g("f_min"),max:g("f_max")};
      if($("#f_offers").checked) p.offers=1;
      const qs=Object.entries(p).filter(([,v])=>v).map(([k,v])=>k+"="+encodeURIComponent(v)).join("&");
      location.hash="#/shop"+(qs?"?"+qs:"");
    });
    $("#clearFilters").addEventListener("click",()=>{ location.hash="#/shop"; });
    const t=$("#filterToggle"); t.addEventListener("click",()=>{ const o=f.classList.toggle("open"); t.setAttribute("aria-expanded",o); });
  }
  document.querySelectorAll("[data-img]").forEach(b=>b.addEventListener("click",()=>{
    $("#gMain").innerHTML=`<img src="${b.dataset.img}" alt="">`;
    document.querySelectorAll("[data-img]").forEach(x=>x.removeAttribute("aria-current")); b.setAttribute("aria-current","true");
  }));
  const sc=document.querySelector("[data-scroll]");
  if(sc) sc.addEventListener("click",e=>{ e.preventDefault(); const t=document.getElementById(sc.dataset.scroll); if(t) t.scrollIntoView({behavior:"smooth"}); });
}
function updateFavBadge(){ const n=favs.get().length, b=$("#favBadge"); if(!b) return; b.hidden=!n; b.textContent=n.toLocaleString("ar-EG"); }
function openDrawer(){ $("#drawer").classList.add("open"); $("#drawerBg").classList.add("open"); $("#drawer").setAttribute("aria-hidden","false"); }
function closeDrawer(){ const d=$("#drawer"); if(!d) return; d.classList.remove("open"); $("#drawerBg").classList.remove("open"); d.setAttribute("aria-hidden","true"); }

/* ---------- تشغيل ---------- */
$("#app-header").innerHTML=Header();
$("#app-footer").innerHTML=Footer();
updateFavBadge();
$("#burger").addEventListener("click",openDrawer);
$("#drawerClose").addEventListener("click",closeDrawer);
$("#drawerBg").addEventListener("click",closeDrawer);
document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ closeDrawer(); $("#searchBar").classList.remove("open"); } });
$("#searchToggle").addEventListener("click",function(){ const o=$("#searchBar").classList.toggle("open"); this.setAttribute("aria-expanded",o); if(o) $("#searchInput").focus(); });
$("#searchForm").addEventListener("submit",e=>{ e.preventDefault(); const v=$("#searchInput").value.trim(); $("#searchBar").classList.remove("open"); location.hash="#/shop"+(v?"?q="+encodeURIComponent(v):""); });
$("#skipLink").addEventListener("click",e=>{ e.preventDefault(); $("#main").focus(); });
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-fav]"); if(!b) return;
  e.preventDefault();
  const on=favs.toggle(b.dataset.fav);
  document.querySelectorAll(`[data-fav="${CSS.escape(b.dataset.fav)}"]`).forEach(x=>x.setAttribute("aria-pressed",on));
  updateFavBadge(); toast(on?"أُضيف إلى المفضلة":"أُزيل من المفضلة");
  if(location.hash.startsWith("#/favorites")) route();
});
window.addEventListener("hashchange",route);
route();

/* ---------- تحميل المنتجات من مجلد products ---------- */
function normalizeProduct(p){
  if(!p||p.hidden||!p.name||!CATS[p.category]) return null;
  p.images=(p.images||[]).filter(Boolean);
  return p;
}
function loadProducts(){
  D.products=(Array.isArray(window.KARAZ_PRODUCTS)?window.KARAZ_PRODUCTS:[]).map(normalizeProduct).filter(Boolean);
  loaded=true;
  $("#app-footer").innerHTML=Footer();
  route();
}
loadProducts();
})();
