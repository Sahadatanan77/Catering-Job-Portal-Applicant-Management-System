import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { COLORS } from '../../config/constants';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [roleTab, setRoleTab] = useState('applicant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fillDemo = (role) => {
    setError('');
    if (role === 'hirer') {
      setRoleTab('hirer');
      setEmail('admin@cateringportal.com');
      setPassword('Admin@12345');
    } else {
      setRoleTab('applicant');
      setEmail('applicant1@cateringportal.com');
      setPassword('Password@123');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password, roleTab);
      if (!res.success) {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Connection error. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Ionicons name="restaurant" size={28} color="#FFF" />
          </View>
          <Text style={styles.title}>
            Catering<Text style={{ color: COLORS.accent }}>Hub</Text>
          </Text>
          <Text style={styles.subtitle}>
            Sign in to apply for shifts or manage event staff
          </Text>
        </View>

        {/* Role Tabs */}
        <View style={styles.roleTabs}>
          <TouchableOpacity
            style={[styles.tab, roleTab === 'applicant' && styles.tabActive]}
            onPress={() => { setRoleTab('applicant'); setError(''); }}
          >
            <Ionicons
              name="person-outline"
              size={16}
              color={roleTab === 'applicant' ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={[styles.tabText, roleTab === 'applicant' && styles.tabTextActive]}
            >
              Applicant
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, roleTab === 'hirer' && styles.tabActive]}
            onPress={() => { setRoleTab('hirer'); setError(''); }}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={roleTab === 'hirer' ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={[styles.tabText, roleTab === 'hirer' && styles.tabTextActive]}
            >
              Hirer / Admin
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingRight: 40 }]}
                placeholder="••••••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>
                  Sign In as {roleTab === 'hirer' ? 'Hirer' : 'Applicant'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" />
              </>
            )}
          </TouchableOpacity>

          {/* One-Click Fast Login Helpers */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>One-Click Demo Accounts</Text>
            <View style={styles.demoGrid}>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => fillDemo('applicant')}
              >
                <Text style={styles.demoBtnTitle}>👤 Demo Applicant</Text>
                <Text style={styles.demoBtnSub}>Candidate Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => fillDemo('hirer')}
              >
                <Text style={styles.demoBtnTitle}>👑 Demo Hirer</Text>
                <Text style={styles.demoBtnSub}>Admin Recruiter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Register CTA */}
        {roleTab === 'applicant' && (
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerLinkText}>
              Don't have an account yet?{' '}
              <Text style={{ color: COLORS.primary, fontWeight: '700' }}>
                Register as Catering Staff
              </Text>
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorBg,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    gap: 6,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingLeft: 38,
    paddingRight: 14,
    fontSize: 14,
    color: COLORS.text,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  demoSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 10,
  },
  demoGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  demoBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 10,
  },
  demoBtnTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  demoBtnSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});

export default LoginScreen;
