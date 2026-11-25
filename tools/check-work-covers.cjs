const fs = require('node:fs');
const path = require('node:path');

function dimensions(data) {
  if (data.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')) &&
      data.toString('ascii', 12, 16) === 'IHDR') {
    return [data.readUInt32BE(16), data.readUInt32BE(20)];
  }
  if (data.readUInt16BE(0) === 0xffd8) {
    let pos = 2;
    while (pos + 8 < data.length && data[pos] === 0xff) {
      while (data[pos] === 0xff) pos++;
      const marker = data[pos++];
      if (marker === 0xda || marker === 0xd9) break;
      const length = data.readUInt16BE(pos);
      if (length < 2 || pos + length > data.length) break;
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return [data.readUInt16BE(pos + 5), data.readUInt16BE(pos + 3)];
      }
      pos += length;
    }
  }
  if (data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP') {
    switch (data.toString('ascii', 12, 16)) {
      case 'VP8X': return [1 + data.readUIntLE(24, 3), 1 + data.readUIntLE(27, 3)];
      case 'VP8L': {
        const packed = data.readUInt32LE(21);
        return [1 + (packed & 0x3fff), 1 + ((packed >>> 14) & 0x3fff)];
      }
      case 'VP8 ': return [data.readUInt16LE(26) & 0x3fff, data.readUInt16LE(28) & 0x3fff];
    }
  }
  throw new Error('画像の寸法を読み取れません');
}

function checkWorkCovers(root, works) {
  const files = [];
  for (const work of works) {
    if (!work.cover) continue;
    const file = path.posix.join('bookshelf', work.cover);
    try {
      const [width, height] = dimensions(fs.readFileSync(path.join(root, file)));
      if (width !== 500 || height !== 711) throw new Error('実寸 ' + width + '×' + height + 'px');
      if ((work.coverWidth != null && work.coverWidth !== width) ||
          (work.coverHeight != null && work.coverHeight !== height)) throw new Error('登録寸法が画像と一致しません');
    } catch (error) {
      throw new Error(work.title + ' (' + file + ') の表紙を横500×縦711pxで確認してください。' + error.message);
    }
    files.push(file);
  }
  return files;
}

module.exports = {checkWorkCovers};
