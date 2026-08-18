/* =========================================================
   SS MOBILE PARK — ADD REAL STORE DETAILS HERE
   WhatsApp: digits only with country code, e.g. 919876543210
========================================================= */
const STORE = {
  whatsapp: '',
  phone: '',
  maps: ''
};

const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];
const topbar = $('#topbar');
const progressBar = $('#progressBar');
const menuBtn = $('#menuBtn');
const nav = $('#nav');
const heroVideo = $('#heroVideo');
const year = $('#year');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (year) year.textContent = new Date().getFullYear();

/* Smooth, light scroll effects — NO video scrubbing */
let raf = false;
function renderScroll(){
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? scrollY/max : 0;
  progressBar.style.width = `${p*100}%`;
  topbar.classList.toggle('scrolled', scrollY > 28);

  if(!reduceMotion){
    $$('.parallax-bg').forEach(el=>{
      const r = el.parentElement.getBoundingClientRect();
      if(r.bottom > 0 && r.top < innerHeight){
        const speed = Number(el.dataset.parallax || .08);
        const offset = (innerHeight/2 - (r.top+r.height/2))*speed;
        el.style.setProperty('--py', `${offset}px`);
      }
    });
    const heroCopy = $('.scroll-fade');
    if(heroCopy){
      const hp = Math.min(1, scrollY/Math.max(1,innerHeight));
      heroCopy.style.transform = `translateY(${hp*45}px)`;
      heroCopy.style.opacity = String(1-hp*.55);
    }
  }
  raf=false;
}
addEventListener('scroll',()=>{if(!raf){raf=true;requestAnimationFrame(renderScroll)}},{passive:true});
renderScroll();

/* Play videos only while visible */
const videoObserver = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    const v=e.target;
    if(e.isIntersecting){const pr=v.play(); if(pr) pr.catch(()=>{});} else {v.pause();}
  });
},{threshold:.05});
$$('video').forEach(v=>videoObserver.observe(v));

/* Reveal effects */
const revealObserver = new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');revealObserver.unobserve(e.target)}})
},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
$$('.reveal-up,.reveal-left,.reveal-right').forEach(el=>revealObserver.observe(el));

/* Mobile nav */
menuBtn.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded',String(open));
});
$$('a',nav).forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

/* =========================================================
   INTERACTIVE SERVICE — each service gets a UNIQUE result
========================================================= */
const repairPhone = $('#repairPhone');
const repairStatus = $('#repairStatus');
const repairTitle = $('#repairTitle');
const repairDesc = $('#repairDesc');
const repairResult = $('#repairResult');
const serviceEffect = $('#serviceEffect');
const resetRepair = $('#resetRepair');
const repairButtons = $$('.repair-option');
let currentService = 'tempered';
let busy=false;

const RESULTS = {
  tempered:{label:'NEW GLASS • CLEAN FINISH',effect:()=>`<div class="effect-card"><strong>✓</strong><span>GLASS RESTORED</span></div>`},
  display:{label:'DISPLAY RESTORED',effect:()=>`<div class="effect-card"><strong>100%</strong><span>DISPLAY ACTIVE</span></div>`},
  battery:{label:'BATTERY HEALTH 100%',effect:()=>`<div class="battery-shell"><div class="battery-fill"></div><div class="battery-label">100%</div></div>`},
  charging:{label:'FAST CHARGING • 100%',effect:()=>`<div class="effect-card"><div class="charging-bolt">⚡</div><span>FAST CHARGING • 100%</span></div>`},
  camera:{label:'CAMERA FOCUS CLEAR',effect:()=>`<div class="effect-card"><div class="camera-focus"></div><span>FOCUS CLEAR</span></div>`},
  speaker:{label:'AUDIO & MIC 100%',effect:()=>`<div class="effect-card"><div class="wave"><i></i><i></i><i></i><i></i><i></i></div><span>AUDIO • MIC • 100%</span></div>`}
};

function resetPhone(){
  busy=false;
  repairPhone.classList.remove('repairing','repaired');
  repairStatus.classList.remove('done');
  serviceEffect.innerHTML='';
  repairResult.textContent='READY TO REPAIR';
}
function selectService(btn){
  currentService=btn.dataset.service;
  repairButtons.forEach(b=>b.classList.toggle('active',b===btn));
  repairTitle.textContent=btn.dataset.title;
  repairDesc.textContent=btn.dataset.desc;
  resetPhone();
}
repairButtons.forEach(btn=>btn.addEventListener('click',()=>selectService(btn)));

function runRepair(){
  if(busy || repairPhone.classList.contains('repaired')) return;
  busy=true;
  repairPhone.classList.add('repairing');
  if(navigator.vibrate) navigator.vibrate(35);
  setTimeout(()=>{
    repairPhone.classList.remove('repairing');
    repairPhone.classList.add('repaired');
    serviceEffect.innerHTML=RESULTS[currentService].effect();
    repairResult.textContent=RESULTS[currentService].label;
    repairStatus.classList.add('done');
    busy=false;
    if(navigator.vibrate) navigator.vibrate([25,40,25]);
  },760);
}
repairPhone.addEventListener('click',runRepair);
repairPhone.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();runRepair()}});
resetRepair.addEventListener('click',resetPhone);

/* =========================================================
   CONTACT
========================================================= */
const whatsappBtn=$('#whatsappBtn'),callBtn=$('#callBtn'),directionBtn=$('#directionBtn');
const enquiryType=$('#enquiryType'),enquiryDetails=$('#enquiryDetails'),setupNote=$('#setupNote');
function waLink(){
  if(!STORE.whatsapp) return '#';
  const msg=`Hi SS Mobile Park, I need help with: ${enquiryType.value}.${enquiryDetails.value.trim()?`\nDetails: ${enquiryDetails.value.trim()}`:''}`;
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(msg)}`;
}
function updateContact(){
  whatsappBtn.href=waLink();
  callBtn.href=STORE.phone?`tel:${STORE.phone}`:'#';
  directionBtn.href=STORE.maps||'#';
  whatsappBtn.target=STORE.whatsapp?'_blank':'';
  directionBtn.target=STORE.maps?'_blank':'';
  setupNote.style.display=(STORE.whatsapp||STORE.phone||STORE.maps)?'none':'block';
}
[enquiryType,enquiryDetails].forEach(el=>el.addEventListener(el.tagName==='SELECT'?'change':'input',updateContact));
[whatsappBtn,callBtn,directionBtn].forEach(btn=>btn.addEventListener('click',e=>{
  if(btn.getAttribute('href')==='#'){e.preventDefault();alert('Add your real SS Mobile Park contact details at the top of script.js first.');}
}));
updateContact();
