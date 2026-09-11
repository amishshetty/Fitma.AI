const fs = require('fs');
const file = 'mobile/app/(tabs)/my-plan.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import \{ \r?\n\s*ChevronLeft, ChevronDown, ChevronRight, \r?\n\s*Sunrise, Sun, Moon, Coffee, Check, Flame, \r?\n\s*Droplets, Activity\r?\n\} from 'lucide-react-native';/,
  "import {\n  ChevronLeft, ChevronDown, ChevronRight,\n  Sunrise, Sun, Moon, Coffee, Check, Flame,\n  Droplets, Activity, Target, Sparkles\n} from 'lucide-react-native';");

fs.writeFileSync(file, content);
console.log('Fixed imports');
