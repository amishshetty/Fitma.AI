const cases = [
  "paneer for lunch",
  "dosa",
  "some apples",
  "a banana",
  "an orange",
  "the rice",
  "lunch dosa"
];
const eatVerbs = ["ate", "had", "eat", "having", "logging", "log", "add"];
for (const lower of cases) {
    let foundFood = "";
    for (const verb of eatVerbs) {
         const verbMatch = lower.match(new RegExp(`\\b${verb}\\b`));
         if (verbMatch) {
             const index = verbMatch.index;
             foundFood = lower.substring(index + verb.length).trim();
             break;
         }
    }
    if (!foundFood) foundFood = lower;
    
    foundFood = foundFood.replace(/(for|in|as|my)?\s*(breakfast|lunch|dinner|snack)s?/g, "");
    foundFood = foundFood.replace(/(yesterday|today)/g, "");
    foundFood = foundFood.replace(/please/g, "");
    foundFood = foundFood.replace(/[^\w\s]/gi, "");
    foundFood = foundFood.trim();
    
    // remove leading articles
    foundFood = foundFood.replace(/^(a|an|some|the|my)\s+/i, "");
    
    console.log(`Input: "${lower}" -> Output: "${foundFood}"`);
}
