export async function loadProperties(url='data/properties.json'){
  const res=await fetch(url);
  if(!res.ok)throw new Error(`properties load failed: ${res.status}`);
  return res.json();
}
export function filterByType(list,type){return type==='all'?list:list.filter(p=>p.type===type);}
export function findById(list,id){return list.find(p=>p.id===id)??null;}
export function featured(list){return list.filter(p=>p.featured).slice(0,3);}
export function formatPrice(p){
  const s=`${p.currency}${p.price.toLocaleString('en-US')}`;
  return p.type==='shortlet'?`${s} / night`:s;
}
export function cardHTML(p){
  return `<a class="prop-card reveal" href="property.html?id=${encodeURIComponent(p.id)}">
    <span class="frame"><img src="${p.images[0]}" alt="${p.title}"></span>
    <span class="prop-tag">${p.type==='sale'?'For Sale':'Shortlet'}</span>
    <span class="prop-body"><strong>${p.title}</strong><em>${p.location}</em><b>${formatPrice(p)}</b></span>
  </a>`;
}
