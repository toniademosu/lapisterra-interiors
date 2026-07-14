import {loadProperties,featured,cardHTML} from './properties-data.js';
function initNav(){
  const nav=document.querySelector('.nav');
  const burger=document.getElementById('navBurger');
  addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40),{passive:true});
  burger?.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    burger.setAttribute('aria-expanded',String(open));
  });
  document.getElementById('navLinks')?.addEventListener('click',()=>nav.classList.remove('open'));
}
function initReveals(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
  }),{threshold:.15});
  document.querySelectorAll('.reveal,.reveal-img').forEach(el=>io.observe(el));
}
function initCarousel(){
  const slides=[...document.querySelectorAll('.slide')];
  if(!slides.length)return;
  const count=document.getElementById('slideCount');
  let i=0;
  const show=n=>{
    slides[i].classList.remove('is-active');
    i=(n+slides.length)%slides.length;
    slides[i].classList.add('is-active');
    count.textContent=`${String(i+1).padStart(2,'0')}/${String(slides.length).padStart(2,'0')}`;
  };
  document.getElementById('prevSlide').addEventListener('click',()=>show(i-1));
  document.getElementById('nextSlide').addEventListener('click',()=>show(i+1));
}
async function initFeatured(){
  const grid=document.getElementById('featuredGrid');
  if(!grid)return;
  try{
    const list=await loadProperties();
    grid.innerHTML=featured(list).map(cardHTML).join('');
    initReveals();
  }catch{/* fallback message already in DOM */}
}
function initForm(){
  const form=document.querySelector('.contact-form');
  if(!form)return;
  const property=new URLSearchParams(location.search).get('property');
  if(property){
    const textarea=form.querySelector('textarea');
    if(textarea&&!textarea.value)textarea.value=`I'm interested in "${property}". `;
  }
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const msg=form.querySelector('.form-msg');
    if(!form.reportValidity())return;
    if(form.querySelector('[name="_gotcha"]').value){
      msg.textContent='Thank you — we’ll be in touch shortly.';
      form.reset();
      return;
    }
    try{
      const res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      msg.textContent=res.ok?'Thank you — we’ll be in touch shortly.':'Something went wrong. Please email us directly.';
      if(res.ok)form.reset();
    }catch{msg.textContent='Something went wrong. Please email us directly.';}
  });
}
initNav();initReveals();initCarousel();initFeatured();initForm();
export {initNav,initReveals,initCarousel,initForm};
