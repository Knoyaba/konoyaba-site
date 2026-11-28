(() => {
  const works = (window.GALLERY_ARTWORKS || []).filter(
    art => art.status === '正式採用済み' && art.style === '遊域工房式墨絵' && art.asset
  );
  const figure = document.querySelector('.yk-entry-art');
  if (!figure || !works.length) return;

  const key = 'yk-home-illustration-rotation-v1';
  let history = {};
  try { history = JSON.parse(localStorage.getItem(key)) || {}; } catch {}
  const seen = Array.isArray(history.seen) ? history.seen : [];
  let pool = works.filter(art => !seen.includes(art.id));
  const startCycle = pool.length === 0;
  if (startCycle) pool = works.length > 1 ? works.filter(art => art.id !== history.last) : works;
  const art = pool[Math.floor(Math.random() * pool.length)];

  const img = new Image(art.width, art.height);
  img.alt = art.scene;
  img.onload = () => {
    figure.querySelector('img').replaceWith(img);
    const caption = figure.querySelector('figcaption');
    caption.replaceChildren();
    for (const line of [art.work, art.part, '挿絵「' + art.title + '」']) {
      const span = document.createElement('span');
      span.textContent = line;
      caption.append(span);
    }
    document.querySelector('.gallery-home-entry .scene-summary').textContent = art.scene + '。';
    figure.dataset.art = art.id;
    try { localStorage.setItem(key, JSON.stringify({last: art.id, seen: [...(startCycle ? [] : seen), art.id]})); } catch {}
  };
  const thumb = 'gallery/thumbs/' + encodeURIComponent(art.asset.replace(/\.[^.]+$/, ''));
  img.onerror = () => {
    img.onerror = null;
    img.removeAttribute('srcset');
    img.src = 'gallery/art/' + encodeURIComponent(art.asset);
  };
  img.sizes = '(max-width: 650px) 92vw, 520px';
  img.srcset = thumb + '-480.webp 480w, ' + thumb + '-960.webp 960w';
  img.src = thumb + '-480.webp';
})();