const ORIGIN='https://konoyaba-site.pages.dev';
const AUTHOR='遊域かなと',BRAND='遊域工房';
function buildMetadata(data){
 const pages={};
 const add=(key,title,description,image,alt)=>{pages[key]={title,description,canonical:ORIGIN+key,author:AUTHOR,siteName:BRAND,type:'website',image:image?ORIGIN+'/'+image:'',imageAlt:alt||title,robots:['/bookshelf/work.html','/bookshelf/story.html'].includes(key)?'noindex,follow':'index,follow'};};
 add('/','遊域工房｜遊域かなとの作品案内','遊域かなとの創作活動「遊域工房」。代表作『このスキル、やばスギル。』をはじめ、仲間との暮らし、家族、戦い、冒険の物語を紹介します。','bookshelf/assets/people/yato.webp','代表作『このやば』の黒瀬夜斗');
 add('/konoyaba.html','このスキル、やばスギル。｜遊域かなと・遊域工房','選べない召喚から始まる、異世界ガチャと共同生活の物語。黒瀬夜斗と仲間たち、世界観、小説の掲載先を紹介します。','bookshelf/assets/people/yato.webp','黒瀬夜斗');
 add('/characters/','このやばの人物紹介｜遊域かなと・遊域工房','夜斗版の登場人物を紹介。人物の姿と性格、出会いをたどり、朝斗版との違いも確認できます。','bookshelf/assets/people/yato.webp','黒瀬夜斗');
 add('/characters/?route=asato','このやば・LIMIT BREAK版の人物紹介｜遊域かなと・遊域工房','白瀬朝斗を主人公にしたLIMIT BREAK版の登場人物を紹介。夜斗版とは異なる出会いと関係を案内します。','bookshelf/assets/people/asato.webp','白瀬朝斗');
 add('/world/','このやばの世界観｜遊域かなと・遊域工房','異世界、ダンジョン、独立した王領域《淫獄》。『このやば』の物語を支える世界と暮らしの仕組みを紹介します。');
 add('/glossary/','このやばの用語集｜遊域かなと・遊域工房','『このやば』の能力、住民、召喚、ダンジョンなどの用語を検索できる案内です。');
 add('/bookshelf/index.html','物語の本棚｜遊域かなと・遊域工房','仲間との暮らし、家族の温かさ、戦いの工夫、笑い、心に残る選択。遊域かなとの作品を楽しさから選べる本棚です。');
 add('/bookshelf/map.html','このやばの関係マップ｜遊域かなと・遊域工房','本編・夜斗版、LIMIT BREAK版、9つの来歴譚、エルナの独立長編。人物画像から物語のつながりをたどれます。','bookshelf/assets/people/yato.webp','本編・夜斗版の黒瀬夜斗');
 add('/bookshelf/work.html','作品紹介｜遊域かなと・遊域工房','遊域かなとの作品紹介。物語の楽しさを知り、確認済みの掲載先から小説を読めます。');
 add('/bookshelf/story.html','人物の物語｜遊域かなと・遊域工房','『このやば』の人物の来歴譚、独立長編、別版を紹介します。');
 for(const w of data.works)add('/bookshelf/work.html?id='+encodeURIComponent(w.id),w.title+'｜遊域かなと・遊域工房',w.desc+' 遊域かなとの作品。'+w.tags.split('／').join('、')+'の物語を紹介します。',w.id==='konoyaba'?'bookshelf/'+data.portraits.yato:w.id==='isekai-management'?'bookshelf/assets/management-cover.png':'',w.id==='isekai-management'?'異世界管理局の既存表紙':'黒瀬夜斗');
 for(const s of data.stories)add('/bookshelf/story.html?id='+encodeURIComponent(s.id),(s.id==='asato'?'このやば・LIMIT BREAK版':s.name+'の物語')+'｜遊域かなと・遊域工房',s.desc+' '+s.relation,'bookshelf/'+data.portraits[s.id],s.name);
 return {origin:ORIGIN,author:AUTHOR,brand:BRAND,pages};
}
function metadataKey(url){let p=url.pathname;if(p==='/index.html')p='/';if(p==='/konoyaba')p='/konoyaba.html';p=p.replace(/\/(characters|world|glossary)\/index\.html$/,'/$1/');if(['/characters','/world','/glossary'].includes(p))p+='/';if(p==='/bookshelf/')p='/bookshelf/index.html';if(['/bookshelf/work','/bookshelf/story','/bookshelf/map','/bookshelf/index'].includes(p))p+='.html';if(p==='/bookshelf/work.html'||p==='/bookshelf/story.html'){const id=url.searchParams.get('id');return id?p+'?id='+encodeURIComponent(id):p;}return p==='/characters/'&&url.searchParams.get('route')==='asato'?p+'?route=asato':p;}
function escapeAttr(v){return String(v).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');}
function renderHead(html,meta){const head=html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);if(!head)return html;let content=head[1].replace(/<title>[\s\S]*?<\/title>/gi,'').replace(/<meta\b[^>]*(?:name|property)=["'](?:description|author|robots|og:[^"']+|twitter:[^"']+)["'][^>]*>/gi,'').replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi,'');const tag=(key,value,property=false)=>'<meta '+(property?'property':'name')+'="'+key+'" content="'+escapeAttr(value)+'">';let tags='<title>'+escapeAttr(meta.title)+'</title>'+tag('description',meta.description)+tag('author',meta.author)+tag('robots',meta.robots)+'<link rel="canonical" href="'+escapeAttr(meta.canonical)+'">'+tag('og:type','website',true)+tag('og:locale','ja_JP',true)+tag('og:site_name',meta.siteName,true)+tag('og:title',meta.title,true)+tag('og:description',meta.description,true)+tag('og:url',meta.canonical,true)+tag('twitter:card',meta.image?'summary_large_image':'summary')+tag('twitter:title',meta.title)+tag('twitter:description',meta.description);if(meta.image)tags+=tag('og:image',meta.image,true)+tag('og:image:alt',meta.imageAlt,true)+tag('twitter:image',meta.image)+tag('twitter:image:alt',meta.imageAlt);return html.replace(head[0],'<head>'+content+'\n'+tags+'</head>');}
function renderBrowserMetadata(metadata){
 function applyMetadata(metadata,metadataKey){
  function update(){const meta=metadata.pages[metadataKey(new URL(location.href))];if(!meta)return;document.title=meta.title;
   function set(key,value,property=false){let el=document.head.querySelector('meta['+(property?'property':'name')+'="'+key+'"]');if(!el){el=document.createElement('meta');el.setAttribute(property?'property':'name',key);document.head.append(el);}el.content=value;}
   set('robots',meta.robots);set('description',meta.description);set('author',meta.author);set('og:site_name',meta.siteName,true);set('og:title',meta.title,true);set('og:description',meta.description,true);set('og:url',meta.canonical,true);set('twitter:title',meta.title);set('twitter:description',meta.description);set('twitter:card',meta.image?'summary_large_image':'summary');
   let canonical=document.head.querySelector('link[rel=canonical]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical);}canonical.href=meta.canonical;
   if(meta.image){set('og:image',meta.image,true);set('og:image:alt',meta.imageAlt,true);set('twitter:image',meta.image);set('twitter:image:alt',meta.imageAlt);}
  }
  update();window.addEventListener('popstate',update);document.addEventListener('click',event=>{if(event.target.closest?.('[data-character-route]'))update();});
 }
 return '/* Generated from tools/site-metadata.cjs and bookshelf/data.js. */\n('+applyMetadata.toString()+')('+JSON.stringify(metadata)+','+metadataKey.toString()+');\n';
}
module.exports={buildMetadata,metadataKey,renderHead,renderBrowserMetadata};
