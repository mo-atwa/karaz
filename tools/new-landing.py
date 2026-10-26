#!/usr/bin/env python3
"""ينشئ صفحة هبوط لمنتج جديد من ملف مواصفات JSON.

الاستخدام:   python3 tools/new-landing.py tools/example-spec.json
الناتج:      products/<القسم>/<slug>.html  +  images/<slug>/1.webp ...
بعدها:       python3 tools/build-index.py   (أو يتم تلقائيًا عند الرفع على GitHub)
"""
import json, sys, html, os
from pathlib import Path
from PIL import Image

SITE = Path(__file__).resolve().parent.parent
CATS = {"girls": "ملابس البنات", "boys": "ملابس الأولاد", "baby": "ملابس البيبي"}
BUY = 'href="{url}" target="_blank" rel="sponsored noopener noreferrer"'

ICONS = {
 "shoulder": '<path d="M7 3v6l5 4 5-4V3"/><path d="M4 9c0 6 3 12 8 12s8-6 8-12"/>',
 "cut": '<path d="M8 3h8l1 5-3 2 6 11H4l6-11-3-2z"/>',
 "print": '<circle cx="8" cy="8" r="3"/><circle cx="16" cy="9" r="2"/><circle cx="12" cy="16" r="3.5"/>',
 "star": '<path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.9 6.4 20l1.3-6.2L3 9.5l6.3-.7z"/>',
 "heart": '<path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z"/>',
 "soft": '<path d="M5 12c0-4 3-7 7-7s7 3 7 7-3 7-7 7-7-3-7-7z"/><path d="M9 12h6"/>',
 "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
 "snow": '<path d="M12 2v20M4 6l16 12M20 6L4 18"/>',
}
e = lambda s: html.escape(str(s), quote=True)

def icon(k):
    return f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS.get(k, ICONS["star"])}</svg>'

def build(spec):
    slug, cat = spec["slug"], spec["category"]
    assert cat in CATS, "القسم يجب أن يكون girls أو boys أو baby"
    name = spec["name"]
    url = spec["buyUrl"]
    assert url.startswith("https://"), "رابط الشراء يجب أن يبدأ بـ https://"
    buy = BUY.format(url=e(url))

    # الصور
    imgdir = SITE / "images" / slug
    imgdir.mkdir(parents=True, exist_ok=True)
    imgs = []
    for i, it in enumerate(spec["images"], 1):
        src = Path(it["src"]); src = src if src.is_absolute() else (SITE / src)
        im = Image.open(src).convert("RGB")
        s = min(1, 1100 / max(im.size)); 
        if s < 1: im = im.resize((round(im.width * s), round(im.height * s)))
        out = imgdir / f"{i}.webp"; im.save(out, "WEBP", quality=86)
        imgs.append({"path": f"images/{slug}/{i}.webp", "w": im.width, "h": im.height,
                     "alt": it.get("alt", name), "caption": it.get("caption", "")})

    def sec(title, sub, body, sid="", label=""):
        return (f'<section class="blk"{f" id={chr(34)}{sid}{chr(34)}" if sid else ""}><div class="head"><h2>{e(title)}</h2>'
                f'{f"<p>{e(sub)}</p>" if sub else ""}</div>{body}</section>')

    # مقاسات وألوان
    sizes = "".join(f'<span class="chip">{e(s)}</span>' for s in spec.get("sizes", []))
    colors = ""
    for c in spec.get("colors", []):
        sw = f'<span class="sw" style="background:{e(c["swatch"])}" aria-hidden="true"></span>' if c.get("swatch") else ""
        colors += f'<div class="colors"><b>اللون:</b>{sw}<span>{e(c["name"])}</span></div>'
    single = len(imgs) == 1
    thumbs = "" if single else "".join(
        f'<button type="button" data-src="../../{m["path"]}" data-alt="{e(m["alt"])}" {"aria-current=%strue%s" % (chr(34),chr(34)) if i==0 else ""} aria-label="صورة {i+1}"><img src="../../{m["path"]}" alt=""></button>'
        for i, m in enumerate(imgs))
    rate = spec.get("rating")
    ratehtml = ""
    if rate:
        ratehtml = f'<div class="rate"><span class="stars" aria-hidden="true">★★★★☆</span><span>تقييم {rate["value"]} من 5 على أمازون ({rate["count"]} تقييمات)</span></div>'

    band = "".join(f'<div role="listitem"><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in spec.get("band", []))
    band = f'<div class="band" role="list">{band}</div>' if band else ""

    feats = "".join(f'<article class="f"><div class="ic">{icon(f.get("icon","star"))}</div><h3>{e(f["title"])}</h3><p>{e(f["text"])}</p></article>' for f in spec.get("features", []))
    feats = sec(spec.get("features_title", "تفاصيل صغيرة تصنع الإطلالة"), spec.get("features_sub", ""), f'<div class="feat">{feats}</div>', "details") if feats else ""

    shots = ""
    for m in imgs[1:3]:
        fit = " contain" if m["h"] / m["w"] > 1.2 else ""
        cap = f'<figcaption>{e(m["caption"])}</figcaption>' if m["caption"] else ""
        shots += f'<figure class="shot{fit}"><img src="../../{m["path"]}" alt="{e(m["alt"])}" loading="lazy" style="object-position:top">{cap}</figure>'
    shots = sec("شوفيه من كل زاوية", "", f'<div class="show">{shots}</div>') if shots else ""

    specs = "".join(f'<dt>{e(a)}</dt><dd>{e(b)}</dd>' for a, b in spec.get("specs", []))
    care = "".join(f"<li>{e(x)}</li>" for x in spec.get("care", []))
    spechtml = ""
    if specs:
        carebox = f'<div class="care"><h3>العناية بالمنتج</h3><ul>{care}</ul></div>' if care else ""
        spechtml = sec("مواصفات المنتج", "", f'<div class="specwrap"><div class="spec"><dl>{specs}</dl></div>{carebox}</div>')

    revhtml = ""
    if rate and spec.get("reviews"):
        bars = "".join(f'<div class="bar"><span>{n} نجوم</span><i><b style="width:{p}%"></b></i><span>{p}%</span></div>' for n, p in rate.get("bars", []))
        qs = ""
        for r in spec["reviews"]:
            ok = ' · <span class="ok">شراء تم التحقق منه</span>' if r.get("verified") else ""
            qs += (f'<figure class="q"><h3>{e(r["title"])}</h3><p class="meta">{e(r["meta"])}{ok}</p>'
                   f'<blockquote>«{e(r["text"])}»</blockquote><figcaption class="who">{e(r["who"])}</figcaption></figure>')
        revhtml = sec("ماذا قالت الأمهات؟", "تقييمات حقيقية من صفحة المنتج على أمازون مصر.",
            f'<div class="rv"><div class="sum"><div class="big">{rate["value"]}<small> من 5</small></div><span class="stars" aria-hidden="true">★★★★☆</span>'
            f'<p>بناءً على {rate["count"]} تقييمات عالمية</p><div class="bars" aria-label="توزيع التقييمات">{bars}</div></div><div class="quotes">{qs}</div></div>'
            f'<p class="src">{e(rate.get("source","المصدر: صفحة المنتج على أمازون مصر. قد تتغير التقييمات، وتجدين أحدثها عند فتح المنتج."))}</p>')

    faq = "".join(f"<details><summary>{e(q)}</summary><p>{e(a)}</p></details>" for q, a in spec.get("faq", []))
    faq = sec("أسئلة قبل الشراء", "", f'<div class="faq">{faq}</div>') if faq else ""

    similar = ('<section class="blk" id="similar" hidden><div class="head"><h2>منتجات مشابهة قد تعجبك</h2></div>'
               '<div class="sim" id="simGrid"></div></section>')

    meta = {"id": slug, "name": name, "category": cat, "sub": spec.get("sub", ""), "type": spec.get("type", ""),
            "ages": spec.get("ages", []), "sizes": spec.get("sizes", []), "colors": [c["name"] for c in spec.get("colors", [])],
            "price": None, "oldPrice": None, "images": [m["path"] for m in imgs],
            "description": spec.get("description", spec.get("lead", "")), "material": spec.get("material", ""),
            "buyType": "affiliate", "buyUrl": url, "createdAt": spec.get("createdAt", ""),
            "featured": spec.get("featured", False), "set": spec.get("set", False), "season": spec.get("season", ""),
            "hidden": spec.get("hidden", False)}
    if rate: meta["rating"] = rate["value"]
    metajson = json.dumps(meta, ensure_ascii=False, indent=2).replace("</", "<\\/")

    t, tem, tr = spec.get("title", name), spec.get("title_em", ""), spec.get("title_rest", "")
    h1 = f'{e(t)} <em>{e(tem)}</em> {e(tr)}'.replace("<em></em>", "").strip() if tem else e(name)
    ages_note = spec.get("buy_note", "تظهر تفاصيل السعر والدفع والتوصيل على أمازون، وتخضع لسياساتها.")
    colorsblock = colors
    return f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(spec.get("page_title", name))} | كرز</title>
<meta name="description" content="{e(spec.get("meta_description", spec.get("lead", name)))}">
<meta name="theme-color" content="#1F4E5F">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../assets/landing.css">
</head>
<body>
<div class="wrap">
  <header class="top">
    <a class="brand" href="../../index.html" aria-label="كرز Karaz — الصفحة الرئيسية">
      <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" fill="#FFF9F0" stroke="#B7CFA1" stroke-width="2"/><path d="M33 14c-3 8-8 16-11 25M33 14c2 8 6 16 11 25" stroke="#6BA86B" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M33 14c6-5 14-3 17 2-6 1-12 1-17-2z" fill="#6BA86B"/><circle cx="21" cy="44" r="9" fill="#E9A6A0"/><circle cx="44" cy="42" r="9" fill="#d98981"/></svg>
      <span>كرز Karaz<small>حلاوة طفولتهم.. في كل تفصيلة</small></span></a>
    <div class="top-tools">
      <a class="hicon" href="../../index.html#/favorites" aria-label="المفضلة"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z"/></svg><span class="hbadge" id="favBadge" hidden>0</span></a>
      <a class="btn buy" {buy}>اطلب الآن</a>
    </div>
  </header>

  <main>
  <section class="hero" aria-labelledby="t">
    <div>
      <span class="eyebrow">{e(CATS[cat])}{" · " + e(spec["sub"]) if spec.get("sub") else ""}</span>
      {ratehtml}
      <h1 id="t">{h1}</h1>
      <p class="lead">{e(spec.get("lead", ""))}</p>
      {f'<div class="sizes"><b>المقاسات المتاحة</b><div class="chips">{sizes}</div></div>' if sizes else ""}
      {colorsblock}
      <div class="cta-row">
        <a class="btn buy" {buy}>اطلب الآن</a>
        <button class="favbtn" id="favBtn" type="button" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z"/></svg><span>أضيفي للمفضلة</span></button>
      </div>
      <p class="note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg><span>{e(ages_note)}</span></p>
    </div>
    <div class="gal{" single" if single else ""}">
      {"" if single else f'<div class="thumbs" aria-label="صور المنتج">{thumbs}</div>'}
      <div class="stage">{f'<span class="tag">{e(spec["brand"])}</span>' if spec.get("brand") else ""}
        <img id="stageImg" src="../../{imgs[0]["path"]}" alt="{e(imgs[0]["alt"])}" width="{imgs[0]["w"]}" height="{imgs[0]["h"]}"></div>
    </div>
  </section>
  {band}
  {feats}
  {shots}
  {spechtml}
  {revhtml}
  {faq}
  {similar}
  <section class="final">
    <h2>{e(spec.get("final_title", "جاهزة تختاري لطفلتك إطلالتها الجديدة؟"))}</h2>
    <p>{e(spec.get("final_text", "اطلبي الآن وتابعي التفاصيل والتوصيل على أمازون."))}</p>
    <a class="btn buy" {buy}>اطلب الآن</a>
  </section>
  </main>

  <footer>
    <p><a href="../../index.html#/shop?cat={cat}">تصفحي المزيد من {e(CATS[cat])}</a> · <a href="../../index.html">الرئيسية</a></p>
    <p class="disc">هذا الرابط هو رابط عمولة: قد نحصل على عمولة عند الشراء عبره دون أي تكلفة إضافية عليكِ. © كرز Karaz — جميع الحقوق محفوظة.</p>
  </footer>
</div>

<div class="sticky"><a class="btn buy" {buy}>اطلب الآن</a></div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>

<!-- بيانات المنتج: يقرأها الموقع تلقائيًا لعرض المنتج في قسمه. لا تحذفي هذا الجزء. -->
<script type="application/json" id="product">
{metajson}
</script>
<script src="../../products/products.js"></script>
<script src="../../assets/landing.js"></script>
</body>
</html>
''', cat, slug

if __name__ == "__main__":
    spec = json.load(open(sys.argv[1], encoding="utf-8"))
    page, cat, slug = build(spec)
    d = SITE / "products" / cat; d.mkdir(parents=True, exist_ok=True)
    (d / f"{slug}.html").write_text(page, encoding="utf-8")
    print(f"تم إنشاء products/{cat}/{slug}.html")
