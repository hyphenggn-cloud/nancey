import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  // RGBA buffer: width * height * 4
  const rawData = Buffer.alloc(height * (1 + width * 4));

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(12 + length);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  // CRC32 of type and data
  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Drawer for Nancy Logistics Brand Icon
// Deep navy background (#0f172a), orange truck and wheels
function drawNancyIcon(x, y, w, h, isMaskable = false) {
  const nx = x / w;
  const ny = y / h;

  // Background: Deep navy
  let r = 15, g = 23, b = 42, a = 255;

  // For non-maskable, round corners
  if (!isMaskable) {
    const rx = Math.min(x, w - x);
    const ry = Math.min(y, h - y);
    const cornerRadius = w * 0.18;
    if (rx < cornerRadius && ry < cornerRadius) {
      const dist = Math.hypot(cornerRadius - rx, cornerRadius - ry);
      if (dist > cornerRadius) {
        return [0, 0, 0, 0]; // Transparent outside rounded corner
      }
    }
  }

  // Scale coordinates inside safe area
  const scale = isMaskable ? 0.72 : 0.84;
  const sx = (nx - 0.5) / scale + 0.5;
  const sy = (ny - 0.5) / scale + 0.5;

  // Draw truck body: sx in [0.18, 0.62], sy in [0.28, 0.64] -> Orange #f97316
  if (sx >= 0.16 && sx <= 0.62 && sy >= 0.28 && sy <= 0.64) {
    return [249, 115, 22, 255];
  }

  // Truck Cab: sx in [0.62, 0.86], sy in [0.40, 0.64] -> White
  if (sx > 0.62 && sx <= 0.86 && sy >= 0.40 && sy <= 0.64) {
    // Window cut-out: sx in [0.66, 0.78], sy in [0.43, 0.53]
    if (sx >= 0.66 && sx <= 0.78 && sy >= 0.43 && sy <= 0.53) {
      return [15, 23, 42, 255]; // Cab window dark navy
    }
    return [255, 255, 255, 255];
  }

  // Speed chevron lines on trailer:
  // Chevron 1
  if (sx >= 0.26 && sx <= 0.36 && Math.abs(sy - 0.46) <= 0.08) {
    const distToSlope = Math.abs((sx - 0.28) * 1.5 - (0.5 - Math.abs(sy - 0.46) * 2));
    if (distToSlope < 0.04) return [255, 255, 255, 255];
  }

  // Wheels:
  // Rear wheel: center at (0.30, 0.68)
  const distWheel1 = Math.hypot(sx - 0.30, sy - 0.68);
  if (distWheel1 <= 0.09) {
    if (distWheel1 <= 0.035) return [255, 255, 255, 255]; // hubcap
    if (distWheel1 <= 0.07) return [2, 6, 23, 255]; // tire
    return [249, 115, 22, 255]; // orange rim
  }

  // Front wheel: center at (0.74, 0.68)
  const distWheel2 = Math.hypot(sx - 0.74, sy - 0.68);
  if (distWheel2 <= 0.09) {
    if (distWheel2 <= 0.035) return [255, 255, 255, 255];
    if (distWheel2 <= 0.07) return [2, 6, 23, 255];
    return [249, 115, 22, 255];
  }

  // Road Track Line: sy in [0.78, 0.80], sx in [0.12, 0.88]
  if (sy >= 0.77 && sy <= 0.80 && sx >= 0.12 && sx <= 0.88) {
    if (Math.floor(sx * 40) % 2 === 0) {
      return [234, 88, 12, 255];
    }
  }

  return [r, g, b, a];
}

if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}

// Generate PNGs
fs.writeFileSync('./public/pwa-192x192.png', createPNG(192, 192, (x, y, w, h) => drawNancyIcon(x, y, w, h, false)));
fs.writeFileSync('./public/pwa-512x512.png', createPNG(512, 512, (x, y, w, h) => drawNancyIcon(x, y, w, h, false)));
fs.writeFileSync('./public/pwa-maskable-512x512.png', createPNG(512, 512, (x, y, w, h) => drawNancyIcon(x, y, w, h, true)));
fs.writeFileSync('./public/apple-touch-icon.png', createPNG(180, 180, (x, y, w, h) => drawNancyIcon(x, y, w, h, false)));

console.log('PWA PNG assets generated successfully in public/');
