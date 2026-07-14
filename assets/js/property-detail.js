import {loadProperties,findById,formatPrice} from './properties-data.js';
const root=document.getElementById('detail');
const id=new URLSearchParams(location.search).get('id');
function notFound(){
  root.innerHTML=`<a class="crumb" href="properties.html">← All properties</a>
  <div class="detail-missing"><h1>Listing not found</h1>
  <p>This property may have been sold or taken off the market.</p>
  <a class="line-link" href="properties.html">Back to properties <span aria-hidden="true">→</span></a></div>`;
}
try{
  const p=findById(await loadProperties(),id);
  if(!p){notFound();}
  else{
    document.title=`${p.title} — LapisTerra Group`;
    root.innerHTML=`
      <a class="crumb" href="properties.html">← All properties</a>
      <p class="eyebrow">${p.type==='sale'?'For Sale':'Shortlet'} · ${p.location}</p>
      <h1>${p.title}</h1>
      <div class="detail-gallery">
        <img id="mainImg" src="${p.images[0]}" alt="${p.title}">
        <div class="thumbs">${p.images.map((s,i)=>`<img data-src="${s}" ${i===0?'class="is-on"':''} src="${s}" alt="View ${i+1} of ${p.title}">`).join('')}</div>
      </div>
      <div class="detail-cols">
        <div>
          <p class="detail-price">${formatPrice(p)}</p>
          <p class="detail-specs">${p.beds} beds · ${p.baths} baths · ${p.sqm} m²</p>
          <p>${p.description}</p>
          <ul class="detail-amenities">${p.amenities.map(a=>`<li>${a}</li>`).join('')}</ul>
        </div>
        <div class="detail-cta">
          <p>Interested in this property?</p>
          <a class="line-link" href="index.html?property=${encodeURIComponent(p.title)}#contact">Enquire now <span aria-hidden="true">→</span></a>
        </div>
      </div>`;
    document.querySelector('.thumbs').addEventListener('click',e=>{
      const t=e.target.closest('img');if(!t)return;
      document.getElementById('mainImg').src=t.dataset.src;
      document.querySelectorAll('.thumbs img').forEach(x=>x.classList.toggle('is-on',x===t));
    });
  }
}catch{notFound();}
