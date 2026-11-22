import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { COLORS } from '../../config/constants';

const ProfileScreen = () => {
  const { user, applicant, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {applicant?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'A'}
          </Text>
        </View>
        <Text style={styles.name}>{applicant?.fullName || 'Catering Candidate'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark" size={14} color={COLORS.primaryDark} />
          <Text style={styles.badgeText}>Verified Applicant Profile</Text>
        </View>
      </View>

      {/* Contact Details Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact & Location</Text>
        <View style={styles.row}>
          <Ionicons name="call-outline" size={16} color={COLORS.textMuted} />
          <Text style={styles.rowLabel}>Mobile:</Text>
          <Text style={styles.rowValue}>{applicant?.phone || 'Not provided'}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="logo-whatsapp" size={16} color="#16A34A" />
          <Text style={styles.rowLabel}>WhatsApp:</Text>
          <Text style={styles.rowValue}>{applicant?.whatsapp || applicant?.phone || 'Not provided'}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color={COLORS.textMuted} />
          <Text style={styles.rowLabel}>City / Division:</Text>
          <Text style={styles.rowValue}>{applicant?.hometown || 'Dhaka, Bangladesh'}</Text>
        </View>
      </View>

      {/* Experience & Skills */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Catering Skills</Text>
        <View style={styles.skillsContainer}>
          {(applicant?.skills?.length ? applicant.skills : ['Food Serving', 'Table Setup', 'Beverage Refills', 'Banquet Etiquette']).map((skill, index) => (
            <View key={index} style={styles.skillChip}>
              <Text style={styles.skillText}>✓ {skill}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.cardTitle, { marginTop: 14 }]}>Work Experience</Text>
        <Text style={styles.experienceText}>
          {applicant?.experience || '2 years working as part-time banquet server in Dhanmondi and Uttara wedding halls.'}
        </Text>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color={COLORS.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  email: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  rowLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    width: 100,
  },
  rowValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
  },
  experienceText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '800',
  },
});

export default ProfileScreen;
