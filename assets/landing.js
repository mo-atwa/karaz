/* سلوك مشترك لكل صفحات المنتجات: المفضلة، معرض الصور، المنتجات المشابهة */
(function(){
"use strict";
var $=function(s){return document.querySelector(s)};
var P={}; try{ P=JSON.parse($("#product").textContent); }catch(e){}
var id=P.id||decodeURIComponent(location.pathname.split("/").pop()).replace(/\.html?$/i,"");
var root="../../";

function favs(){ try{return JSON.parse(localStorage.getItem("karaz_favs")||"[]")}catch(e){return[]} }
function saveFavs(a){ try{localStorage.setItem("karaz_favs",JSON.stringify(a))}catch(e){} }
function toast(t){ var el=$("#toast"); if(!el) return; el.textContent=t; el.classList.add("show"); clearTimeout(toast.t); toast.t=setTimeout(function(){el.classList.remove("show")},2000); }
function paint(){
  var on=favs().indexOf(id)>-1, b=$("#favBtn");
  if(b){ b.setAttribute("aria-pressed",on); var l=b.querySelector("span"); if(l) l.textContent=on?"في المفضلة":"أضيفي للمفضلة"; }
  var n=favs().length, bd=$("#favBadge"); if(bd){ bd.hidden=!n; bd.textContent=n; }
}
var fb=$("#favBtn");
if(fb) fb.addEventListener("click",function(){
  var a=favs(), i=a.indexOf(id);
  if(i>-1){ a.splice(i,1); toast("أُزيل من المفضلة"); } else { a.push(id); toast("أُضيف إلى المفضلة"); }
  saveFavs(a); paint();
});
paint();

/* معرض الصور */
var img=$("#stageImg"), btns=document.querySelectorAll(".thumbs button");
btns.forEach(function(b){
  b.addEventListener("click",function(){
    btns.forEach(function(x){x.removeAttribute("aria-current")}); b.setAttribute("aria-current","true");
    img.style.opacity=0;
    setTimeout(function(){ img.src=b.dataset.src; img.alt=b.dataset.alt||""; img.style.opacity=1; },150);
  });
});

/* منتجات مشابهة */
var all=window.KARAZ_PRODUCTS||[], sec=$("#similar"), grid=$("#simGrid");
if(sec&&grid&&all.length){
  var me=all.filter(function(p){return p.id===id})[0]||P;
  var cat=me.category||P.category;
  var rest=all.filter(function(p){return p.id!==id&&p.category===cat&&p.url});
  rest.sort(function(a,b){ return (b.sub===me.sub)-(a.sub===me.sub) || String(b.createdAt||"").localeCompare(String(a.createdAt||"")); });
  rest=rest.slice(0,4);
  if(rest.length){
    rest.forEach(function(p){
      var a=document.createElement("a"); a.className="sc"; a.href=root+p.url;
      var im=document.createElement("span"); im.className="im";
      if(p.images&&p.images[0]){ var i=document.createElement("img"); i.src=root+p.images[0]; i.alt=p.name; i.loading="lazy"; im.appendChild(i); }
      var tx=document.createElement("span"); tx.className="tx";
      var b=document.createElement("b"); b.textContent=p.name;
      var s=document.createElement("span"); s.textContent="عرض المنتج";
      tx.appendChild(b); tx.appendChild(s); a.appendChild(im); a.appendChild(tx); grid.appendChild(a);
    });
    sec.hidden=false;
  }
}
})();
