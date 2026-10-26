#!/usr/bin/env python3
"""يقرأ بيانات كل صفحات المنتجات في products/<القسم>/*.html ويكتب products/products.js
الذي يعتمد عليه الموقع لعرض المنتجات في أقسامها. يعمل تلقائيًا على GitHub عند كل رفع (انظري .github/workflows)."""
import json, re
from pathlib import Path
SITE = Path(__file__).resolve().parent.parent
CATS = ("girls", "boys", "baby")
rx = re.compile(r'<script type="application/json" id="product">\s*(.*?)\s*</script>', re.S)
out = []
for cat in CATS:
    for f in sorted((SITE / "products" / cat).glob("*.htm*")):
        if f.name.startswith("_"): continue
        m = rx.search(f.read_text(encoding="utf-8"))
        if not m:
            print("تخطّي (لا توجد بيانات منتج):", f); continue
        try: p = json.loads(m.group(1))
        except Exception as ex:
            print("خطأ في بيانات", f, ex); continue
        if p.get("hidden") or not p.get("name"): continue
        p["category"] = cat
        p["id"] = p.get("id") or f.stem
        p["url"] = f"products/{cat}/{f.name}"
        out.append(p)
out.sort(key=lambda p: str(p.get("createdAt", "")), reverse=True)
body = json.dumps(out, ensure_ascii=False, indent=2).replace("</", "<\\/")
(SITE / "products" / "products.js").write_text("window.KARAZ_PRODUCTS = " + body + ";\n", encoding="utf-8")
print(f"تم تحديث products/products.js ({len(out)} منتج)")
