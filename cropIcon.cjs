const fs = require('fs');
const { PNG } = require('pngjs');

// Helper to determine if a pixel is 'background'
function isBg(r, g, b, a) {
    if (a < 10) return true; // already transparent
    if (r > 230 && g > 230 && b > 230) return true; // near white
    return false;
}

fs.createReadStream('public/icon_original.png')
    .pipe(new PNG())
    .on('parsed', function() {
        let minX = this.width, minY = this.height, maxX = 0, maxY = 0;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const idx = (this.width * y + x) << 2;
                const r = this.data[idx];
                const g = this.data[idx + 1];
                const b = this.data[idx + 2];
                const a = this.data[idx + 3];

                if (!isBg(r, g, b, a)) {
                    if (x < minX) minX = x;
                    if (y < minY) minY = y;
                    if (x > maxX) maxX = x;
                    if (y > maxY) maxY = y;
                }
            }
        }

        console.log(`Original Size: ${this.width}x${this.height}`);
        console.log(`Content Bounds: ${minX}, ${minY} to ${maxX}, ${maxY}`);
        
        if (minX > maxX || minY > maxY) {
            console.log("Image is entirely background!");
            return;
        }

        // Add 10px padding
        const padding = 10;
        minX = Math.max(0, minX - padding);
        minY = Math.max(0, minY - padding);
        maxX = Math.min(this.width - 1, maxX + padding);
        maxY = Math.min(this.height - 1, maxY + padding);

        const newWidth = maxX - minX + 1;
        const newHeight = maxY - minY + 1;
        
        console.log(`Cropping to: ${newWidth}x${newHeight}`);

        const dst = new PNG({ width: newWidth, height: newHeight });

        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                const srcY = minY + y;
                const srcX = minX + x;
                const srcIdx = (this.width * srcY + srcX) << 2;
                const dstIdx = (newWidth * y + x) << 2;
                
                const r = this.data[srcIdx];
                const g = this.data[srcIdx + 1];
                const b = this.data[srcIdx + 2];
                
                // Copy RGB
                dst.data[dstIdx] = r;
                dst.data[dstIdx + 1] = g;
                dst.data[dstIdx + 2] = b;
                
                // Make transparent if it's near white
                if (r > 220 && g > 220 && b > 220) {
                    dst.data[dstIdx + 3] = 0; // Transparent
                } else {
                    dst.data[dstIdx + 3] = this.data[srcIdx + 3]; // Original alpha
                }
            }
        }

        dst.pack().pipe(fs.createWriteStream('public/icon.png'))
            .on('finish', () => {
                console.log('Successfully cropped and removed background.');
            });
    });
