import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { jobService } from '../../services/jobService';
import JobCard from '../../components/JobCard';
import { COLORS } from '../../config/constants';

const JobsScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Apply Modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await jobService.getJobs({ search });
      if (res.success) {
        setJobs(res.jobs || []);
      }
    } catch (err) {
      console.warn('Error fetching jobs:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const handleApplyPress = (job) => {
    setSelectedJob(job);
    setCoverNote('Available for this shift. I have my own formal white shirt and black trousers.');
  };

  const submitApplication = async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
      const res = await jobService.applyForJob(selectedJob._id, coverNote);
      if (res.success) {
        Alert.alert(
          'Application Submitted!',
          `You have applied for "${selectedJob.title}". Check "My Shifts" tab to track your status.`,
          [{ text: 'OK', onPress: () => setSelectedJob(null) }]
        );
      }
    } catch (err) {
      Alert.alert(
        'Notice',
        err.response?.data?.message || 'You may have already applied for this shift.'
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by area, venue, or shift..."
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Jobs Feed */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading Catering Shifts...</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <JobCard job={item} onApply={handleApplyPress} />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="briefcase-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Catering Shifts Found</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search terms or pull down to refresh.
              </Text>
            </View>
          }
        />
      )}

      {/* 1-Click Apply Confirmation Modal */}
      <Modal
        visible={!!selectedJob}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedJob(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Shift Application</Text>
              <TouchableOpacity onPress={() => setSelectedJob(null)}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            {selectedJob && (
              <View style={styles.modalJobInfo}>
                <Text style={styles.modalJobTitle}>{selectedJob.title}</Text>
                <Text style={styles.modalJobPay}>
                  Rate: ৳{selectedJob.payPerShift} per shift
                </Text>
                <Text style={styles.modalJobVenue}>
                  Venue: {selectedJob.venue} • {selectedJob.location}
                </Text>
              </View>
            )}

            <Text style={styles.coverLabel}>
              Quick Note to Hiring Manager (Optional):
            </Text>
            <TextInput
              style={styles.coverInput}
              multiline
              numberOfLines={3}
              value={coverNote}
              onChangeText={setCoverNote}
              placeholder="e.g. Available this Friday evening, experienced with buffet table setup."
            />

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={submitApplication}
              disabled={applying}
            >
              {applying ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.modalSubmitText}>Submit Application</Text>
                  <Ionicons name="checkmark-circle" size={18} color="#FFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
  },
  list: {
    padding: 16,
    paddingTop: 8,
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
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  modalJobInfo: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  modalJobTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  modalJobPay: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginTop: 2,
  },
  modalJobVenue: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  coverLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  coverInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 10,
    fontSize: 13,
    color: COLORS.text,
    height: 70,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalSubmitBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  modalSubmitText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default JobsScreen;
