import {loadProperties,filterByType,cardHTML} from './properties-data.js';
const grid=document.getElementById('grid');
let all=[];
function render(type){
  grid.innerHTML=filterByType(all,type).map(cardHTML).join('')||'<p>No listings in this category right now.</p>';
  document.querySelectorAll('#grid .reveal').forEach(el=>el.classList.add('in'));
}
document.querySelector('.filter').addEventListener('click',e=>{
  const btn=e.target.closest('button');if(!btn)return;
  document.querySelectorAll('.filter button').forEach(b=>b.classList.toggle('is-on',b===btn));
  render(btn.dataset.type);
});
try{all=await loadProperties();render('all');}catch{/* fallback in DOM */}
