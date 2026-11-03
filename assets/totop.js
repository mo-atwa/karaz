/* زر العودة لأعلى الصفحة: يظهر عند النزول، وبحركة ناعمة */
(function(){
  if(document.getElementById("toTop")) return;
  var css=".to-top{position:fixed;right:18px;bottom:20px;z-index:60;width:48px;height:48px;border-radius:50%;border:1.5px solid #B7CFA1;background:#FFFCF7;color:#1F4E5F;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;box-shadow:0 8px 22px rgba(31,78,95,.18);opacity:0;visibility:hidden;transform:translateY(16px) scale(.9);transition:opacity .3s ease,transform .3s ease,visibility .3s,background .2s,color .2s,border-color .2s;-webkit-tap-highlight-color:transparent}"+
  ".to-top.show{opacity:1;visibility:visible;transform:none}"+
  ".to-top svg{width:22px;height:22px;transition:transform .25s ease}"+
  ".to-top:hover{background:#1F4E5F;color:#fff;border-color:#1F4E5F}.to-top:hover svg{transform:translateY(-2px)}"+
  ".to-top:focus-visible{outline:3px solid #6BA86B;outline-offset:3px}"+
  "@media(max-width:860px){.to-top.has-sticky{bottom:90px}}"+
  "@media(max-width:480px){.to-top{right:14px;width:46px;height:46px}}"+
  "@media(prefers-reduced-motion:reduce){.to-top,.to-top svg{transition:opacity .01s,visibility .01s}}";
  var st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);
  var b=document.createElement("button"); b.id="toTop"; b.type="button"; b.className="to-top";
  b.setAttribute("aria-label","العودة إلى أعلى الصفحة"); b.setAttribute("title","إلى الأعلى");
  b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
  function mount(){ if(document.querySelector(".sticky")) b.classList.add("has-sticky"); document.body.appendChild(b); upd(); }
  var ticking=false;
  function upd(){ ticking=false; var y=window.pageYOffset||document.documentElement.scrollTop; b.classList.toggle("show", y>400); }
  window.addEventListener("scroll",function(){ if(!ticking){ ticking=true; requestAnimationFrame(upd); } },{passive:true});
  b.addEventListener("click",function(){
    var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({top:0,behavior:reduce?"auto":"smooth"});
  });
  if(document.body) mount(); else document.addEventListener("DOMContentLoaded",mount);
})();
