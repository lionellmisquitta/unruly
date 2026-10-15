import {grainFromImage,validateGrain} from './grain.js';
import {decodeImageFile} from './image-import.js';
export function initGrainUI({$,getTip,preview}){
 let decoded=null,source=null,loading=false,epoch=0;
 function sync(t){epoch++;decoded=null;source=t?.grain?structuredClone(t.grain):null;loading=false;$('grain-enabled').checked=!!source;$('grain-invert').checked=false;$('grain-invert').disabled=true;$('grain-scale').value=source?.scale??32;$('grain-depth').value=source?.depth??.65;$('grain-rotation').value=source?.rotation??0;$('grain-name').textContent=source?'Saved portable grain':'No grain imported';}
 function read(t){if(loading)throw Error('Wait for grain image to finish loading');if(!$('grain-enabled').checked){delete t.grain;t.version=1;return t;}if(!source)throw Error('Import a grain image first');const g=decoded?grainFromImage(decoded,$('grain-invert').checked):structuredClone(source);for(const k of ['scale','depth','rotation'])g[k]=$('grain-'+k).value===''?NaN:Number($('grain-'+k).value);validateGrain(g);t.version=2;t.grain=g;return t;}
 $('grain-upload').onclick=()=>{if(getTip()&&!loading)$('grain-file').click();};
 $('grain-file').onchange=async()=>{const file=$('grain-file').files[0];$('grain-file').value='';if(!file||!getTip()||loading)return;const token=epoch;loading=true;try{const d=await decodeImageFile(file);if(token!==epoch||!getTip())return;decoded=d;source=grainFromImage(d,false);$('grain-enabled').checked=true;$('grain-invert').checked=false;$('grain-invert').disabled=false;$('grain-name').textContent=d.name+' · '+source.width+' × '+source.height;loading=false;preview();}catch(e){if(token===epoch)$('tip-error').textContent='Grain rejected · '+e.message;}finally{if(token===epoch)loading=false;}};
 for(const id of ['grain-enabled','grain-scale','grain-depth','grain-rotation','grain-invert'])$(id).oninput=preview;
 $('grain-clear').onclick=()=>{if(!getTip()||loading)return;sync(null);preview();};
 return{sync,read,close:()=>{epoch++;decoded=null;source=null;loading=false;}};
}
