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
initNav();initReveals();
export {initNav,initReveals};
