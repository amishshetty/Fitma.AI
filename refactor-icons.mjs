import fs from 'fs';
import path from 'path';

function walk(dir) {
  let res = [];
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const fullPath = path.resolve(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) res = res.concat(walk(fullPath));
    else res.push(fullPath);
  }
  return res;
}

const files = walk('src').filter(f => f.endsWith('.tsx'));
let modifiedCount = 0;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  
  // The regex finds elements with items-center, justify-center, and rounded-* in their className,
  // enclosing a single child element with an uppercase name (like <Icon /> or <Mic />)
  const regex = /(<(span|div)[^>]*?className=(?:"|{\`)[^>"}*]*?\bitems-center\b[^>"}*]*?\bjustify-center\b[^>"}*]*?\brounded-[^>"}*]*?(?:"|\`})[^>]*?>)\s*(<[A-Z]\w+(?:[^>]+?)?\/>)\s*(<\/\2>)/gs;
  
  let matchFound = false;
  
  const newContent = content.replace(regex, (match, p1, p2, p3, p4) => {
    // Prevent double wrapping
    if (p1.includes('overflow-hidden') && p3.includes('absolute')) return match;

    matchFound = true;
    let newOpeningTag = p1;
    
    if (!newOpeningTag.includes('relative')) {
      if (newOpeningTag.includes('className="')) {
        newOpeningTag = newOpeningTag.replace('className="', 'className="relative ');
      } else if (newOpeningTag.includes('className={`')) {
        newOpeningTag = newOpeningTag.replace('className={`', 'className={`relative ');
      }
    }
    
    if (!newOpeningTag.includes('overflow-hidden')) {
      if (newOpeningTag.includes('className="')) {
        newOpeningTag = newOpeningTag.replace('className="', 'className="overflow-hidden ');
      } else if (newOpeningTag.includes('className={`')) {
        newOpeningTag = newOpeningTag.replace('className={`', 'className={`overflow-hidden ');
      }
    }
    
    return `${newOpeningTag}\n  <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">\n    ${p3}\n  </div>\n${p4}`;
  });
  
  if (matchFound && content !== newContent) {
    fs.writeFileSync(f, newContent);
    modifiedCount++;
    console.log('Modified:', f.replace(process.cwd(), ''));
  }
});

console.log('Total files modified:', modifiedCount);
