// =========================================================
// PREPWISE SG: PRODUCTION SITUATED LEARNING ENGINE
// Features: Auto-Shuffle, Clean Lifecycle Controls, Step-by-Step Walkthroughs
// =========================================================

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';
import { useNavigation } from '@react-navigation/native';

const SCENARIOS = [
  { 
    id: 'flood', 
    name: '🚨 FLASH FLOOD WARNING: Bukit Timah', 
    desc: 'Water levels have breached canal boundaries. Flash floods are imminent. Pack items to manage contamination risks and signal operators.',
    critical: ['water', 'meds', 'docs', 'flashlight', 'whistle'],
    steps: [
      { id: 'water', step: "1", title: "Secure Fresh Water First", body: "Floods contaminate local water grids instantly. You need clean bottled water to prevent waterborne pathogens." },
      { id: 'docs', step: "2", title: "Protect Vital ID Documents", body: "Keep your NRIC and insurance credentials in waterproof pouches to speed up verification at evacuation shelters." },
      { id: 'whistle', step: "3", title: "Equip Acoustic Signals", body: "If trapped by rising waters, a whistle provides a clear audio beacon for rescue teams when rain limits visibility." }
    ]
  },
  { 
    id: 'haze', 
    name: '😷 HAZE EMERGENCY: PSI 310 (Hazardous)', 
    desc: 'Air Quality has dropped into hazardous bands across Singapore. Fine particulate matter is posing an immediate threat.',
    critical: ['water', 'meds', 'mask', 'docs', 'phone'],
    steps: [
      { id: 'mask', step: "1", title: "Deploy N95 Mask Protections", body: "Normal surgical masks do not filter PM2.5 haze particles. Only certified N95 respirators protect your respiratory health." },
      { id: 'phone', step: "2", title: "Maintain Communication Lines", body: "Keep a charged power bank packed to stay connected with real-time National Environment Agency (NEA) emergency alerts." },
      { id: 'meds', step: "3", title: "Secure Daily Medications", body: "Hazardous haze triggers asthma and cardiorespiratory strain. Always pre-pack critical prescription backups." }
    ]
  }
];

const GO_BAG_ITEMS = [
  { id: 'water', name: 'Water (3L)', icon: 'water', group: 'Survival', weight: 3 },
  { id: 'food', name: 'Emergency Food', icon: 'fast-food', group: 'Survival', weight: 2 },
  { id: 'meds', name: 'Medications', icon: 'medical', group: 'Health', weight: 0.5 },
  { id: 'docs', name: 'Documents', icon: 'document-text', group: 'Utility', weight: 0.2 },
  { id: 'flashlight', name: 'Flashlight', icon: 'flashlight', group: 'Utility', weight: 0.5 },
  { id: 'mask', name: 'N95 Mask', icon: 'shield', group: 'Health', weight: 0.1 }, 
  { id: 'phone', name: 'Power Bank', icon: 'battery-full', group: 'Utility', weight: 0.4 },
  { id: 'whistle', name: 'Whistle', icon: 'megaphone', group: 'Survival', weight: 0.1 },
];

export default function GoBagScreen() {
  const navigation = useNavigation();
  const userContext = useUser(); // Safely access context fallbacks
  const updatePoints = userContext?.updatePoints;
  const addBadge = userContext?.addBadge;
  const { triggerConfetti } = useGame();

  
  const [gameState, setGameState] = useState('onboarding'); // onboarding, playing, review, finished
  const [currentScenario, setCurrentScenario] = useState(SCENARIOS[0]);
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [currentWeight, setCurrentWeight] = useState(0);
  const MAX_WEIGHT_CAPACITY = 5;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const barAnim = useRef(new Animated.Value(1)).current;

  // Modern Fisher-Yates array shuffling to defeat muscle-memory location tapping
  const shuffleDeck = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Safe game engine reset pipeline
  const startNextScenario = () => {
    // 1. Pick a different scenario to challenge the user's critical thinking
    const currentIdx = SCENARIOS.findIndex(s => s.id === currentScenario.id);
    const nextIdx = (currentIdx + 1) % SCENARIOS.length;
    setCurrentScenario(SCENARIOS[nextIdx]);
    
    // 2. Completely randomize layouts and clear selections
    setItems(shuffleDeck(GO_BAG_ITEMS).map(item => ({ ...item, selected: false })));
    
    // 3. Reset internal game metric arrays
    setScore(0);
    setCurrentWeight(0);
    setTimeLeft(15);
    setGameState('playing');

    // 4. Fire clean layout visual animations
    barAnim.setValue(1);
    Animated.timing(barAnim, {
      toValue: 0,
      duration: 15000,
      useNativeDriver: false
    }).start();
  };

  // Isolated, self-cleaning timer module to completely prevent background locking loops
  useEffect(() => {
    let timerId = null;
    if (gameState === 'playing') {
      timerId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            setGameState('review'); // Instantly shift states out of the execution thread
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [gameState]);

  // Handle subtle alert pulses during active gameplay
  useEffect(() => {
    if (gameState === 'playing') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.02, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true })
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [gameState]);

  const toggleItem = (id) => {
    if (gameState !== 'playing') return;

    const target = items.find(i => i.id === id);
    const isNowSelected = !target.selected;

    // Weight capacity safeguard check
    if (isNowSelected && (currentWeight + target.weight > MAX_WEIGHT_CAPACITY)) return;

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const isCritical = currentScenario.critical.includes(id);
        let delta = isNowSelected ? (isCritical ? 40 : 10) : (isCritical ? -40 : -10);
        
        setScore(s => Math.max(0, s + delta));
        setCurrentWeight(w => Math.max(0, isNowSelected ? w + item.weight : w - item.weight));
        return { ...item, selected: isNowSelected };
      }
      return item;
    }));
  };

  const submitFinalResults = () => {
    if (typeof updatePoints === 'function') updatePoints(score);
    if (score >= 120 && typeof addBadge === 'function') {
      addBadge('go_bag_master');
      triggerConfetti(); // Celebrate badge acquisition
    }
    setGameState('finished');
  };

  return (
    <View style={styles.container}>
      
      {/* QUIT HEADER ANCHOR */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={24} color="#94A3B8" />
      </TouchableOpacity>

      {/* BRIEFING INITIALIZATION SCREEN */}
      {gameState === 'onboarding' && (
        <View style={styles.centerView}>
          <Ionicons name="shield-half" size={72} color="#38BDF8" />
          <Text style={styles.titleText}>Situated Scenario Deck</Text>
          <Text style={styles.descText}>
            Disaster management demands precise loadouts. Analyze localized emergency indicators, pack items matching critical requirements, and manage weight capacity constraints in under 15 seconds!
          </Text>
          <TouchableOpacity style={styles.primaryAction} onPress={startNextScenario}>
            <Text style={styles.actionBtnTxt}>Begin Evaluation</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* TIMED GAME MODULE */}
      {gameState === 'playing' && (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.dashboardRow}>
            <Text style={styles.sectionHeader}>🎒 Pack Loadout</Text>
            <View style={styles.pillBox}>
              <Text style={[styles.pillTxt, timeLeft <= 5 && { color: '#EF4444', fontWeight: '900' }]}>⏱️ {timeLeft}s</Text>
              <Text style={styles.pillTxt}>⭐ {score} XP</Text>
            </View>
          </View>

          {/* TIMER COUNTDOWN VISUAL PROGRESS TRACK */}
          <View style={styles.timerTrack}>
            <Animated.View style={[styles.timerFill, { width: barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }, timeLeft <= 5 && { backgroundColor: '#EF4444' }]} />
          </View>

          {/* DYNAMIC SITUATED ALERT */}
          <Animated.View style={[styles.threatBanner, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.threatTitle}>{currentScenario.name}</Text>
            <Text style={styles.threatBody}>{currentScenario.desc}</Text>
          </Animated.View>

          {/* BAG WEIGHT MONITORING SLIDER */}
          <View style={styles.capacityMetric}>
            <Text style={styles.metricText}>Weight Allocation: {currentWeight.toFixed(1)} / {MAX_WEIGHT_CAPACITY} KG</Text>
            <View style={styles.capacityTrack}>
              <View style={[styles.capacityFill, { width: `${Math.min(100, (currentWeight / MAX_WEIGHT_CAPACITY) * 100)}%` }]} />
            </View>
          </View>

          {/* INTERACTIVE CARDS GRID MATRIX */}
          <View style={styles.matrixGrid}>
            {items.map(item => {
              const selected = item.selected;
              return (
                <TouchableOpacity key={item.id} activeOpacity={0.8} style={[styles.itemTile, selected && styles.tileSelected]} onPress={() => toggleItem(item.id)}>
                  <Ionicons name={item.icon} size={26} color={selected ? '#FFFFFF' : '#64748B'} />
                  <Text style={[styles.tileLabel, selected && { color: '#FFFFFF', fontWeight: '800' }]}>{item.name}</Text>
                  <Text style={styles.tileWeightSub}>{item.weight} KG</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* STEP-BY-STEP GUIDED DE-BRIEFING REVIEW */}
      {gameState === 'review' && (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <View style={styles.reviewHeadingBlock}>
            <Ionicons name="school" size={48} color="#F59E0B" />
            <Text style={styles.titleText}>Strategic Breakdown</Text>
            <Text style={styles.descText}>Review the breakdown below to understand the ideal response strategy for this specific scenario:</Text>
          </View>

          {/* INTERACTIVE TIMELINE ROADMAP CHECKER */}
          <View style={styles.timelineContainer}>
            {currentScenario.steps.map((step, idx) => {
              const userSelectionItem = items.find(i => i.id === step.id);
              const itemPicked = userSelectionItem ? userSelectionItem.selected : false;

              return (
                <View key={idx} style={styles.timelineNode}>
                  <View style={[styles.stepCircle, itemPicked ? styles.circleSuccess : styles.circleFailure]}>
                    <Text style={styles.circleNumText}>{step.step}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <View style={styles.stepTitleRow}>
                      <Text style={styles.stepTitleText}>{step.title}</Text>
                      {itemPicked ? (
                        <Text style={styles.statusSuccessText}>✓ Selected</Text>
                      ) : (
                        <Text style={styles.statusMissingText}>✕ Missed</Text>
                      )}
                    </View>
                    <Text style={styles.stepBodyText}>{step.body}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <TouchableOpacity style={styles.primaryAction} onPress={submitFinalResults}>
            <Text style={styles.actionBtnTxt}>Lock In Scenario Knowledge</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* CONTINUOUS LOOP & PROGRESS HUB RE-ENTRY */}
      {gameState === 'finished' && (
        <View style={styles.centerView}>
          <Ionicons name={score >= 120 ? "checkmark-circle" : "sync-circle"} size={72} color={score >= 120 ? "#10B981" : "#F59E0B"} />
          <Text style={styles.titleText}>{score >= 120 ? "Scenario Mastered!" : "Knowledge Logged"}</Text>
          <Text style={styles.finalScoreLabel}>Loadout Performance Rating: {score} XP</Text>
          
          <TouchableOpacity style={styles.primaryAction} onPress={startNextScenario}>
            <Text style={styles.actionBtnTxt}>Advance to Next Random Scenario</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.primaryAction, styles.secondaryButton]} onPress={() => navigation.goBack()}>
            <Text style={[styles.actionBtnTxt, { color: '#94A3B8' }]}>Return to Missions Hub</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  backBtn: { marginTop: 45, marginBottom: 10, alignSelf: 'flex-start', padding: 4 },
  centerView: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  titleText: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', marginTop: 16, marginBottom: 8, textAlign: 'center' },
  descText: { fontSize: 15, color: '#94A3B8', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  primaryAction: { backgroundColor: '#3B82F6', paddingVertical: 14, borderRadius: 12, width: '100%', alignItems: 'center', marginTop: 8 },
  secondaryButton: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', marginTop: 12 },
  actionBtnTxt: { color: 'white', fontSize: 16, fontWeight: '800' },
  dashboardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionHeader: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  pillBox: { flexDirection: 'row', gap: 10, backgroundColor: '#1E293B', padding: 6, borderRadius: 20, paddingHorizontal: 12 },
  pillTxt: { color: '#E2E8F0', fontWeight: '700', fontSize: 13 },
  timerTrack: { height: 6, backgroundColor: '#1E293B', borderRadius: 3, width: '100%', marginBottom: 16, overflow: 'hidden' },
  timerFill: { height: '100%', backgroundColor: '#10B981', width: '100%' },
  threatBanner: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#334155', borderRadius: 16, padding: 16, marginBottom: 16 },
  threatTitle: { color: '#F43F5E', fontWeight: '900', fontSize: 15, marginBottom: 4 },
  threatBody: { color: '#94A3B8', fontSize: 13, lineHeight: 18 },
  capacityMetric: { marginBottom: 16 },
  metricText: { color: '#64748B', fontSize: 12, fontWeight: '700', marginBottom: 6 },
  capacityTrack: { height: 6, backgroundColor: '#1E293B', borderRadius: 3, overflow: 'hidden' },
  capacityFill: { height: '100%', backgroundColor: '#F59E0B' },
  matrixGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  itemTile: { width: '48%', backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E2937', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 12 },
  tileSelected: { backgroundColor: '#0F766E', borderColor: '#14B8A6' },
  tileLabel: { color: '#94A3B8', fontSize: 14, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  tileWeightSub: { color: '#64748B', fontSize: 11, marginTop: 2 },
  finalScoreLabel: { fontSize: 16, fontWeight: '800', color: '#34D399', marginBottom: 24 },
  
  // REVIEW FLOW COMPONENT Layout MANAGEMENT
  reviewHeadingBlock: { alignItems: 'center', marginVertical: 12 },
  timelineContainer: { marginVertical: 16, width: '100%' },
  timelineNode: { flexDirection: 'row', marginBottom: 20, width: '100%' },
  stepCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 },
  circleSuccess: { backgroundColor: '#0F766E' },
  circleFailure: { backgroundColor: '#7F1D1D' },
  circleNumText: { color: 'white', fontWeight: '900', fontSize: 14 },
  stepContent: { flex: 1, backgroundColor: '#0F172A', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#1E2937' },
  stepTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  stepTitleText: { color: 'white', fontWeight: '800', fontSize: 14 },
  stepBodyText: { color: '#94A3B8', fontSize: 12, lineHeight: 17 },
  statusSuccessText: { color: '#34D399', fontSize: 11, fontWeight: '700' },
  statusMissingText: { color: '#F43F5E', fontSize: 11, fontWeight: '700' }
});