const fs = require('fs');
const { PNG } = require('pngjs');

fs.createReadStream('public/icon_original.png')
    .pipe(new PNG())
    .on('parsed', function() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const idx = (this.width * y + x) << 2;
                const r = this.data[idx];
                const g = this.data[idx + 1];
                const b = this.data[idx + 2];
                const a = this.data[idx + 3];

                // Check how "white" the pixel is
                const brightness = (r + g + b) / 3;
                const colorDifference = Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r);
                
                // If the pixel is mostly grayscale (colorDifference < 20) and bright
                if (colorDifference < 30 && brightness > 150) {
                    // It's a whitish/grayish pixel (likely part of the anti-aliased border or background)
                    // We map brightness 150->255 to alpha 255->0
                    const newAlpha = Math.max(0, Math.min(255, 255 - ((brightness - 150) * (255 / 105))));
                    
                    // If it's very white, make it fully transparent
                    if (brightness > 240) {
                        this.data[idx + 3] = 0;
                    } else {
                        // Apply semi-transparency to the halo, but darken the pixel so it blends better on dark backgrounds
                        this.data[idx + 3] = Math.min(a, newAlpha);
                    }
                }
            }
        }

        this.pack().pipe(fs.createWriteStream('public/icon.png'))
            .on('finish', () => {
                console.log('Successfully removed white halo/border.');
            });
    });
