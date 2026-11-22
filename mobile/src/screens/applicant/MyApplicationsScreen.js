import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { jobService } from '../../services/jobService';
import StatusBadge from '../../components/StatusBadge';
import { COLORS } from '../../config/constants';

const MyApplicationsScreen = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await jobService.getMyApplications();
      if (res.success) {
        setApplications(res.applications || []);
      }
    } catch (err) {
      console.warn('Error fetching applications:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Fetching your applications...</Text>
        </View>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.header}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.jobTitle}>{item.jobId?.title || 'Catering Shift'}</Text>
                  <Text style={styles.jobSub}>
                    {item.jobId?.venue} • {item.jobId?.location}
                  </Text>
                </View>
                <StatusBadge status={item.status} />
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
                  <Text style={styles.detailText}>{item.jobId?.eventDate}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="cash-outline" size={14} color={COLORS.primaryDark} />
                  <Text style={[styles.detailText, { fontWeight: '700', color: COLORS.primaryDark }]}>
                    ৳{item.jobId?.payPerShift}/shift
                  </Text>
                </View>
              </View>

              {item.notes ? (
                <View style={styles.notesBox}>
                  <Text style={styles.notesLabel}>Employer Feedback:</Text>
                  <Text style={styles.notesText}>{item.notes}</Text>
                </View>
              ) : null}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="document-text-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Applications Yet</Text>
              <Text style={styles.emptySub}>
                Browse open catering shifts and apply with 1 click to start getting shifts!
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  jobSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.text,
  },
  notesBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  notesText: {
    fontSize: 12,
    color: COLORS.text,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
});

export default MyApplicationsScreen;
