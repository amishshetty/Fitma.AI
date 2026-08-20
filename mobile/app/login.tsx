import React, { useState } from "react";
import { View, Text as RNText, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { Mail, Lock, Eye, EyeOff, Check } from "lucide-react-native";
import Svg, { Circle, Path, Ellipse, Line } from "react-native-svg";

// Fix for Android squashed text
const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

function LivaAvatarSmall() {
  const size = 52;
  const svgSize = Math.round(size * 0.62);

  return (
    <View style={styles.avatarContainer}>
      <Svg width={svgSize} height={svgSize} viewBox="0 0 80 80" fill="none">
        <Circle cx="40" cy="44" r="30" fill="#f0fdf4" />
        <Circle cx="40" cy="44" r="29" stroke="#d8f3df" strokeWidth="2" />
        <Circle cx="31" cy="40" r="5" fill="#0f1f1a" />
        <Circle cx="49" cy="40" r="5" fill="#0f1f1a" />
        <Circle cx="33" cy="38" r="2" fill="white" />
        <Circle cx="51" cy="38" r="2" fill="white" />
        <Path d="M32 51Q40 60 48 51" stroke="#0f1f1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <Ellipse cx="26" cy="52" rx="6" ry="4" fill="#fca5a5" fillOpacity="0.48" />
        <Ellipse cx="54" cy="52" rx="6" ry="4" fill="#fca5a5" fillOpacity="0.48" />
        <Line x1="40" y1="14" x2="40" y2="24" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" />
        <Circle cx="40" cy="11" r="5" fill="#34C759" />
        <Circle cx="40" cy="11" r="2.5" fill="#22c55e" />
      </Svg>
    </View>
  );
}

function GoogleIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* Header */}
        <View style={styles.header}>
          <LivaAvatarSmall />
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Connect with Liva and let your health path align.</Text>
        </View>

        {/* Sign In Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <View style={styles.inputWrapper}>
              <Mail size={16} color="#6d8779" style={styles.inputIconLeft} />
              <TextInput
                style={styles.input}
                placeholder="name@email.com"
                placeholderTextColor="#cbd5e1"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.inputWrapper}>
              <Lock size={16} color="#6d8779" style={styles.inputIconLeft} />
              <TextInput
                style={[styles.input, { paddingRight: 40 }]}
                placeholder="••••••••"
                placeholderTextColor="#cbd5e1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable 
                style={styles.inputIconRight}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={16} color="#6d8779" />
                ) : (
                  <Eye size={16} color="#6d8779" />
                )}
              </Pressable>
            </View>
            <View style={styles.forgotPasswordContainer}>
              <Pressable>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.rememberMeContainer}>
            <Pressable 
              style={[styles.checkbox, rememberMe && styles.checkboxActive]}
              onPress={() => setRememberMe(!rememberMe)}
            >
              {rememberMe && <Check size={12} color="#ffffff" />}
            </Pressable>
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </View>

          <Pressable 
            style={styles.primaryButton}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerBadge}>
            <Text style={styles.dividerText}>OR</Text>
          </View>
        </View>

        {/* Social Login */}
        <Pressable style={styles.googleButton}>
          <GoogleIcon />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>

        {/* Footer Link */}
        <Pressable style={styles.footerLink}>
          <Text style={styles.footerLinkText}>Don't have an account? Sign Up</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 32,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    width: 52,
    height: 52,
    backgroundColor: '#ffffff',
    elevation: 8,
    shadowColor: 'rgba(52, 199, 89, 0.5)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 13,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10201A',
    lineHeight: 32,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#6d8779',
    lineHeight: 20,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6d8779',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIconLeft: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  inputIconRight: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
    padding: 4,
  },
  input: {
    backgroundColor: '#F8FAFC', // slate-50
    borderWidth: 1,
    borderColor: '#F1F5F9', // slate-100
    borderRadius: 12,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#10201A',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 2,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34C759',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0', // slate-200
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  rememberMeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6d8779',
  },
  primaryButton: {
    backgroundColor: '#34C759',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: 'rgba(52,199,89,0.34)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  dividerContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  dividerBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6d8779',
    letterSpacing: 0.5,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    height: 52,
    borderRadius: 14,
    shadowColor: 'rgba(0,0,0,0.02)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10201A',
  },
  footerLink: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerLinkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34C759',
  },
});
