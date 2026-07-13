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
initNav();initReveals();initCarousel();
export {initNav,initReveals,initCarousel};
