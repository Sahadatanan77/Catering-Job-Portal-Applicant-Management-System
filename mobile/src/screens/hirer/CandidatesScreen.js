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
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { applicantService } from '../../services/applicantService';
import { COLORS } from '../../config/constants';

const CandidatesScreen = ({ navigation }) => {
  const [applicants, setApplicants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplicants = async () => {
    try {
      const res = await applicantService.getAllApplicants({ search });
      if (res.success) {
        setApplicants(res.applicants || []);
      }
    } catch (err) {
      console.warn('Error fetching candidates:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [search]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplicants();
  };

  const handleCall = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleWhatsApp = (whatsapp, name) => {
    if (whatsapp) {
      const cleaned = whatsapp.replace(/\D/g, '');
      const intlNumber = cleaned.startsWith('880') ? cleaned : `88${cleaned}`;
      const message = encodeURIComponent(
        `Hello ${name || 'Candidate'}, we reviewed your catering profile on CateringHub regarding our upcoming event shift.`
      );
      Linking.openURL(`https://wa.me/${intlNumber}?text=${message}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by candidate name, skill, or city..."
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading Candidate Pool...</Text>
        </View>
      ) : (
        <FlatList
          data={applicants}
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
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CandidateDetail', { id: item._id })}
            >
              <View style={styles.header}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.fullName?.charAt(0) || 'C'}
                  </Text>
                </View>

                <View style={styles.info}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{item.fullName}</Text>
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="shield-checkmark" size={11} color={COLORS.primaryDark} />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  </View>
                  <Text style={styles.subText}>{item.userId?.email || 'Candidate'}</Text>
                  <Text style={styles.locationText}>
                    📍 {item.hometown || 'Dhaka, Bangladesh'}
                  </Text>
                </View>
              </View>

              {/* Skills */}
              <View style={styles.skills}>
                {(item.skills?.slice(0, 3) || ['Food Serving', 'Banquet Etiquette']).map((s, idx) => (
                  <View key={idx} style={styles.skillChip}>
                    <Text style={styles.skillText}>{s}</Text>
                  </View>
                ))}
              </View>

              {/* Action Buttons: Call & WhatsApp */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => handleCall(item.phone)}
                >
                  <Ionicons name="call" size={14} color="#FFF" />
                  <Text style={styles.callBtnText}>Call ({item.phone})</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.whatsappBtn}
                  onPress={() => handleWhatsApp(item.whatsapp || item.phone, item.fullName)}
                >
                  <Ionicons name="logo-whatsapp" size={15} color="#FFF" />
                  <Text style={styles.whatsappBtnText}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Candidates Found</Text>
              <Text style={styles.emptySub}>
                Pull down to refresh candidate listings.
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  subText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  locationText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#F8FAFC',
  },
  skillChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  skillText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  callBtn: {
    flex: 1,
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  callBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  whatsappBtn: {
    flex: 1,
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  whatsappBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
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
  },
});

export default CandidatesScreen;
