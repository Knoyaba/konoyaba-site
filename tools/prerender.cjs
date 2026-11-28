// Render the same shelf and detail components used by the browser at publication time.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {parseHTML} = require('linkedom');

function prepareShelves(root, data) {
  const read = name => fs.readFileSync(path.join(root, name), 'utf8');
  const scope = {window: {BOOKSHELF_DATA: data}};
  vm.runInNewContext(read('gallery/artworks.js'), scope);
  const component = new vm.Script(read('bookshelf/bookshelf.js'));
  function render(template, search = '') {
    const {document} = parseHTML(template);
    component.runInNewContext({window:scope.window, document, location:{search}, URLSearchParams});
    return document;
  }
  const details = {};
  for (const [items, name, selector] of [[data.works,'work','#work-detail'],[data.stories,'story','#story-detail']]) {
    const template = read('bookshelf/'+name+'.html');
    for (const item of items) {
      const search = '?id='+encodeURIComponent(item.id);
      const node = render(template,search).querySelector(selector);
      node.dataset.rendered = item.id;
      details['/bookshelf/'+name+'.html'+search] = node.outerHTML;
    }
  }
  function shelfPage(html) {
    const main = render(html).querySelector('main');
    return html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, () => main.outerHTML);
  }
  return {details,shelfPage};
}
module.exports={prepareShelves};
