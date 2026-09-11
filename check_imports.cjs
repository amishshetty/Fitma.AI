const fs = require('fs');
const files = [
  'mobile/app/progress-achievements.tsx',
  'mobile/app/progress-habits.tsx',
  'mobile/app/progress-monthly.tsx',
  'mobile/app/progress-nutrition.tsx',
  'mobile/app/progress-weekly.tsx',
  'mobile/app/progress-weight.tsx',
  'mobile/app/reminder-center.tsx',
  'mobile/app/reminder-hydration.tsx',
  'mobile/app/reminder-meal-flow.tsx',
  'mobile/app/reminder-preview.tsx'
];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import { useAppStore }')) {
    console.log('Missing useAppStore in ' + file);
  }
  if (!content.includes('useColorScheme')) {
    console.log('Missing useColorScheme in ' + file);
  }
});
