const fs = require('fs');
const file = 'mobile/app/(tabs)/liva-home.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<View style=\{styles\.inputActions\}>[\s\S]*?<\/View>\s*<\/View>\s*<\/View>\s*<\/KeyboardAvoidingView>/m,
  `<View style={styles.inputActions}>
                <Pressable style={styles.actionButton} onPress={toggleVoiceInput}>
                  {isListening ? <MicOff size={22} color="#ff3b30" /> : <Mic size={22} color="#8e8e93" />}
                </Pressable>
                <Pressable style={styles.actionButton} onPress={handleCameraPress}>
                  <Camera size={22} color="#8e8e93" />
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>`
);

fs.writeFileSync(file, content);
console.log('Fixed inputActions in liva-home');
