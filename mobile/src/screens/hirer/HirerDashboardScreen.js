import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { jobService } from '../../services/jobService';
import { COLORS } from '../../config/constants';

const HirerDashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await jobService.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.warn('Error fetching stats:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Recruitment Overview</Text>
        <Text style={styles.subtitle}>
          Real-time catering candidate pipeline & event shift stats
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          <View style={styles.grid}>
            {/* Total Applicants */}
            <View style={[styles.statCard, { borderLeftColor: '#3B82F6' }]}>
              <Text style={styles.statLabel}>Total Candidates</Text>
              <Text style={styles.statNumber}>{stats?.totalApplicants || 0}</Text>
              <Text style={styles.statSub}>In talent pool</Text>
            </View>

            {/* Pending Review */}
            <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
              <Text style={styles.statLabel}>Pending Review</Text>
              <Text style={styles.statNumber}>{stats?.pendingApplications || 0}</Text>
              <Text style={styles.statSub}>Awaiting action</Text>
            </View>

            {/* Shortlisted */}
            <View style={[styles.statCard, { borderLeftColor: '#6366F1' }]}>
              <Text style={styles.statLabel}>Shortlisted</Text>
              <Text style={styles.statNumber}>{stats?.shortlistedApplications || 0}</Text>
              <Text style={styles.statSub}>WhatsApp ready</Text>
            </View>

            {/* Hired */}
            <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
              <Text style={styles.statLabel}>Confirmed Hires</Text>
              <Text style={styles.statNumber}>{stats?.hiredApplications || 0}</Text>
              <Text style={styles.statSub}>Booked for shifts</Text>
            </View>
          </View>

          {/* Quick Action Banner */}
          <TouchableOpacity
            style={styles.actionBanner}
            onPress={() => navigation.navigate('Candidates')}
          >
            <View style={styles.actionTextWrap}>
              <Text style={styles.actionTitle}>Review Candidate Pool</Text>
              <Text style={styles.actionSub}>
                Browse verified candidates and initiate WhatsApp interviews
              </Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={32} color="#FFF" />
          </TouchableOpacity>
        </>
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
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
    marginVertical: 4,
  },
  statSub: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  actionBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  actionTextWrap: {
    flex: 1,
    marginRight: 10,
  },
  actionTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  actionSub: {
    color: '#D1FAE5',
    fontSize: 11,
    marginTop: 2,
  },
});

export default HirerDashboardScreen;
