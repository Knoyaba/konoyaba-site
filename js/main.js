const characters = [
  {name:'黒瀬夜斗', reading:'KUROSE YATO', type:'main', badge:'王', title:'《淫獄》の王', description:'現代日本から転移した成人男性。ガチャ好きだが、沼へ堕ちることを警戒する。住民を所有物として扱わず、本人の選択を尊重しようとする。'},
  {name:'ファステ・フェルン', reading:'FASTE FERN', type:'local', badge:'LOCAL', title:'逃げ出した家政婦', description:'以前の雇用先から逃げ出した家政婦。《淫獄》で生活、食事、紅茶を担う、一人目の現地加入住民。'},
  {name:'リゼ・アルノール', reading:'LISE ARNOLD', type:'summoned', badge:'R', title:'最後まで残った傭兵', description:'強く、口が鋭い元傭兵。戦闘、護衛、危険察知に優れ、外出組の安全判断を担う。'},
  {name:'レイナ・クロフォード', reading:'REINA CRAWFORD', type:'summoned', badge:'SR', title:'籠の中の令嬢', description:'将来を周囲に決められてきた令嬢。学習が早く、品質や用途を見極める目を持つ。'},
  {name:'冬月千代', reading:'FUYUTSUKI CHIYO', type:'summoned', badge:'SSR', title:'落城の女城主', description:'落城を経験した女城主。統治、備蓄、防衛、継続運用に優れ、《淫獄》内の記録と運営を担う。'},
  {name:'ヴィオラ・ベル', reading:'VIOLA BELL', type:'summoned', badge:'N', title:'場末の賭け師', description:'軽く見えて、確率、嘘、危険と見返りを読む賭け師。外界での交渉と情報収集を担う。'},
  {name:'セリナ・ウェルズ', reading:'SERINA WELLS', type:'summoned', badge:'SR', title:'気ままな放浪者', description:'旅と生存の経験を持つ放浪者。住民登録を残したまま、自らの意思で《淫獄》の外を旅している。'},
  {name:'ナーヴァ', reading:'NAVA', type:'summoned', badge:'UR', title:'戦場を焼き尽くした竜', description:'軍勢を焼き尽くせる古竜。規格外の力を持つが、現在は夜斗たちと同居し、狩猟の運用作りに参加している。'}
];

const glossary = [
  {term:'《淫獄の王》', reading:'いんごくのおう', text:'黒瀬夜斗が持つ固有スキル。《淫獄》という特殊領域と、成人女性を住民として召喚する機能を持つ。'},
  {term:'《淫獄》', reading:'いんごく', text:'現地世界とは別の王領域。住民と共同生活を重ねながら、安全性や利便性が段階的に発展していく。'},
  {term:'《淫獄石》', reading:'いんごくせき', text:'《淫獄の王》の召喚などに使用する資源。夜斗自身の性的欲望が刺激された時に生成される。'},
  {term:'通常《住民召喚》', reading:'じゅうみんしょうかん', text:'《淫獄石》一万個を使う召喚。人物、種族、職業、能力、性格、出身世界、過去を夜斗が指定することはできない。'},
  {term:'《住民》', reading:'じゅうみん', text:'《淫獄》へ登録された人物。登録されても、忠誠、好意、服従、恋愛感情などは自動付与されない。'},
  {term:'《帰還石》', reading:'きかんせき', text:'登録住民が接続地点の近くまで戻ったことを夜斗へ知らせる目印。鍵や通信機ではなく、いわば呼び鈴。'},
  {term:'ダンジョン', reading:'だんじょん', text:'探索者が資源を求めて入る一方、魔物が外へ流出し得る領域。固定管理区画の奥に、接続先が変化する領域がある。'},
  {term:'スキル', reading:'すきる', text:'人物の経験や性質と結びつく能力。名前やレベルだけでは実際の強さのすべてを表せない。'}
];

const escapeHTML = value => value.replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const cardHTML = c => `<article class="character-card" data-type="${c.type}"><div class="character-symbol" aria-hidden="true"><span>${escapeHTML(c.badge)}</span></div><div><p class="character-reading">${escapeHTML(c.reading)}</p><h2>${escapeHTML(c.name)}</h2><p class="character-title">${escapeHTML(c.title)}</p><p>${escapeHTML(c.description)}</p></div></article>`;

const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
if (menuButton && nav) { menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') === 'true'; menuButton.setAttribute('aria-expanded', String(!open)); nav.classList.toggle('is-open', !open); }); }

const preview = document.querySelector('[data-character-preview]');
if (preview) preview.innerHTML = characters.slice(0, 4).map(cardHTML).join('');

const grid = document.querySelector('[data-character-grid]');
if (grid) {
  const render = type => { grid.innerHTML = characters.filter(c => type === 'all' || c.type === type || (type === 'local' && c.type === 'main')).map(cardHTML).join(''); };
  render('all');
  document.querySelectorAll('[data-character-filter]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-character-filter]').forEach(b => b.classList.remove('is-active')); button.classList.add('is-active'); render(button.dataset.characterFilter); }));
}

const glossaryList = document.querySelector('[data-glossary-list]');
const glossarySearch = document.querySelector('[data-glossary-search]');
const resultCount = document.querySelector('[data-result-count]');
if (glossaryList && glossarySearch) {
  const renderGlossary = query => { const q = query.trim().toLowerCase(); const results = glossary.filter(item => `${item.term} ${item.reading} ${item.text}`.toLowerCase().includes(q)); glossaryList.innerHTML = results.map(item => `<article><div><p>${escapeHTML(item.reading)}</p><h2>${escapeHTML(item.term)}</h2></div><p>${escapeHTML(item.text)}</p></article>`).join('') || '<p class="empty-message">該当する用語はありません。</p>'; resultCount.textContent = `${results.length}件の用語`; };
  renderGlossary(''); glossarySearch.addEventListener('input', e => renderGlossary(e.target.value));
}
