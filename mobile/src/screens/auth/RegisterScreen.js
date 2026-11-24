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
import { COLORS, BANGLADESH_DIVISIONS } from '../../config/constants';

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    hometown: 'Dhaka',
    password: '',
  });
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePhone = (num) => {
    const cleaned = num.replace(/[\s-]/g, '');
    const bdRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    return bdRegex.test(cleaned);
  };

  const handlePhoneChange = (val) => {
    setFormData({ ...formData, phone: val });
    if (val.length >= 11 && !validatePhone(val)) {
      setPhoneError('Please enter a valid Bangladeshi mobile number (013-019XXXXXXXX)');
    } else {
      setPhoneError('');
    }
  };

  const handleRegister = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setPhoneError('Enter a valid 11-digit BD number (e.g., 01XXXXXXXXX)');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await register(formData);
      if (!res.success) {
        setError(res.message || 'Registration failed.');
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
        <View style={styles.header}>
          <Text style={styles.title}>Join Catering Workforce</Text>
          <Text style={styles.subtitle}>
            Register your applicant profile to get booked for wedding & banquet shifts
          </Text>
        </View>

        <View style={styles.card}>
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={formData.fullName}
                onChangeText={(t) => setFormData({ ...formData, fullName: t })}
              />
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                value={formData.email}
                onChangeText={(t) => setFormData({ ...formData, email: t })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Bangladeshi Phone Number */}
          <View style={styles.inputGroup}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={styles.label}>Phone Number (BD) *</Text>
              <Text style={{ fontSize: 10, color: COLORS.primary, fontWeight: '700' }}>01XXXXXXXXX</Text>
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, phoneError ? { borderColor: COLORS.error } : null]}
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
              />
            </View>
            {phoneError ? <Text style={styles.fieldError}>{phoneError}</Text> : null}
          </View>

          {/* Hometown Division */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hometown / City *</Text>
            <View style={styles.divisionChips}>
              {BANGLADESH_DIVISIONS.map((div) => (
                <TouchableOpacity
                  key={div}
                  style={[
                    styles.chip,
                    formData.hometown === div && styles.chipActive,
                  ]}
                  onPress={() => setFormData({ ...formData, hometown: div })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      formData.hometown === div && styles.chipTextActive,
                    ]}
                  >
                    {div}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password (Min. 6 characters) *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••••••"
                value={formData.password}
                onChangeText={(t) => setFormData({ ...formData, password: t })}
                secureTextEntry
              />
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>Complete Registration</Text>
                <Ionicons name="checkmark-circle-outline" size={18} color="#FFF" />
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backLinkText}>
            Already registered? <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
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
    paddingTop: 30,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
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
  fieldError: {
    color: COLORS.error,
    fontSize: 11,
    marginTop: 4,
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
  divisionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F8FAFC',
  },
  chipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  chipTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 10,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  backLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  backLinkText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});

export default RegisterScreen;
