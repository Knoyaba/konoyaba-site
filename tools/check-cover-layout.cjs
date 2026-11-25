// Run with Playwright and Edge available, against dist/ or a deployed site.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');

const project = path.resolve(__dirname, '..');
const base = process.argv[2] || pathToFileURL(path.join(project, 'dist') + path.sep).href;
const screenshots = process.argv[3];
const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(project, 'bookshelf/data.js'), 'utf8'), context);
const ids = Array.from(context.window.BOOKSHELF_DATA.works, work => work.id).sort();

async function measure(cover, label) {
  const size = await cover.evaluate(async el => {
    if (el instanceof HTMLImageElement) await el.decode();
    const r = el.getBoundingClientRect();
    const clipped = [...el.querySelectorAll('strong,small')].some(child => {
      const c = child.getBoundingClientRect();
      return c.top < r.top - 1 || c.bottom > r.bottom + 1;
    });
    return {width:r.width, height:r.height, clipped,
      pixels:el instanceof HTMLImageElement ? [el.naturalWidth,el.naturalHeight] : null};
  });
  assert(size.width > 0 && Math.abs(size.height - size.width * 711/500) < 1, label+' cover ratio');
  assert(!size.clipped, label+' cover lettering clipped');
  if (size.pixels) assert.deepEqual(size.pixels,[500,711],label+' file dimensions');
  return size.width;
}

async function verify(browser, width) {
  const page = await browser.newPage({viewport:{width,height:width<600?844:900},isMobile:width<600});
  const errors=[];
  page.on('pageerror', error => errors.push(error.message));
  const shelfWidths=[], detailWidths=[];
  const label = width===390?'スマホ':width===1440?'PC':null;
  async function visit(route) { await page.goto(new URL(route,base).href); }
  try {
    for (const route of ['index.html','bookshelf/index.html']) {
      await visit(route);
      const pending=page.locator('#yk-pending');
      if(await pending.count() && !await pending.evaluate(el=>el.open)) await pending.locator('summary').click();
      const links=page.locator('.book-card .cover-shelf');
      const actual=await links.evaluateAll(all=>all.map(a=>new URL(a.href).searchParams.get('id')).sort());
      assert.deepEqual(actual,ids,route+' work coverage');
      for (const link of await links.all()) shelfWidths.push(await measure(link.locator(':scope > :is(.image-cover,.book-cover)'),route));
      if(screenshots && label && route==='bookshelf/index.html') {
        await links.first().evaluate(el=>scrollTo(0,scrollY+el.getBoundingClientRect().top-34));
        await page.screenshot({path:path.join(screenshots,label+'-本棚.png')});
      }
    }
    for(const id of ids) {
      await visit('bookshelf/work.html?id='+encodeURIComponent(id));
      detailWidths.push(await measure(page.locator('.work-hero > :is(.image-cover,.book-cover)'),id));
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id+' horizontal overflow');
      if(screenshots && label && id==='konoyaba') await page.screenshot({path:path.join(screenshots,label+'-作品紹介.png')});
    }
    for(const sizes of [shelfWidths,detailWidths]) assert(Math.max(...sizes)-Math.min(...sizes)<1,'unequal widths at '+width);
    assert.deepEqual(errors,[]);
    console.log(width+'px: '+ids.length+' works; shelf '+shelfWidths[0]+'px, detail '+detailWidths[0]+'px');
  } finally {await page.close();}
}

(async()=>{
  if(screenshots) fs.mkdirSync(screenshots,{recursive:true});
  const browser=await chromium.launch({channel:'msedge'});
  try { for(const width of [340,390,768,1440]) await verify(browser,width); }
  finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
