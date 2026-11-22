import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../config/constants';

const JobCard = ({ job, onApply }) => {
  return (
    <View style={styles.card}>
      {/* Title & Pay */}
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.category}>{job.category || 'Catering & Service'}</Text>
        </View>
        <View style={styles.payBadge}>
          <Text style={styles.payText}>৳{job.payPerShift}</Text>
          <Text style={styles.paySub}>/shift</Text>
        </View>
      </View>

      {/* Details (Location, Date, Time) */}
      <View style={styles.metaContainer}>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{job.location} • {job.venue}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{job.eventDate}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{job.shiftTimings}</Text>
        </View>
      </View>

      {/* Vacancy and Apply */}
      <View style={styles.footer}>
        <Text style={styles.vacancies}>
          {job.openingsCount} staff needed
        </Text>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => onApply(job)}
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonText}>1-Click Apply</Text>
          <Ionicons name="arrow-forward" size={14} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleWrap: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  category: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  payBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  payText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  paySub: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  metaContainer: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    gap: 4,
    marginVertical: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  vacancies: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default JobCard;
