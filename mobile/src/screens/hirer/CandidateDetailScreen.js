import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { applicantService } from '../../services/applicantService';
import { jobService } from '../../services/jobService';
import { COLORS } from '../../config/constants';

const CandidateDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [applicant, setApplicant] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await applicantService.getApplicantById(id);
      if (res.success) {
        setApplicant(res.applicant);
        setApplications(res.applications || []);
      }
    } catch (err) {
      console.warn('Error fetching candidate details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleStatusChange = async (appId, status) => {
    setUpdating(true);
    try {
      const res = await jobService.updateStatus(appId, status);
      if (res.success) {
        Alert.alert('Status Updated', `Application moved to ${status.toUpperCase()}`);
        fetchDetails();
      }
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed updating status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!applicant) {
    return (
      <View style={styles.center}>
        <Text>Candidate not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Profile Header */}
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{applicant.fullName?.charAt(0) || 'C'}</Text>
        </View>
        <Text style={styles.name}>{applicant.fullName}</Text>
        <Text style={styles.email}>{applicant.userId?.email}</Text>
        <Text style={styles.location}>📍 {applicant.hometown || 'Dhaka, Bangladesh'}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL(`tel:${applicant.phone}`)}
          >
            <Ionicons name="call" size={14} color="#FFF" />
            <Text style={styles.btnText}>Call ({applicant.phone})</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.whatsappBtn}
            onPress={() => {
              const cleaned = (applicant.whatsapp || applicant.phone).replace(/\D/g, '');
              const intl = cleaned.startsWith('880') ? cleaned : `88${cleaned}`;
              Linking.openURL(`https://wa.me/${intl}`);
            }}
          >
            <Ionicons name="logo-whatsapp" size={16} color="#FFF" />
            <Text style={styles.btnText}>Direct WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Experience & Background */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Catering Background</Text>
        <Text style={styles.expText}>
          {applicant.experience || '2 years working as part-time banquet server in Dhanmondi wedding halls.'}
        </Text>

        <Text style={[styles.cardTitle, { marginTop: 14 }]}>Service Skills</Text>
        <View style={styles.skills}>
          {(applicant.skills?.length ? applicant.skills : ['Food Serving', 'Table Setup', 'Banquet Etiquette']).map((s, idx) => (
            <View key={idx} style={styles.skillChip}>
              <Text style={styles.skillText}>✓ {s}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Applications for this Candidate */}
      {applications.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shift Applications ({applications.length})</Text>
          {applications.map((app) => (
            <View key={app._id} style={styles.appItem}>
              <Text style={styles.appJobTitle}>{app.jobId?.title || 'Catering Shift'}</Text>
              <Text style={styles.appStatus}>Status: {app.status?.toUpperCase()}</Text>

              {/* Status Update Quick Buttons */}
              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[styles.statusBtn, { backgroundColor: '#6366F1' }]}
                  onPress={() => handleStatusChange(app._id, 'shortlisted')}
                  disabled={updating}
                >
                  <Text style={styles.statusBtnText}>Shortlist</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.statusBtn, { backgroundColor: '#10B981' }]}
                  onPress={() => handleStatusChange(app._id, 'hired')}
                  disabled={updating}
                >
                  <Text style={styles.statusBtnText}>Hire / Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.statusBtn, { backgroundColor: '#EF4444' }]}
                  onPress={() => handleStatusChange(app._id, 'rejected')}
                  disabled={updating}
                >
                  <Text style={styles.statusBtnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
  },
  email: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  callBtn: {
    flex: 1,
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  whatsappBtn: {
    flex: 1,
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  btnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  expText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  skills: {
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
    color: COLORS.text,
    fontWeight: '600',
  },
  appItem: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  appJobTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  appStatus: {
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '700',
    marginTop: 2,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default CandidateDetailScreen;
