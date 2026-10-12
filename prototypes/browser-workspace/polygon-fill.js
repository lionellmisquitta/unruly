import {polygonWindow,polygonPixels} from './lasso-region.js';
import {validateSnapshot} from './wand.js';
import {fillPixels} from './bucket-fill.js';
export {polygonWindow as encloseWindow};
// Geometric fill uses the complete polygon mask, including transparent pixels.
// Colour boundaries/gap tolerance belong to Bucket, not this operation.
export function prepareEnclose(s,polygon,settings){validateSnapshot(s);const rect=polygonWindow(polygon);if(s.x!==rect.x||s.y!==rect.y||s.width!==rect.width||s.height!==rect.height)throw Error('Enclose snapshot does not match the bounded outline');const {mask,bounds}=polygonPixels(s,polygon);if(!bounds)throw Error('No pixels enclosed');return {mask,paint:fillPixels(s,mask,settings)};}
