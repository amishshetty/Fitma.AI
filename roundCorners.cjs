const fs = require('fs');
const { PNG } = require('pngjs');

// Helper to check if pixel is inside rounded corner
function isInsideRoundedRect(x, y, width, height, radius) {
  // If in inner cross, it's inside
  if (x >= radius && x < width - radius) return true;
  if (y >= radius && y < height - radius) return true;

  let dx = 0, dy = 0;
  if (x < radius && y < radius) {
    // Top-left
    dx = radius - x;
    dy = radius - y;
  } else if (x >= width - radius && y < radius) {
    // Top-right
    dx = x - (width - radius) + 1;
    dy = radius - y;
  } else if (x < radius && y >= height - radius) {
    // Bottom-left
    dx = radius - x;
    dy = y - (height - radius) + 1;
  } else if (x >= width - radius && y >= height - radius) {
    // Bottom-right
    dx = x - (width - radius) + 1;
    dy = y - (height - radius) + 1;
  }

  return (dx * dx + dy * dy) <= (radius * radius);
}

fs.createReadStream('public/icon-v6.png')
  .pipe(new PNG())
  .on('parsed', function() {
    const radius = Math.floor(this.width * 0.22); // 22% corner radius is standard for iOS/modern squircles
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!isInsideRoundedRect(x, y, this.width, this.height, radius)) {
          const idx = (this.width * y + x) << 2;
          this.data[idx + 3] = 0; // Transparent
        }
      }
    }

    this.pack().pipe(fs.createWriteStream('public/icon-v6-rounded.png')).on('finish', () => {
      console.log('Successfully created icon-v6-rounded.png');
    });
  });
