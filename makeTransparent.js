import fs from 'fs';
import { PNG } from 'pngjs';

fs.createReadStream('public/icon_original.png')
  .pipe(new PNG())
  .on('parsed', function () {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;

        // Read RGB values
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];

        // If it's a very light color (near white), make it fully transparent
        if (r > 240 && g > 240 && b > 240) {
          this.data[idx + 3] = 0; // alpha
        }
      }
    }

    this.pack()
      .pipe(fs.createWriteStream('public/icon.png'))
      .on('finish', () => {
        console.log('Successfully made icon background transparent.');
      });
  });
