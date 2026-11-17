(() => {
  const mount=document.querySelector('[data-character-showcase]');
  if(!mount)return;
  const routes=window.KONOYABA_CHARACTER_ROUTES;
  const visuals={
    '黒瀬夜斗':{id:'yato',color:'#b99aff'},'ファステ・フェルン':{id:'faste',color:'#9fb7a0'},
    'リゼ・アルノール':{id:'lise',color:'#a9bed1'},'レイナ・クロフォード':{id:'reina',color:'#d6b4d4'},
    '冬月千代':{id:'chiyo',color:'#d09b9f'},'ヴィオラ・ベル':{id:'viola',color:'#d8b77b'},
    'セリナ・ウェルズ':{id:'serina',color:'#9dbfb6'},'ナーヴァ':{id:'nava',color:'#d3a17e'},'縁':{id:'enishi',color:'#ccc6a5'}
  };
  const common=characters.filter(p=>visuals[p.name]).map(p=>({...p,...visuals[p.name],art:'../images/characters/'+p.image}));
  const profilesFor=route=>routes[route].profiles?routes[route].profiles.map(p=>{
    if(!p.baseId)return {...p};
    const base=common.find(c=>c.id===p.baseId);
    if(!base)throw new Error('共通人物の対応を確認してください');
    return {...base,...p};
  }):common;
  const selector=document.querySelector('[data-character-selector]'),count=document.querySelector('[data-character-count]'),announcement=document.querySelector('[data-character-announcement]');
  const labels={main:'主人公',local:'現地の人物',summoned:'召喚された人物',other:'小さな出会い'};
  const thumbnailStyle=id=>{
    const candidate=window.KONOYABA_PORTRAIT_CROPS?.[id];
    const crop=candidate&&Number.isFinite(candidate.size)&&candidate.size>0&&Number.isFinite(candidate.x)&&Number.isFinite(candidate.y)?candidate:{x:267.43,y:109.44,size:297.14};
    return '--portrait-width:'+(832/crop.size*100).toFixed(4)+'%;--portrait-left:'+(-crop.x/crop.size*100).toFixed(4)+'%;--portrait-top:'+(-crop.y/crop.size*100).toFixed(4)+'%';
  };
  const nameHTML=name=>name.split('・').map(part=>'<span class="choice-name-part">'+escapeHTML(part)+'</span>').join('・<wbr>');
  let route='yato',selected='',filter='all';
  const lastSelected={};
  const profiles=()=>profilesFor(route),visible=()=>profiles().filter(p=>filter==='all'||p.type===filter);
  function syncURL(){const url=new URL(location.href);if(route==='yato')url.searchParams.delete('route');else url.searchParams.set('route',route);url.hash=selected;if(url.href!==location.href)history.pushState(null,'',url.href);}
  function render(){
    const all=profiles(),list=visible(),p=all.find(c=>c.id===selected);
    document.querySelectorAll('[data-character-route]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.characterRoute===route)));
    document.querySelector('[data-route-caption]').textContent=routes[route].label+' CHARACTER SELECTION';
    document.querySelector('[data-route-introduction]').textContent=routes[route].introduction;
    document.querySelector('[data-route-note]').textContent=routes[route].note;
    document.title='主要キャラクター・'+routes[route].label+'｜このやば 公式サイト';
    document.querySelectorAll('[data-showcase-filter]').forEach(button=>{const type=button.dataset.showcaseFilter;button.hidden=type!=='all'&&!all.some(c=>c.type===type);button.setAttribute('aria-pressed',String(type===filter));});
    selector.innerHTML=list.map(c=>`<button class="portrait-choice" type="button" data-character-id="${c.id}" aria-pressed="${c.id===selected}" aria-controls="character-profile"><span class="portrait-choice-image" style="${thumbnailStyle(c.id)}">${c.art?`<img src="${c.art}" alt="" width="832" height="1216" loading="lazy" decoding="async" ${c.id==='enishi'?'class="creature-thumb"':''}>`:`<span aria-hidden="true">${escapeHTML(c.name.slice(0,1))}</span>`}</span><span>${nameHTML(c.name)}</span></button>`).join('');
    selector.dataset.route=route;
    count.textContent=String(list.length).padStart(2,'0');
    mount.style.setProperty('--character-accent',p.color);
    mount.innerHTML=`<article class="character-profile" id="character-profile" aria-labelledby="character-name"><div class="character-art"><span class="art-index" aria-hidden="true">${String(all.findIndex(c=>c.id===selected)+1).padStart(2,'0')}</span>${p.art?`<img src="${p.art}" alt="${escapeHTML(p.name)}の紹介用立ち絵" width="832" height="1216" decoding="async" fetchpriority="high">`:'<div class="art-awaiting"><span aria-hidden="true">◇</span><p>立ち絵準備中</p></div>'}<p class="art-caption">KONOYABA / CHARACTER VISUAL</p></div><div class="character-copy"><p class="profile-category">${labels[p.type]}<span>${escapeHTML(p.badge)}</span></p><p class="profile-reading">${escapeHTML(p.reading)}</p><h2 id="character-name">${nameHTML(p.name)}</h2><p class="profile-epithet">${escapeHTML(p.title)}</p><div class="profile-divider" aria-hidden="true"><span>◆</span></div><p class="profile-description">${escapeHTML(p.description)}</p><dl class="profile-facts"><div><dt>紹介対象</dt><dd data-profile-route>${routes[route].label}</dd></div><div><dt>出会い</dt><dd>${labels[p.type]}</dd></div></dl><a class="profile-read" href="../konoyaba.html#read">シリーズを読む<span aria-hidden="true">↗</span></a><div class="profile-navigation"><button type="button" data-character-step="-1" aria-label="前のキャラクター">←</button><p><strong>${String(list.findIndex(c=>c.id===selected)+1).padStart(2,'0')}</strong><span> / ${String(list.length).padStart(2,'0')}</span></p><button type="button" data-character-step="1" aria-label="次のキャラクター">→</button></div></div></article>`;
    const readLink=mount.querySelector('.profile-read');readLink.href=routes[route].readUrl;readLink.firstChild.textContent=routes[route].label+'を読む';
    announcement.textContent=routes[route].label+'・'+p.name+'の紹介を表示しました。';
  }
  function choose(id,push=true){if(!profiles().some(p=>p.id===id))return;selected=id;lastSelected[route]=id;if(!visible().some(p=>p.id===id))filter='all';render();if(push)syncURL();}
  function setRoute(next,push=true){if(!routes[next])return;lastSelected[route]=selected;route=next;filter='all';const list=profiles();choose(list.some(p=>p.id===selected)?selected:lastSelected[route]||list[0].id,push);}
  function readURL(){const url=new URL(location.href),key=url.searchParams.get('route');route=Object.hasOwn(routes,key)?key:'yato';filter='all';const list=profiles();choose(list.find(p=>'#'+p.id===url.hash)?.id||list[0].id,false);}
  selector.addEventListener('click',event=>{const button=event.target.closest('[data-character-id]');if(!button)return;const id=button.dataset.characterId;choose(id);selector.querySelector(`[data-character-id="${id}"]`).focus({preventScroll:true});});
  selector.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;const button=event.target.closest('[data-character-id]');if(!button)return;event.preventDefault();const list=visible(),index=list.findIndex(p=>p.id===button.dataset.characterId),next=event.key==='Home'?0:event.key==='End'?list.length-1:(index+(event.key==='ArrowLeft'?-1:1)+list.length)%list.length;choose(list[next].id);selector.querySelector(`[data-character-id="${list[next].id}"]`).focus({preventScroll:true});});
  mount.addEventListener('click',event=>{const button=event.target.closest('[data-character-step]');if(!button)return;const list=visible(),index=list.findIndex(p=>p.id===selected),step=Number(button.dataset.characterStep);choose(list[(index+step+list.length)%list.length].id);mount.querySelector(`[data-character-step="${step}"]`).focus({preventScroll:true});});
  document.querySelectorAll('[data-showcase-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.showcaseFilter;const list=visible();if(list.length)choose(list.some(p=>p.id===selected)?selected:list[0].id);}));
  document.querySelectorAll('[data-character-route]').forEach(button=>button.addEventListener('click',()=>setRoute(button.dataset.characterRoute)));
  window.addEventListener('popstate',readURL);
  readURL();
})();
