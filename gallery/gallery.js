(()=>{'use strict';const arts=window.GALLERY_ARTWORKS.filter(art => art.style === '遊域工房式墨絵'),groups=[{id:'konoyaba',work:'このスキル、やばスギル。 ～ガチャ沼に堕ちたら俺の負け～',mark:'本編挿絵',desc:'黒瀬夜斗の物語を、場面からたどる。'},{id:'musician-isekai',work:'歌で仲間を、国を支える物語',mark:'音楽と仲間',desc:'三人の個性が、一つの音になる。'},{id:'maou-kunizukuri',work:'病院で孤独な生涯を送った僕は、今度こそ仲間と暮らしたいです ～僕の理想国家が危険視されている件～',mark:'仲間と暮らす日々',desc:'穏やかな朝と、帰りたくなる場所のイメージ。'},{id:'familiar-armor',work:'わたしの鎧は、甘えん坊の小狐です',mark:'本編挿絵',desc:'リリアと小狐のルカが家族になった日。'},{id:'isekai-management',work:'お電話ありがとうございます。こちらは異世界管理局です。',mark:'本編挿絵',desc:'異世界からの電話に応える、夏希としのぶ。'},{id:'story-8f3cb7a0',work:'公爵家兄妹の日常　～妹に「お兄ちゃん」と呼ばれた日から～',mark:'本編挿絵',desc:'ユリウスとセシリアが過ごす、兄妹の時間。'}];const $=s=>document.querySelector(s),el=(tag,className,text)=>{const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n};let opener;
const intro=id=>'../bookshelf/work?id='+encodeURIComponent(id);
function artworkSource(art, heading = false) {
  const list = el('dl', 'art-source');
  const rows = [['作品', art.work], ['場面', [art.part, art.scene].filter(Boolean).join(' ／ ') || art.note]];
  for (const [label, value] of rows) {
    if (!value) continue;
    const detail = el('dd');
    if (heading && label === '作品') detail.append(el('h2', '', value));
    else detail.textContent = value;
    list.append(el('dt', '', label), detail);
  }
  return list;
}
function openArt(art,button){opener=button;$('#art-source').replaceChildren(artworkSource(art));$('#art-title').textContent=art.title;$('#art-caption').textContent=art.caption;$('#art-note').textContent=art.note;$('#art-state').textContent=art.status;$('#art-state').className='state'+(art.status==='正式採用済み'?'':' reference');$('#art-image').src='art/'+art.asset;$('#art-image').alt=art.title;$('#art-work-link').href=intro(art.workId);document.body.classList.add('modal-open');$('#art-dialog').showModal();}
function draw(filter){const showing=groups.filter(g=>arts.some(a=>a.workId===g.id)&&(filter==='all'||g.id===filter));$('#work-galleries').replaceChildren(...showing.map(g=>{const section=el('section','work-gallery');section.dataset.work=g.id;const head=el('div','work-head'),title=el('div');title.append(el('span','work-mark',g.mark),el('h2','',g.work),el('p','',g.desc));const link=el('a','','作品紹介を見る');link.href=intro(g.id);head.append(title,link);const entries=arts.filter(a=>a.workId===g.id),grid=el('div','art-grid'+(entries.length===1?' single':''));for(const art of entries){const card=el('article','art-card'),button=el('button','art-frame');button.type='button';button.setAttribute('aria-label',art.work+'「'+art.title+'」を大きく見る');button.dataset.art=art.id;const img=el('img');img.src='art/'+art.asset;img.alt=art.title;img.loading='eager';img.width=art.width || (art.id==='band'?1536:1216);img.height=art.height || (art.id==='band'?1024:832);button.append(img,el('span','enlarge','大きく見る'));button.addEventListener('click',()=>openArt(art,button));const info=el('div','art-info'),state=el('div','state-row');state.append(el('span','state'+(art.status==='正式採用済み'?'':' reference'),art.status),el('span','art-type',art.type));info.append(state,el('h3','',art.title),el('p','',art.caption),el('p','art-note',art.note));if (entries.length === 1) info.append(link);card.append(artworkSource(art, entries.length === 1),button,info);grid.append(card)}if (entries.length > 1) section.append(head);section.append(grid);return section}));const count=arts.filter(a=>filter==='all'||a.workId===filter).length;$('#result-count').textContent=showing.length+'作品・'+count+'枚';document.querySelector('.view-hint').hidden=count===0;}
document.querySelectorAll('[data-filter]').forEach(button=>{button.hidden=button.dataset.filter!=='all'&&!arts.some(art=>art.workId===button.dataset.filter)});document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));draw(button.dataset.filter)}));$('.close').addEventListener('click',()=>$('#art-dialog').close());$('#art-dialog').addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus()});$('#art-dialog').addEventListener('click',event=>{if(event.target===$('#art-dialog')){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close()}});draw('all');
const requestedId=new URLSearchParams(location.search).get('art');
if(requestedId){
  const selected=arts.find(art=>art.id===requestedId);
  const trigger=selected && [...document.querySelectorAll('button[data-art]')].find(button=>button.dataset.art===selected.id);
  if(trigger)openArt(selected,trigger);
}
})();


