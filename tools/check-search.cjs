const assert=require('assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist'),{buildMetadata}=require('./site-metadata.cjs'),{assetFetch,worker}=require('./preview-public.cjs');
async function main(){
 const box={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'bookshelf/data.js'),'utf8'),box);
 const metadata=buildMetadata(box.window.BOOKSHELF_DATA),w=await worker(),pages=Object.entries(metadata.pages).filter(([,m])=>m.robots==='index,follow');
 const xml=fs.readFileSync(path.join(out,'sitemap.xml'),'utf8');
 assert(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));assert(xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
 const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&apos;',"'"));
 for(const work of box.window.BOOKSHELF_DATA.works)assert(urls.includes(metadata.origin+'/bookshelf/work.html?id='+encodeURIComponent(work.id)),work.id+' sitemap');assert(urls.includes(metadata.origin+'/gallery/'));assert.equal(new Set(urls).size,urls.length);assert.deepEqual(urls,pages.map(([,m])=>m.canonical));
 const results=[];
 for(const [key,m]of pages){
  assert(m.canonical.startsWith(metadata.origin+'/'));assert(!/preview|404|README|\/tools\//.test(m.canonical));
  const requestUrl='http://127.0.0.1:8769'+key,r=await w.fetch(new Request(requestUrl),{ASSETS:{fetch:assetFetch}}),html=await r.text();
  assert.equal(r.status,200);assert.equal(r.headers.get('x-robots-tag'),'index,follow',key+' GET header');
  assert.equal((html.match(/<meta\b[^>]*name="robots"[^>]*>/g)||[]).length,1);assert(html.includes('name="robots" content="index,follow"'));assert(!/noindex|nofollow/i.test(html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)[1]));
  assert.equal((html.match(/<link\b[^>]*rel="canonical"[^>]*>/g)||[]).length,1);
  assert(html.includes('rel="canonical" href="'+m.canonical.replaceAll('&','&amp;')+'"'));
  const head=await w.fetch(new Request(requestUrl,{method:'HEAD'}),{ASSETS:{fetch:assetFetch}});assert.equal(head.status,200);assert.equal(head.headers.get('x-robots-tag'),'index,follow');assert.equal(await head.text(),'');
  results.push({key,canonical:m.canonical,status:r.status,robots:m.robots});
 }
 for(const key of ['/bookshelf/work.html','/bookshelf/story.html']){assert(!urls.includes(metadata.origin+key));const r=await w.fetch(new Request('http://127.0.0.1:8769'+key),{ASSETS:{fetch:assetFetch}});assert.equal(r.headers.get('x-robots-tag'),'noindex,follow');}
 for(const key of ['/bookshelf/work.html?id=unknown','/bookshelf/story.html?id=unknown']){const r=await w.fetch(new Request('http://127.0.0.1:8769'+key),{ASSETS:{fetch:assetFetch}});assert((await r.text()).includes('name="robots" content="noindex,follow"'));}
 const robots=fs.readFileSync(path.join(out,'robots.txt'),'utf8');assert(robots.includes('User-agent: *\nAllow: /\n'));assert(robots.includes('Sitemap: '+metadata.origin+'/sitemap.xml'));assert(!/^Disallow:\s*\//m.test(robots));
 assert(!fs.readFileSync(path.join(out,'_headers'),'utf8').split('/404.html')[0].includes('noindex'));
 const siteMapResponse=await assetFetch(new Request('http://127.0.0.1:8769/sitemap.xml'));assert.equal(siteMapResponse.status,200);assert(siteMapResponse.headers.get('content-type').includes('xml'));
 const missing=await w.fetch(new Request('http://127.0.0.1:8769/not-found-search-check'),{ASSETS:{fetch:assetFetch}});assert.equal(missing.status,404);assert((await missing.text()).includes('name="robots" content="noindex,nofollow"'));
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'tools/public-manifest.json')));for(const item of manifest.files){const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(out,item.file))).digest('hex');assert.equal(hash,item.sha256,item.file+' manifest hash');}assert(manifest.files.some(x=>x.file==='sitemap.xml'));
 console.log(JSON.stringify({status:'passed',sitemapUrls:urls.length,initialHtmlResponses:results.length,headResponses:results.length,excludedTemplates:2,unknownIds:2,deliveryFiles:manifest.files.length,origin:metadata.origin,results},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1});
