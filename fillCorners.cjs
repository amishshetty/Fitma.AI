const fs = require('fs');
const { PNG } = require('pngjs');

fs.createReadStream('public/icon_original.png')
  .pipe(new PNG())
  .on('parsed', function() {
    // We want to fill all transparent pixels with the nearest non-transparent pixel.
    // This will turn the rounded squircle into a solid square, perfect for Android Adaptive Icons.
    
    // First, find the bounding box of the non-transparent logo
    let minX = this.width, minY = this.height, maxX = 0, maxY = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;
        if (this.data[idx + 3] > 50) { // non-transparent
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    const size = Math.max(maxX - minX + 1, maxY - minY + 1);
    
    // Create new solid 512x512 image
    const dst = new PNG({ width: 512, height: 512 });
    
    for (let dy = 0; dy < 512; dy++) {
      for (let dx = 0; dx < 512; dx++) {
        // Map back to original image
        const xOffset = minX + (size - (maxX - minX + 1)) / 2;
        const yOffset = minY + (size - (maxY - minY + 1)) / 2;
        
        let sx = Math.floor(xOffset + (dx / 512) * size);
        let sy = Math.floor(yOffset + (dy / 512) * size);
        
        // Find nearest non-transparent pixel if this pixel is transparent
        let searchRadius = 0;
        let found = false;
        let bestR, bestG, bestB;
        
        // Fast approximate nearest neighbor for transparent pixels
        // Let's just find the first pixel in a growing spiral or box
        let rIdx = (this.width * sy + sx) << 2;
        if (sx >= 0 && sx < this.width && sy >= 0 && sy < this.height && this.data[rIdx + 3] > 50) {
           bestR = this.data[rIdx];
           bestG = this.data[rIdx + 1];
           bestB = this.data[rIdx + 2];
           found = true;
        } else {
           // search
           for (let r = 1; r < 200 && !found; r++) {
              for (let dy2 = -r; dy2 <= r && !found; dy2++) {
                 for (let dx2 = -r; dx2 <= r && !found; dx2++) {
                    if (Math.abs(dx2) !== r && Math.abs(dy2) !== r) continue; // only perimeter
                    let nx = sx + dx2;
                    let ny = sy + dy2;
                    if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                       let nIdx = (this.width * ny + nx) << 2;
                       if (this.data[nIdx + 3] > 50) {
                          // ignore white anti-aliased border pixels (high rgb, lower alpha)
                          if (!(this.data[nIdx] > 200 && this.data[nIdx+1] > 200 && this.data[nIdx+2] > 200)) {
                             bestR = this.data[nIdx];
                             bestG = this.data[nIdx + 1];
                             bestB = this.data[nIdx + 2];
                             found = true;
                          }
                       }
                    }
                 }
              }
           }
        }
        
        const dstIdx = (512 * dy + dx) << 2;
        if (found) {
           dst.data[dstIdx] = bestR;
           dst.data[dstIdx + 1] = bestG;
           dst.data[dstIdx + 2] = bestB;
           dst.data[dstIdx + 3] = 255; // SOLID! No transparency!
        } else {
           dst.data[dstIdx] = 20;
           dst.data[dstIdx+1] = 180;
           dst.data[dstIdx+2] = 160;
           dst.data[dstIdx+3] = 255;
        }
      }
    }

    dst.pack().pipe(fs.createWriteStream('public/icon-v4.png')).on('finish', () => {
      console.log('Successfully created solid icon-v4.png');
    });
  });
