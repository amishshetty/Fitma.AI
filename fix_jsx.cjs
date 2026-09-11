const fs = require('fs');
const file = 'mobile/app/(tabs)/liva-home.tsx';
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
                    onSubmitEditing={() => handleSendText(inputText)}
                  />
                  <Pressable 
                    style={[
                      styles.sendButton,
                      isListening ? styles.sendButtonListening : (!inputText.trim() && { opacity: 0.4 })
                    ]} 
                    onPress={() => handleSendText(inputText)}
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

fs.writeFileSync(file, content);
console.log('Fixed JSX in liva-home');
