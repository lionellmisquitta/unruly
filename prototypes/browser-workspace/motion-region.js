// Region conversion is disposable until an explicit geometry commit.
import {decodeMotionMask} from './motion.js';
import {createHistory} from './model.js';
import {prepareRegionTransform} from './wand.js';
import {remainingRegionTiles} from './lasso-region.js';
export function prepareMotionRegion(board,target,snapshotRegion){
 const layer=board.layers.find(l=>l.id===target.layerId);if(!layer)throw Error('Motion region layer missing');const region={board,layerId:layer.id,snapshot:snapshotRegion(layer,target.rect),mask:decodeMotionMask(target)};
 region.remainingFactory=()=>remainingRegionTiles(layer,region,snapshotRegion);
 const h=createHistory(board),prepared=prepareRegionTransform(h,{...region,board:h.board});
 return{board:prepared.working.board,target:{kind:'objects',ids:[prepared.id]}};
}
