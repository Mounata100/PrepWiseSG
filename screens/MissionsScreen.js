import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MissionsScreen({ navigation }) {
  
  // ARCADES DATA CONFIGURATION MATRIX
  const SIMULATION_GAMES = [
    {
      id: 'ClimateDefence',
      title: '🌍 Climate Defence Simulator',
      desc: 'Formulate mitigation blueprints against shifting multi-variable microclimates.',
      difficulty: 'HARD',
      diffColor: '#EF4444',
      icon: 'earth',
      reward: '100 XP',
      image: require('../assets/logoImage.png')
    },
    {
      id: 'QuizGame',
      title: '⚡ Dynamic Response Quiz',
      desc: 'Test quick reflexes on civil emergency protocols under intense time limits.',
      difficulty: 'MEDIUM',
      diffColor: '#38BDF8',
      icon: 'flash',
      reward: '50 XP + Combo Streak',
      image: require('../assets/logoImage.png')
    },
    {
      id: 'GoBag',
      title: '🎒 Bug-Out Packing Drill',
      desc: 'Optimize custom survival inventories under a strict 15-second checklist window.',
      difficulty: 'EASY',
      diffColor: '#34D399',
      icon: 'briefcase',
      reward: '40 XP Per Match',
      image: require('../assets/logoImage.png')
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      
      {/* COMMAND HEADER */}
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>TACTICAL TRAINING GROUND</Text>
        <Text style={styles.mainHeading}>Simulation Arcades</Text>
        <Text style={styles.subHeading}>
          Run specialized drills to sharpen your emergency instincts and secure combat points.
        </Text>
      </View>

      {/* MINI-GAMES INTERFACE LOOP */}
      <View style={styles.gamesList}>
        {SIMULATION_GAMES.map((game) => (
          <TouchableOpacity
            key={game.id}
            activeOpacity={0.85}
            style={styles.gameCard}
            onPress={() => navigation.navigate(game.id)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name={game.icon} size={24} color="#FFFFFF" />
              </View>
              <View style={[styles.diffTag, { backgroundColor: game.diffColor + '20', borderColor: game.diffColor }]}>
                <Text style={[styles.diffTagText, { color: game.diffColor }]}>{game.difficulty}</Text>
              </View>
            </View>

            <Text style={styles.gameTitle}>{game.title}</Text>
            <Text style={styles.gameDesc}>{game.desc}</Text>

            <View style={styles.cardFooter}>
              <View style={styles.rewardRow}>
                <Ionicons name="trophy-outline" size={14} color="#F59E0B" />
                <Text style={styles.rewardText}>POTENTIAL: {game.reward}</Text>
              </View>
              <View style={styles.actionPrompt}>
                <Text style={styles.actionPromptText}>Deploy Drill</Text>
                <Ionicons name="arrow-forward" size={14} color="#3B82F6" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* STANDARD CAMPAIGN REINFORCEMENTS METRICS */}
      <Text style={styles.sectionTitle}>Campaign Progress Tracks</Text>

      <View style={styles.campaignCard}>
        <Ionicons name="ribbon-outline" size={24} color="#A855F7" style={styles.campIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.campTitle}>First Responder Certificate</Text>
          <Text style={styles.campSub}>Complete all 3 distinct system simulations once.</Text>
          <View style={styles.progressBar}><View style={[styles.progressFill, { width: '33%', backgroundColor: '#A855F7' }]} /></View>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  header: { paddingTop: 40, marginBottom: 24 },
  sectionLabel: { color: '#64748B', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  mainHeading: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginTop: 2 },
  subHeading: { color: '#94A3B8', fontSize: 14, lineHeight: 22, marginTop: 6 },
  gamesList: { gap: 16, marginBottom: 28 },
  gameCard: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E2937', borderRadius: 24, padding: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  iconContainer: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1E2937', justifyContent: 'center', alignItems: 'center' },
  diffTag: { borderWidth: 1, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  diffTagText: { fontSize: 10, fontWeight: '800' },
  gameTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 6 },
  gameDesc: { color: '#94A3B8', fontSize: 13, lineHeight: 20, marginBottom: 18 },
  cardFooter: { borderTopWidth: 1, borderColor: '#1E2937', paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rewardText: { color: '#F59E0B', fontSize: 11, fontWeight: '700' },
  actionPrompt: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionPromptText: { color: '#3B82F6', fontSize: 13, fontWeight: '700' },
  sectionTitle: { color: '#94A3B8', fontSize: 13, fontWeight: '800', letterSpacing: 0.5, marginBottom: 12, textTransform: 'uppercase' },
  campaignCard: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E2937', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center' },
  campIcon: { marginRight: 14 },
  campTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  campSub: { color: '#64748B', fontSize: 12, marginTop: 1 },
  progressBar: { height: 4, backgroundColor: '#1E2937', borderRadius: 2, marginTop: 10 },
  progressFill: { height: '100%' }
});