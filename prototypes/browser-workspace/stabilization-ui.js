import {smoothingAmount} from './stabilization.js';
const KEY='unruly-stroke-smoothing-v1';
export function initStabilizationUI({$,blocked,status,storage}){
 let amount=0;try{storage??=globalThis.localStorage;amount=smoothingAmount(storage.getItem(KEY));}catch{}
 const range=$('stroke-smoothing'),output=$('stroke-smoothing-value');
 function sync(){range.value=String(amount);output.value=amount?amount+'%':'Off';range.setAttribute('aria-valuetext',amount?amount+' percent':'Off');}
 range.addEventListener('input',()=>{
  if(blocked()){sync();return;}
  amount=smoothingAmount(range.value);sync();
  try{storage.setItem(KEY,String(amount));}catch{status('Stroke smoothing changed for this session · device setting could not be saved',true);}
 });
 sync();return {amount:()=>amount};
}
