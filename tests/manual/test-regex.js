const str = `I've got the perfect high-protein Indian options for you today! [RECOMMENDATION_LOG:[{"meal":"Paneer Bhurji\\n2 Chapati\\nSalad","calories":520,"protein":35,"carbs":45,"fat":16,"why":["High Protein","Fits today's calorie target","Good recovery meal"],"alternatives":["Dal Khichdi","Grilled Chicken"],"tip":"This meal focuses on protein."}, {"meal":"Chicken Curry\\n1 Bowl Rice","calories":450,"protein":40,"carbs":40,"fat":12,"why":["Lean protein","Filling"],"alternatives":["Egg Curry"],"tip":"Great for muscle building."}]]`;
const m = str.match(/\[RECOMMENDATION_LOG:\s*(\[.*?\]|\{.*?\})\s*\]/s);
console.log(m ? m[1] : 'no match');
try { console.log(JSON.parse(m[1])); } catch (e) { console.error('parse failed:', e) }
