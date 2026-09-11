const fs = require('fs');
const file = 'mobile/app/liva-chat.tsx';
let content = fs.readFileSync(file, 'utf8');

const newJSX = `
            {/* Input Area */}
            <View style={styles.inputContainer}>
              <View style={styles.inputBox}>
                <View style={styles.inputTop}>
                  <TextInput
                    style={styles.textInput}
                    placeholder={isListening ? "Listening..." : "Message Liva..."}
                    placeholderTextColor="#8e8e93"
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={handleSendText}
                  />
                  <Pressable 
                    style={[
                      styles.sendButton,
                      isListening ? styles.sendButtonListening : (!inputText.trim() && { opacity: 0.4 })
                    ]} 
                    onPress={handleSendText}
                    disabled={!inputText.trim() && !isListening}
                  >
                    {isListening ? (
                      <Mic size={20} color="#ff3b30" />
                    ) : (
                      <Send size={18} color="#34C759" />
                    )}
                  </Pressable>
                </View>
                
                <View style={styles.inputBottom}>
                  <Pressable style={styles.pillButton} onPress={toggleVoiceInput}>
                    <View style={[styles.pillIconWrap, isListening ? styles.pillIconRed : styles.pillIconGreen]}>
                      <Mic size={15} color={isListening ? "#fff" : "#34C759"} />
                    </View>
                    <Text style={styles.pillText}>Voice</Text>
                  </Pressable>

                  <Pressable style={styles.pillButton} onPress={handleCameraPress}>
                    <View style={styles.pillIconWrapGray}>
                      <Camera size={15} color="#8e8e93" />
                    </View>
                    <Text style={styles.pillText}>Camera</Text>
                  </Pressable>

                  <Pressable style={styles.pillButton}>
                    <View style={styles.pillIconWrapGray}>
                      <Keyboard size={15} color="#8e8e93" />
                    </View>
                    <Text style={styles.pillText}>Keyboard</Text>
                  </Pressable>
                </View>
              </View>
            </View>
`;

content = content.replace(/<View style=\{styles\.inputContainer\}>.*?<\/View>\s*<\/View>\s*<\/View>\s*<\/KeyboardAvoidingView>/s, 
  newJSX + `          </View>\n        </KeyboardAvoidingView>`
);

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
console.log('Fixed liva-chat');
