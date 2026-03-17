import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const SYS = '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';

export default function LoginScreen() {
  const router = useRouter();
  const { dispatch } = useApp();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    dispatch({ type: 'LOGIN' });
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Card */}
        <View style={styles.card}>

          {/* Instagram gradient text wordmark */}
          <LinearGradient
            colors={['#833AB4', '#E1306C', '#FCAF45']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.wordmarkGradient}
          >
            <Text style={styles.wordmark}>Instagram</Text>
          </LinearGradient>

          {/* Tagline */}
          <Text style={styles.tagline}>Mindful by design</Text>

          {/* Mindful badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeDot}>●</Text>
            <Text style={styles.badgeText}>You're in control of your time here.</Text>
          </View>

          {/* Inputs */}
          <TextInput
            style={styles.input}
            placeholder="Phone number, username, or email"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={[styles.input, { marginBottom: 12 }]}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Log In button */}
          <TouchableOpacity onPress={handleLogin} activeOpacity={0.85}>
            <LinearGradient
              colors={['#F78361', '#D63078', '#9B30A8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginBtn}
            >
              <Text style={styles.loginBtnText}>Log in</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* OR divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Facebook login */}
          <TouchableOpacity style={styles.fbBtn} activeOpacity={0.85}>
            <Text style={styles.fbIcon}>f</Text>
            <Text style={styles.fbText}>Log in with Facebook</Text>
          </TouchableOpacity>

          {/* Forgot password */}
          <TouchableOpacity style={styles.forgotWrap}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up row */}
        <View style={styles.signupRow}>
          <Text style={styles.signupPrompt}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

        {/* Get the app */}
        <Text style={styles.getApp}>Get the app.</Text>
        <View style={styles.appBadgesRow}>
          <TouchableOpacity style={styles.appBadge}>
            <Text style={styles.appBadgeIcon}>🍎</Text>
            <Text style={styles.appBadgeText}>App Store</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.appBadge}>
            <Text style={styles.appBadgeIcon}>▶</Text>
            <Text style={styles.appBadgeText}>Google Play</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 4,
    paddingHorizontal: 40,
    paddingVertical: 36,
    alignItems: 'center',
    marginBottom: 10,
  },
  wordmarkGradient: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  wordmark: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: SYS,
    letterSpacing: -1,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 13,
    color: '#8e8e8e',
    marginBottom: 20,
    fontFamily: SYS,
    textAlign: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F2',
    borderWidth: 1,
    borderColor: '#FCAF45',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 20,
    gap: 6,
  },
  badgeDot: {
    fontSize: 8,
    color: '#FCAF45',
  },
  badgeText: {
    fontSize: 11,
    color: '#E1306C',
    fontFamily: SYS,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: SYS,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  loginBtn: {
    width: '100%',
    minWidth: 300,
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: SYS,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DBDBDB',
  },
  dividerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8e8e8e',
    fontFamily: SYS,
    letterSpacing: 1,
  },
  fbBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1877F2',
    borderRadius: 8,
    paddingVertical: 11,
    width: '100%',
    marginBottom: 16,
    gap: 8,
  },
  fbIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: SYS,
  },
  fbText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: SYS,
  },
  forgotWrap: {
    marginTop: 4,
  },
  forgotText: {
    color: '#00376B',
    fontSize: 13,
    fontFamily: SYS,
    textAlign: 'center',
  },
  signupRow: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 4,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  signupPrompt: {
    fontSize: 14,
    color: '#262626',
    fontFamily: SYS,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0095F6',
    fontFamily: SYS,
  },
  getApp: {
    fontSize: 14,
    color: '#262626',
    fontFamily: SYS,
    marginBottom: 16,
    textAlign: 'center',
  },
  appBadgesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  appBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#262626',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  appBadgeIcon: {
    fontSize: 16,
  },
  appBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#262626',
    fontFamily: SYS,
  },
});
