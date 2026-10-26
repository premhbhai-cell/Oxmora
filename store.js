(function(){
const KEY='oxmora_cart_v2',WK='oxmora_wish_v1',RK='oxmora_reviews_v1',WA='919839991773';
const P=()=>window.OXMORA_PRODUCTS||[];
const jget=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||d)}catch(e){return JSON.parse(d)}};
const jset=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
window.money=n=>'₹'+Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:0});
window.esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
window.getCart=()=>jget(KEY,'[]');
window.saveCart=c=>{jset(KEY,c);updateCounts()};
window.findProduct=id=>P().find(p=>p.id===id);
window.getWish=()=>jget(WK,'[]');
window.toast=m=>{let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast hidden';document.body.appendChild(t)}t.textContent=m;t.classList.remove('hidden');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.add('hidden'),2200)};
window.toggleWish=(id,el)=>{let w=getWish(),i=w.indexOf(id);i<0?w.push(id):w.splice(i,1);jset(WK,w);if(el)el.classList.toggle('on',i<0);updateCounts();toast(i<0?'Added to wishlist':'Removed from wishlist')};
window.updateCounts=()=>{const c=getCart(),n=c.reduce((a,x)=>a+x.qty,0),t=c.reduce((a,x)=>a+x.qty*((findProduct(x.id)||{}).price||0),0);
document.querySelectorAll('[data-cart-count]').forEach(e=>e.textContent=n);document.querySelectorAll('[data-cart-total]').forEach(e=>e.textContent=money(t));document.querySelectorAll('[data-wish-count]').forEach(e=>e.textContent=getWish().length)};
window.addToCart=(id,qty=1)=>{let p=findProduct(id);if(!p)return;let c=getCart(),x=c.find(x=>x.id===id);if(x)x.qty=Math.min(99,x.qty+qty);else c.push({id,qty:Math.max(1,Math.min(99,qty))});saveCart(c);toast(p.name+' added to cart')};
/* Reviews: seed real reviews in products.js -> window.OXMORA_REVIEWS=[{id:'OXM001',name:'..',rating:5,text:'..',date:'2026-10-26'}] */
window.getReviews=id=>[...(window.OXMORA_REVIEWS||[]),...jget(RK,'[]')].filter(r=>!id||r.id===id).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
window.addReview=r=>{let a=jget(RK,'[]');a.push(r);jset(RK,a)};
window.avgRating=id=>{const r=getReviews(id);return r.length?r.reduce((a,x)=>a+x.rating,0)/r.length:0};
window.stars=n=>`<span class="stars" style="--r:${n/5*100}%">★★★★★</span>`;
window.disc=p=>Math.round((1-p.price/p.oldPrice)*100);
window.productCard=p=>{const rs=getReviews(p.id).length;return `<article class="pc"><span class="disc">-${disc(p)}%</span><button class="heart ${getWish().includes(p.id)?'on':''}" onclick="toggleWish('${p.id}',this)" aria-label="Wishlist">♥</button><a class="pimg" href="product.html?id=${p.id}"><img loading="lazy" src="${p.image}" alt="${esc(p.name)}"></a><div class="pb"><h3><a href="product.html?id=${p.id}">${p.id} - ${esc(p.name)}</a></h3>${rs?stars(avgRating(p.id))+` <small>(${rs})</small>`:'<small class="muted">'+esc(p.category)+'</small>'}<div class="pp"><s>${money(p.oldPrice)}</s> <b>${money(p.price)}</b></div><button class="btn" onclick="addToCart('${p.id}')">🛒 Add to cart</button></div></article>`};
const cats=()=>[...new Set(P().map(p=>p.category))];
const header=()=>`<div class="topbar">Welcome To Oxmora • Toys for every little explorer<a href="#" onclick="this.parentNode.remove();return false" class="x">×</a></div>
<header class="hd"><div class="wrap hd-row"><a class="logo2" href="index.html"><img src="assets/logo.png" alt="Oxmora - Play Learn Grow"></a>
<form class="search2" action="products.html"><select name="category"><option value="">All categories</option>${cats().map(c=>`<option>${c}</option>`).join('')}</select><input name="q" placeholder="Search for products, categories or brands..." aria-label="Search"><button aria-label="Search">⌕</button></form>
<div class="icons"><a href="products.html" title="Wishlist" class="ic">♡<i data-wish-count>0</i></a><a href="contact.html" title="Account" class="ic">☺</a><a href="cart.html" class="ic cartic">🛒<i data-cart-count>0</i><span>My cart<br><b data-cart-total>₹0</b></span></a></div></div>
<nav class="nav2"><div class="wrap"><a href="index.html">Home</a><a href="products.html">All Products</a><a href="products.html?sort=disc">Discounted Products</a><a href="about.html">About</a><a href="contact.html">Contact</a></div></nav></header>`;
const footer=()=>`<footer class="ft"><div class="wrap ft-grid"><div><a class="logo2 light" href="index.html"><img src="assets/logo.png" alt="Oxmora - Play Learn Grow"></a><p>Fun, colourful toys for kids — enquire with Oxmora for availability and delivery.</p><h4>Order on WhatsApp</h4><a class="btn gold" target="_blank" rel="noopener" href="https://wa.me/${WA}">💬 +91 98399 91773</a></div>
<div><h4>Special</h4><a href="products.html">Latest Products</a><a href="index.html#featured">Featured Products</a><a href="products.html?sort=disc">Best Offers</a><a href="products.html">All categories</a></div>
<div><h4>Account & Shipping Info</h4><a href="cart.html">Cart</a><a href="checkout.html">Checkout</a><a href="contact.html">Track / Ask about order</a><a href="about.html">About Oxmora</a></div>
<div class="nl"><h4>Newsletter</h4><p>Subscribe to our new channel to get latest updates</p><form onsubmit="event.preventDefault();toast('Thanks! We will keep you updated.');this.reset()"><input type="email" required placeholder="Your Email Address"><button>Subscribe</button></form><h4>Start a conversation</h4><p>☎ +91 9839991773<br>✉ sk.refrigeration2025@gmail.com<br>⌖ PLOT NO 5326 STREET NO 1 PREET NAGAR TAJPUR ROAD LUDHIANA PUNJAB 141010</p></div></div>
<div class="copy"><div class="wrap">© <span id="year"></span> Oxmora. All Rights Reserved.<span><a href="about.html">About Us</a><a href="contact.html">Contact Us</a></span></div></div></footer>
<div class="fab"><button class="totop" id="totop" aria-label="Back to top"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button><a class="wa-float" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent('Hello Oxmora, I need help with a product')}" aria-label="Chat on WhatsApp"><svg viewBox="0 0 32 32" width="30" height="30" fill="#fff"><path d="M16.003 3C8.83 3 3 8.83 3 16c0 2.29.6 4.52 1.74 6.49L3 29l6.7-1.72A12.94 12.94 0 0 0 16 29c7.17 0 13-5.83 13-13S23.17 3 16.003 3zm0 23.7c-1.95 0-3.86-.53-5.53-1.52l-.4-.23-3.98 1.02 1.06-3.88-.26-.4A10.6 10.6 0 0 1 5.4 16c0-5.9 4.8-10.7 10.6-10.7S26.6 10.1 26.6 16s-4.8 10.7-10.6 10.7zm5.9-8c-.32-.16-1.9-.94-2.2-1.04-.3-.1-.5-.16-.72.16-.22.32-.84 1.04-1.03 1.26-.19.22-.38.24-.7.08-.32-.16-1.36-.5-2.6-1.6-.96-.86-1.6-1.9-1.8-2.22-.18-.32-.02-.5.14-.66.14-.14.32-.38.48-.56.16-.19.22-.32.32-.54.1-.22.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55h-.62c-.22 0-.56.08-.86.4-.3.32-1.12 1.1-1.12 2.68s1.15 3.1 1.31 3.32c.16.22 2.26 3.45 5.47 4.84.76.33 1.36.53 1.82.68.77.24 1.46.2 2.01.12.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.3-.21-.62-.37z"/></svg></a></div>`;
const mbar=()=>`<nav class="mbar" aria-label="Quick navigation"><a href="index.html"><svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8M5 10v10h14V10"/></svg>Home</a><a href="products.html"><svg viewBox="0 0 24 24"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>Shop</a><a href="cart.html" class="mc"><svg viewBox="0 0 24 24"><path d="M3 4h2l2.4 11h10.2L20 7H6.2M9 20h.01M17 20h.01"/></svg>Cart<i data-cart-count>0</i></a><a href="https://wa.me/${WA}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 1-13.4 7.8L3 21l1.3-4.4A9 9 0 1 1 21 12z"/></svg>Chat</a><a href="contact.html"><svg viewBox="0 0 24 24"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg>Account</a></nav>`;
document.addEventListener('DOMContentLoaded',()=>{
const ic=document.createElement('link');ic.rel='icon';ic.href='assets/logo.png';document.head.appendChild(ic);const l=document.createElement('link');l.rel='stylesheet';l.href='home.css';document.head.appendChild(l);
const tb=document.querySelector('.topbar'),h=document.querySelector('header.header'),f=document.querySelector('footer.footer');
const frag=html=>{const d=document.createElement('template');d.innerHTML=html;return d.content};
if(tb)tb.remove();if(h)h.replaceWith(frag(header()));if(f)f.replaceWith(frag(footer()));
document.querySelectorAll('.mobilebar').forEach(e=>e.remove());document.body.appendChild(frag(mbar()));
const tt=document.getElementById('totop');if(tt){tt.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});const vis=()=>tt.classList.toggle('show',window.scrollY>300);addEventListener('scroll',vis,{passive:true});vis()}
const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();updateCounts();
if(typeof window.initPage==='function')window.initPage();
});})();
