import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MissionsScreen({ navigation }) {
  
  // MAP NODES CONFIGURATION (Sequential Path)
  const MAP_MISSIONS = [
    {
      id: 'GoBag',
      level: 1,
      title: '🎒 Bug-Out Packing Drill',
      desc: 'Optimize custom survival inventories under a strict 15-second window.',
      difficulty: 'EASY',
      diffColor: '#34D399',
      icon: 'briefcase',
      reward: '40 XP',
      status: 'completed', // 'completed', 'unlocked', 'locked'
    },
    {
      id: 'QuizGame',
      level: 2,
      title: '⚡ Dynamic Response Quiz',
      desc: 'Test quick reflexes on civil emergency protocols under time limits.',
      difficulty: 'MEDIUM',
      diffColor: '#38BDF8',
      icon: 'flash',
      reward: '50 XP',
      status: 'current',
    },
    {
      id: 'ClimateDefence',
      level: 3,
      title: '🌍 Climate Defence Simulator',
      desc: 'Formulate mitigation blueprints against shifting microclimates.',
      difficulty: 'HARD',
      diffColor: '#EF4444',
      icon: 'earth',
      reward: '100 XP',
      status: 'locked',
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
      
      {/* MAP HEADER */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Ionicons name="map" size={14} color="#EC4899" />
          <Text style={styles.sectionLabel}>CAMPAIGN WORLD MAP</Text>
        </View>
        <Text style={styles.mainHeading}>Survival Journey</Text>
        <Text style={styles.subHeading}>
          Progress through the tactical sectors to achieve your First Responder Certification.
        </Text>
      </View>

      {/* SQUIGGLY PATH MAP CONTAINER */}
      <View style={styles.mapContainer}>
        {/* Decorative background winding path line representation */}
        <View style={styles.windingLineBackground} />

        {MAP_MISSIONS.map((mission, index) => {
          // Calculate winding offset: even indexes align left, odd align right for the Candy Crush zig-zag effect
          const isEven = index % 2 === 0;
          const isLocked = mission.status === 'locked';
          const isCurrent = mission.status === 'current';

          return (
            <View key={mission.id} style={[styles.nodeRow, isEven ? styles.rowLeft : styles.rowRight]}>
              
              {/* Node Circle / Button */}
              <TouchableOpacity
                activeOpacity={isLocked ? 1 : 0.8}
                onPress={() => !isLocked && navigation.navigate(mission.id)}
                style={[
                  styles.mapNode,
                  isCurrent && styles.nodeCurrent,
                  isLocked && styles.nodeLocked,
                  { borderColor: mission.diffColor }
                ]}
              >
                {/* Status Indicator Icon Overlay */}
                {mission.status === 'completed' && (
                  <View style={styles.statusBadgeCompleted}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
                {isLocked && (
                  <View style={styles.statusBadgeLocked}>
                    <Ionicons name="lock-closed" size={12} color="#94A3B8" />
                  </View>
                )}

                <Ionicons 
                  name={mission.icon} 
                  size={28} 
                  color={isLocked ? '#475569' : '#FFFFFF'} 
                />
                <Text style={[styles.nodeLevelText, isLocked && { color: '#475569' }]}>
                  LVL {mission.level}
                </Text>
              </TouchableOpacity>

              {/* Floating Info Card Attached to Node */}
              <View style={[styles.nodeCard, isLocked && styles.cardLocked]}>
                <View style={styles.cardHeaderTop}>
                  <View style={[styles.diffTag, { backgroundColor: mission.diffColor + '20', borderColor: mission.diffColor }]}>
                    <Text style={[styles.diffTagText, { color: mission.diffColor }]}>{mission.difficulty}</Text>
                  </View>
                  <View style={styles.rewardPill}>
                    <Ionicons name="trophy-outline" size={12} color="#F59E0B" />
                    <Text style={styles.rewardText}>{mission.reward}</Text>
                  </View>
                </View>

                <Text style={[styles.gameTitle, isLocked && { color: '#64748B' }]}>{mission.title}</Text>
                <Text style={[styles.gameDesc, isLocked && { color: '#475569' }]}>{mission.desc}</Text>

                {!isLocked ? (
                  <TouchableOpacity 
                    style={styles.playButton}
                    onPress={() => navigation.navigate(mission.id)}
                  >
                    <Text style={styles.playButtonText}>{isCurrent ? 'Play Mission' : 'Replay Mission'}</Text>
                    <Ionicons name="play" size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.lockedNotice}>Complete previous level to unlock</Text>
                )}
              </View>

            </View>
          );
        })}
      </View>

      {/* PROGRESS FOOTER BANNER */}
      <View style={styles.campaignCard}>
        <Ionicons name="ribbon" size={28} color="#A855F7" style={styles.campIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.campTitle}>First Responder Certificate</Text>
          <Text style={styles.campSub}>Level 1 of 3 Complete (33%)</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '33%', backgroundColor: '#A855F7' }]} />
          </View>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', paddingHorizontal: 16 },
  header: { paddingTop: 40, marginBottom: 32, alignItems: 'center' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1E1B4B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 8 },
  sectionLabel: { color: '#EC4899', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  mainHeading: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', textAlign: 'center' },
  subHeading: { color: '#94A3B8', fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 4, paddingHorizontal: 20 },
  
  mapContainer: { position: 'relative', gap: 32, marginBottom: 32 },
  windingLineBackground: {
    position: 'absolute',
    top: 20,
    bottom: 20,
    left: '50%',
    width: 4,
    backgroundColor: '#1E293B',
    transform: [{ translateX: -2 }],
    borderRadius: 2,
    zIndex: -1,
  },
  
  nodeRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  rowLeft: { flexDirection: 'row' },
  rowRight: { flexDirection: 'row-reverse' },

  mapNode: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0F172A',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  nodeCurrent: {
    backgroundColor: '#1E1B4B',
    transform: [{ scale: 1.1 }],
  },
  nodeLocked: {
    backgroundColor: '#090D16',
    borderColor: '#1E293B' ? '#1E293B' : '#334155',
  },
  nodeLevelText: { fontSize: 9, fontWeight: '900', color: '#FFFFFF', position: 'absolute', bottom: 6 },
  
  statusBadgeCompleted: { position: 'absolute', top: -4, right: -4, backgroundColor: '#10B981', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#020617' },
  statusBadgeLocked: { position: 'absolute', top: -4, right: -4, backgroundColor: '#1E293B', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#020617' },

  nodeCard: { flex: 1, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E2937', borderRadius: 20, padding: 14 },
  cardLocked: { backgroundColor: '#070A12', borderColor: '#111827' },
  cardHeaderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  
  diffTag: { borderWidth: 1, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6 },
  diffTagText: { fontSize: 9, fontWeight: '800' },
  rewardPill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rewardText: { color: '#F59E0B', fontSize: 10, fontWeight: '700' },

  gameTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  gameDesc: { color: '#94A3B8', fontSize: 11, lineHeight: 16, marginBottom: 12 },

  playButton: { backgroundColor: '#3B82F6', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 8, borderRadius: 10, gap: 6 },
  playButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  lockedNotice: { color: '#475569', fontSize: 10, fontStyle: 'italic', textAlign: 'center' },

  campaignCard: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E2937', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center' },
  campIcon: { marginRight: 14 },
  campTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  campSub: { color: '#64748B', fontSize: 12, marginTop: 1 },
  progressBar: { height: 4, backgroundColor: '#1E2937', borderRadius: 2, marginTop: 10 },
  progressFill: { height: '100%' }
});