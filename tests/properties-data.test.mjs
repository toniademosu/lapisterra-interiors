import test from 'node:test';
import assert from 'node:assert/strict';
import {filterByType,findById,featured,formatPrice,cardHTML} from '../assets/js/properties-data.js';

const fx=[
  {id:'a',title:'A',type:'sale',price:450000,currency:'$',featured:true,location:'Lagos',beds:4,baths:4,sqm:320,images:['x.jpg'],amenities:[],description:''},
  {id:'b',title:'B',type:'shortlet',price:180,currency:'$',featured:true,location:'Lagos',beds:2,baths:2,sqm:95,images:['y.jpg'],amenities:[],description:''},
  {id:'c',title:'C',type:'sale',price:900000,currency:'$',featured:false,location:'Abuja',beds:5,baths:5,sqm:500,images:['z.jpg'],amenities:[],description:''},
  {id:'d',title:'D',type:'shortlet',price:120,currency:'$',featured:true,location:'Accra',beds:1,baths:1,sqm:60,images:['w.jpg'],amenities:[],description:''},
  {id:'e',title:'E',type:'sale',price:300000,currency:'$',featured:true,location:'Lagos',beds:3,baths:3,sqm:210,images:['v.jpg'],amenities:[],description:''},
];

test('filterByType all returns everything',()=>assert.equal(filterByType(fx,'all').length,5));
test('filterByType sale',()=>assert.deepEqual(filterByType(fx,'sale').map(p=>p.id),['a','c','e']));
test('findById hit',()=>assert.equal(findById(fx,'c').title,'C'));
test('findById miss returns null',()=>assert.equal(findById(fx,'zzz'),null));
test('featured caps at 3',()=>assert.equal(featured(fx).length,3));
test('formatPrice sale',()=>assert.equal(formatPrice(fx[0]),'$450,000'));
test('formatPrice shortlet per night',()=>assert.equal(formatPrice(fx[1]),'$180 / night'));
test('cardHTML contains link and title',()=>{
  const html=cardHTML(fx[0]);
  assert.match(html,/property\.html\?id=a/);
  assert.match(html,/A/);
});
