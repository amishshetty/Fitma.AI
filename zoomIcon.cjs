const fs = require('fs');
const { PNG } = require('pngjs');

fs.createReadStream('public/icon_original.png')
  .pipe(new PNG())
  .on('parsed', function() {
    let minX = this.width, minY = this.height, maxX = 0, maxY = 0;

    // Find bounding box
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;
        const alpha = this.data[idx + 3];
        // Consider pixels with alpha > 10 as part of the logo
        if (alpha > 10) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    console.log(`Bounding box: X [${minX}, ${maxX}], Y [${minY}, ${maxY}]`);
    const boxWidth = maxX - minX + 1;
    const boxHeight = maxY - minY + 1;

    // We want to scale this bounding box to fill 512x512.
    // First, let's just make it fill the maximum possible square.
    const size = Math.max(boxWidth, boxHeight);
    
    // Create a new 512x512 image
    const dst = new PNG({ width: 512, height: 512 });
    
    // Nearest neighbor or simple bilinear scaling
    for (let dy = 0; dy < 512; dy++) {
      for (let dx = 0; dx < 512; dx++) {
        // Map 512x512 back to the bounding box
        // To center it, we calculate the offset
        const xOffset = minX + (size - boxWidth) / 2;
        const yOffset = minY + (size - boxHeight) / 2;

        const sx = Math.floor(xOffset + (dx / 512) * size);
        const sy = Math.floor(yOffset + (dy / 512) * size);

        const dstIdx = (512 * dy + dx) << 2;
        
        if (sx >= 0 && sx < this.width && sy >= 0 && sy < this.height) {
          const srcIdx = (this.width * sy + sx) << 2;
          
          // To remove the "white halo" anti-aliasing pixels on the very edge:
          // We will increase transparency if the pixel is bright and semi-transparent
          let r = this.data[srcIdx];
          let g = this.data[srcIdx + 1];
          let b = this.data[srcIdx + 2];
          let a = this.data[srcIdx + 3];

          // If the pixel is very white-ish and near the edge (low alpha), make it fully transparent
          if (a > 0 && a < 250 && r > 200 && g > 200 && b > 200) {
             a = 0; // kill white halo pixels entirely
          }
          
          dst.data[dstIdx] = r;
          dst.data[dstIdx + 1] = g;
          dst.data[dstIdx + 2] = b;
          dst.data[dstIdx + 3] = a;
        } else {
          dst.data[dstIdx + 3] = 0; // transparent
        }
      }
    }

    dst.pack().pipe(fs.createWriteStream('public/icon-v3.png')).on('finish', () => {
      console.log('Successfully zoomed logo to 512x512 and saved to icon-v3.png');
    });
  });
