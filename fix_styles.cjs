const fs = require('fs');
const file = 'mobile/app/(tabs)/liva-home.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldStyles = /inputContainer: \{\s*paddingHorizontal: 24,\s*paddingBottom: 24,\s*\},.*?actionButton: \{\s*padding: 4,\s*\},/s;

const newStyles = `inputContainer: {
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    inputBox: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: 24,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#f1f5f9',
      shadowColor: isDark ? '#f8fafc' : '#10201a',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 32,
      elevation: 4,
    },
    inputTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    textInput: {
      flex: 1,
      minHeight: 40,
      fontSize: 15,
      fontWeight: '500',
      color: isDark ? '#f8fafc' : '#0f172a',
    },
    sendButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    sendButtonListening: {
      // Optional: Add pulsing animation via Animated if needed
    },
    inputBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    pillButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1e293b' : '#fff',
      paddingVertical: 4,
      paddingHorizontal: 4,
      borderRadius: 24,
    },
    pillIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    pillIconGreen: {
      backgroundColor: isDark ? 'rgba(52, 199, 89, 0.1)' : '#ecfbf1',
    },
    pillIconRed: {
      backgroundColor: '#ff3b30',
      shadowColor: '#ff3b30',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    pillIconWrapGray: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#334155' : '#f8fafc',
      borderWidth: 1,
      borderColor: isDark ? '#475569' : '#f1f5f9',
      marginRight: 8,
    },
    pillText: {
      fontSize: 11,
      fontWeight: '700',
      color: isDark ? '#94a3b8' : '#8e8e93',
      paddingRight: 8,
    },`;

content = content.replace(oldStyles, newStyles);

fs.writeFileSync(file, content);
console.log('Fixed styles in liva-home');
