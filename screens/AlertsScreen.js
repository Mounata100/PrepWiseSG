import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAlerts } from '../contexts/AlertContext';

export default function AlertsScreen() {
  const { loading, pm25Details, weatherDetails, floodDetails, fetchLocalisedTelemetry } = useAlerts();
  const [activeTab, setActiveTab] = useState('weather'); 

  // Direct safety fallback check in case state variables get dropped during re-renders
  const pmValue = pm25Details?.value !== undefined ? pm25Details.value : 12;
  const pmStatus = pm25Details?.status || 'Good';
  const pmColor = pm25Details?.color || '#10B981';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Environmental Monitoring</Text>
        <TouchableOpacity style={styles.refreshBadgeButton} onPress={fetchLocalisedTelemetry} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Ionicons name="refresh" size={18} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>

      {/* SEGMENT SELECTION CONTROLLER */}
      <View style={styles.segmentWrapperRow}>
        {[
          { label: 'PM2.5', key: 'pm25' },
          { label: 'Weather', key: 'weather' },
          { label: 'Flood', key: 'flood' },
        ].map((tab) => {
          const isSelected = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.segmentButton, isSelected && styles.activeSegmentButton]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.segmentButtonText, isSelected && styles.activeSegmentButtonText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContentFrame} showsVerticalScrollIndicator={false}>
        
        {/* TAB 1: LOCAL PM2.5 VIEW */}
        {activeTab === 'pm25' && (
          <View style={styles.dataCardFrame}>
            <Text style={styles.cardSectionLabel}>Localised Air Quality Telemetry</Text>
            <View style={[styles.metricDisplayCircle, { borderColor: pmColor }]}>
              <Text style={[styles.bigMetricNumber, { color: pmColor }]}>{pmValue}</Text>
              <Text style={styles.unitTextLabel}>µg/m³</Text>
            </View>
            <View style={[styles.statusBannerRow, { backgroundColor: pmColor + '20', borderColor: pmColor }]}>
              <Ionicons name="checkbox-outline" size={18} color={pmColor} />
              <Text style={[styles.statusTextValue, { color: pmColor }]}>Air Quality: {pmStatus}</Text>
            </View>
          </View>
        )}

        {/* TAB 2: LIVE WEATHER FORECAST */}
        {activeTab === 'weather' && (
          <View style={styles.dataCardFrame}>
            <Text style={styles.cardSectionLabel}>Current Temperature</Text>
            <Text style={styles.mainNumericalTempDisplay}>{weatherDetails?.currentTemp || '--'}°C</Text>
            
            <Text style={[styles.cardSectionLabel, { marginTop: 20, marginBottom: 10 }]}>3-Day Local Projections</Text>
            {weatherDetails?.forecast && weatherDetails.forecast.map((day, idx) => (
              <View key={idx} style={styles.forecastRowItem}>
                <Text style={styles.forecastDateString}>{day.date}</Text>
                <Text style={styles.forecastTempSpreadText}>{day.max}°C / {day.min}°C</Text>
              </View>
            ))}
          </View>
        )}

        {/* TAB 3: LOCAL FLOOD METRICS */}
        {activeTab === 'flood' && (
          <View style={styles.dataCardFrame}>
            <Text style={styles.cardSectionLabel}>River Discharge Volume Rate</Text>
            <Text style={styles.mainNumericalTempDisplay}>{floodDetails?.riverDischarge || '0.0'} m³/s</Text>
            
            <View style={[styles.statusBannerRow, { backgroundColor: (floodDetails?.color || '#10B981') + '20', borderColor: floodDetails?.color || '#10B981', marginTop: 24 }]}>
              <Ionicons name="water" size={18} color={floodDetails?.color || '#10B981'} />
              <Text style={[styles.statusTextValue, { color: floodDetails?.color || '#10B981' }]}>{floodDetails?.floodRisk || 'Normal Baseline'}</Text>
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030712', paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  titleText: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  refreshBadgeButton: { backgroundColor: '#1E293B', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  segmentWrapperRow: { flexDirection: 'row', backgroundColor: '#090F1E', marginHorizontal: 20, padding: 4, borderRadius: 14, borderWidth: 1, borderColor: '#1E293B', marginBottom: 20 },
  segmentButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeSegmentButton: { backgroundColor: '#1E3A8A', borderWidth: 1, borderColor: '#3B82F6' },
  segmentButtonText: { color: '#64748B', fontSize: 13, fontWeight: '700' },
  activeSegmentButtonText: { color: '#FFFFFF', fontWeight: '800' },
  scrollContentFrame: { paddingHorizontal: 20 },
  dataCardFrame: { backgroundColor: '#090F1E', borderWidth: 1, borderColor: '#1E293B', borderRadius: 24, padding: 24, alignItems: 'center', width: '100%' },
  cardSectionLabel: { color: '#4B5563', fontSize: 12, fontWeight: '800', letterSpacing: 1.1, textTransform: 'uppercase' },
  metricDisplayCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 6, justifyContent: 'center', alignItems: 'center', marginVertical: 24 },
  bigMetricNumber: { fontSize: 44, fontWeight: '900' },
  unitTextLabel: { color: '#64748B', fontSize: 11, fontWeight: '700', marginTop: -4 },
  statusBannerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14, width: '100%', justifyContent: 'center' },
  statusTextValue: { fontSize: 13, fontWeight: '800' },
  mainNumericalTempDisplay: { color: '#FFFFFF', fontSize: 52, fontWeight: '900', marginVertical: 14 },
  forecastRowItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', backgroundColor: '#030712', borderWidth: 1, borderColor: '#1E293B', padding: 14, borderRadius: 12, marginTop: 8 },
  forecastDateString: { color: '#E2E8F0', fontSize: 13, fontWeight: '600' },
  forecastTempSpreadText: { color: '#38BDF8', fontSize: 13, fontWeight: '700' }
});