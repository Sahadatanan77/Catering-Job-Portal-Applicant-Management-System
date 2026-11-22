import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STATUS_COLORS } from '../config/constants';

const StatusBadge = ({ status }) => {
  const normalized = (status || 'pending').toLowerCase();
  const config = STATUS_COLORS[normalized] || STATUS_COLORS.pending;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default StatusBadge;
