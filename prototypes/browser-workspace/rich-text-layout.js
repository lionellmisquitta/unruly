// Bounded, non-destructive rich-text layout foundation. Source content is never rewritten.
// Not wired into the editor until schema/rendering/browser acceptance is complete.
const valid=n=>typeof n==='number'&&Number.isFinite(n);
const graphemes=value=>[...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(value)].map(item=>item.segment);
export function layoutRichText({content,font='sans-serif',fontSize=32,maxWidth=600,lineSpacing=1.4,fontCSS,measure}){
  if(typeof content!=='string'||!content.trim()||content.length>2048||/[\u0000-\u0008\u000b-\u001f\u007f]/u.test(content))throw Error('Invalid text content');
  if(!(typeof font==='string'&&font.length>0&&font.length<=80&&/^[\p{L}\p{N}][\p{L}\p{N} ._+\-]*$/u.test(font))||!valid(fontSize)||fontSize<8||fontSize>256)throw Error('Invalid font');
  if(!valid(maxWidth)||maxWidth<1||maxWidth>1024||!valid(lineSpacing)||lineSpacing<1||lineSpacing>3||typeof measure!=='function')throw Error('Invalid text layout');
  const original=content.replace(/\r\n?/g,'\n');
  const paragraphs=original.split('\n');
  if(paragraphs.length>32)throw Error('Too many text lines');
  const lines=[];
  const widthOf=part=>{const width=measure(part,fontCSS||`${fontSize}px ${font}`);if(!valid(width)||width<0)throw Error('Invalid font measurement');return width;};
  for(let paragraph=0;paragraph<paragraphs.length;paragraph++){
    const chars=graphemes(paragraphs[paragraph]);
    if(!chars.length){lines.push({text:'',paragraph});continue;}
    let start=0;
    while(start<chars.length){
      let lo=start+1,hi=chars.length,fit=start;
      while(lo<=hi){const mid=Math.floor((lo+hi)/2),piece=chars.slice(start,mid).join('');
        if(widthOf(piece)<=maxWidth){fit=mid;lo=mid+1;}else hi=mid-1;
      }
      if(fit===start)throw Error('Grapheme wider than text box');
      let end=fit;
      if(fit<chars.length){for(let i=fit-1;i>=start;i--){if(/[\t ]/u.test(chars[i])){end=i+1;break;}}}
      lines.push({text:chars.slice(start,end).join(''),paragraph});
      if(lines.length>32)throw Error('Too many wrapped lines');
      start=end;
    }
  }
  const height=Math.ceil(lines.length*fontSize*lineSpacing+8);
  if(height>1024)throw Error('Text box exceeds 1024px');
  return {source:original,lines,lineSpacing,font,fontSize,maxWidth,height};
}
