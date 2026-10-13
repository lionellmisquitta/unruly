// Frame metadata is bounded by layer count; never traverse stroke points here.
// Coordinates describe actual full-viewport work, not a dirty-region promise.
export function describeFrame(board,view,live,metrics){
 const index=board.layers.findIndex(l=>l.id===board.activeLayer),active=board.layers[index];
 const visible=board.layers.filter(l=>l.visible&&l.opacity!==0);
 const upper=board.layers.slice(index+1).some(l=>l.visible&&l.opacity!==0);
 const canRetain=!metrics.effectBackingBytes&&!!live&&!!active?.visible&&active.opacity!==0&&(!upper||!!metrics.layerCacheApplied);
 const dimensions=metrics.surfaces[0];
 return Object.freeze({
  documentRevision:board.revision,activeLayer:board.activeLayer,
  visibleLayerIds:Object.freeze(visible.map(l=>l.id)),
  view:Object.freeze({x:view.x,y:view.y,scale:view.scale}),
  region:Object.freeze({space:'backing-pixels',x:0,y:0,width:dimensions.width,height:dimensions.height}),
  workRegion:'full-viewport',mode:metrics.mode,
  completedStrokesReplayed:metrics.completedStrokesReplayed,
  canRetainLowerLayers:canRetain,
  replayReason:metrics.effectBackingBytes?'isolated-group-effects':!live?'no-live-stroke':!active?.visible||active.opacity===0?'inactive-layer':upper?(metrics.layerCacheApplied?'retained-upper-layers':'visible-upper-layers'):'top-layer-live',
  dpr:metrics.dpr,backingBytes:metrics.backingBytes,layerCacheBytes:metrics.layerCacheBytes||0,totalBackingBytes:metrics.totalBackingBytes||metrics.backingBytes
 });
}
