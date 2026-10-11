// UI percentages map to stable document-space widths. Persist existing widths unchanged.
export const maxBrushWidth=family=>family==='airbrush'?160:40;
export function brushWidthFromPercent(percent,family){
 if(!Number.isFinite(percent)||percent<0||percent>100)throw Error('Brush size percentage must be 0 to 100');
 const max=maxBrushWidth(family),ratio=percent/100;
 return Math.round((1+(max-1)*ratio*ratio)*100)/100;
}
export function brushPercentFromWidth(width,family){
 if(!Number.isFinite(width))throw Error('Invalid brush width');
 const max=maxBrushWidth(family);
 return Math.round(100*Math.sqrt((Math.max(1,Math.min(max,width))-1)/(max-1)));
}
