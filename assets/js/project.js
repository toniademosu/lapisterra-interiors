const root=document.getElementById('project');
const id=new URLSearchParams(location.search).get('id');
function notFound(){
  root.innerHTML=`<div class="detail-missing"><h1>Project not found</h1>
  <p>This project may have been archived.</p>
  <a class="line-link" href="portfolio.html">Back to portfolio <span aria-hidden="true">→</span></a></div>`;
}
try{
  const res=await fetch('data/projects.json');
  if(!res.ok)throw new Error(`projects load failed: ${res.status}`);
  const list=await res.json();
  const i=list.findIndex(p=>p.id===id);
  const p=list[i];
  if(!p){notFound();}
  else{
    document.title=`${p.title} — LapisTerra Interiors`;
    const prev=list[(i-1+list.length)%list.length];
    const next=list[(i+1)%list.length];
    root.innerHTML=`
      <a class="crumb" href="portfolio.html">&larr; All projects</a>
      <p class="detail-eyebrow">${p.location} &middot; ${p.year}</p>
      <h1>${p.title}</h1>
      <div class="detail-gallery">
        <span class="frame"><img id="mainImg" src="${p.images[0]}" alt="${p.title}"></span>
        <div class="thumbs">${p.images.map((s,k)=>`<img data-src="${s}" ${k===0?'class="is-on"':''} src="${s}" alt="View ${k+1} of ${p.title}">`).join('')}</div>
      </div>
      <div class="detail-cols">
        <div>${p.body.map(t=>`<p>${t}</p>`).join('')}</div>
        <dl class="detail-side">
          <div><dt>Scope</dt><dd>${p.scope}</dd></div>
          <div><dt>Accent palette</dt><dd>${p.palette}</dd></div>
          <div><dt>Location</dt><dd>${p.location}, ${p.year}</dd></div>
        </dl>
      </div>
      <div class="detail-nav">
        <a class="line-link" href="project.html?id=${encodeURIComponent(prev.id)}"><span aria-hidden="true">←</span> ${prev.title}</a>
        <a class="line-link" href="project.html?id=${encodeURIComponent(next.id)}">${next.title} <span aria-hidden="true">→</span></a>
      </div>`;
    document.querySelector('.thumbs').addEventListener('click',e=>{
      const t=e.target.closest('img');if(!t)return;
      document.getElementById('mainImg').src=t.dataset.src;
      document.querySelectorAll('.thumbs img').forEach(x=>x.classList.toggle('is-on',x===t));
    });
  }
}catch{notFound();}
