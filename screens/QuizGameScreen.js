// =========================================================
// PREPWISE SG: CLIMATE CRISIS DRILL ENGINE
// Targeted at 18-40 demographic: Flash Floods, Haze, Severe Heatwaves
// Features: Dynamic Shuffle, Rationale De-briefs, Mastery Gate Locks
// =========================================================

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';
import { useNavigation } from '@react-navigation/native';

// High-impact questions mapping specifically to Singapore's climate vulnerabilities
const CLIMATE_QUIZ_DATA = [
  { 
    id: 'sg_flash_flood',
    q: "PUB issues a Flash Flood Alert: Heavy rainfall has pushed canal capacity past 95% near your location. Water is pooling rapidly on the road. Your immediate move?", 
    options: [
      "Move vertically to the second level or higher of a nearby building immediately.",
      "Stay in your car and try to drive quickly through the low-lying flooded section.",
      "Wait on the pedestrian pavement to see if the drainage infrastructure clears it."
    ], 
    correct: 0,
    reviewTitle: "Flash Flood Surge Management",
    rationale: "Climate change causes intense, localized downpours that can overwhelm drainage systems within minutes. Moving to high ground vertically is the safest response. Trying to drive through running water can stall your vehicle, trap you, or sweep you away, while standing on pavements exposes you to open, invisible drains."
  },
  { 
    id: 'sg_haze_hazardous',
    q: "A severe multi-day haze event hits Singapore, pushing the 24-hour PSI into the 'Hazardous' band (300+). You have mild asthma. What is your survival baseline?", 
    options: [
      "Stay indoors, seal windows, run an air purifier with a HEPA filter, and wear an N95 mask if forced to go out.",
      "Switch to a standard surgical mask and continue your evening run at the East Coast Park connector.",
      "Open all windows to maximize cross-ventilation and allow fresh air currents through."
    ], 
    correct: 0,
    reviewTitle: "Hazardous Haze PM2.5 Defense",
    rationale: "Prolonged haze driven by climate-induced regional wildfires creates fine PM2.5 particulates. Standard surgical masks do not filter these effectively. You must stay indoors with sealed windows and HEPA filtration. Exercising outdoors forces deep intake of harmful toxins directly into your lungs."
  },
  { 
    id: 'sg_heatwave_wbgt',
    q: "MSS reports a severe heatwave with a Wet Bulb Globe Temperature (WBGT) reading of 33°C (Extreme Heat Stress). You are planning an outdoor workout. How do you adapt?", 
    options: [
      "Postpone the outdoor session, move to a shaded/air-conditioned environment, and hydrate aggressively.",
      "Push through the workout by just drinking more water, ignoring minor dizziness.",
      "Wear dark, heavy athletic gear to shield your skin cells directly from UV light rays."
    ], 
    correct: 0,
    reviewTitle: "Extreme Heat Stress & WBGT Protocols",
    rationale: "With climate change accelerating urban heat island effects, WBGT measures temperature, humidity, wind, and solar radiation. A WBGT of 33°C or higher means your sweat cannot evaporate effectively to cool your body. Pushing through triggers heat stroke, which is a life-threatening medical emergency."
  },
  { 
    id: 'sg_vector_dengue',
    q: "Rising ambient temperatures due to climate change shorten the incubation period of the Aedes mosquito, causing an explosive Dengue outbreak in your estate. Your primary intervention?", 
    options: [
      "Conduct the 5-Step Mozzie Wipeout weekly to eliminate stagnant water and spray DEET repellent.",
      "Keep internal house windows wide open without insect screens to let mosquitoes fly back out.",
      "Assume the town council's routine fogging schedules handle 100% of breeding grounds."
    ], 
    correct: 0,
    reviewTitle: "Climate-Accelerated Vector Prevention",
    rationale: "Warmer climates make mosquitoes breed faster and bite more frequently. Routine chemical fogging only targets adult mosquitoes, not larvae. Proactive individual action—disrupting stagnant water pools via the Mozzie Wipeout inside and around your home—is the single most effective barrier against outbreaks."
  }
];

export default function QuizGameScreen() {
  const navigation = useNavigation();
  const { updatePoints, addBadge } = useUser();
  const { triggerConfetti } = useGame(); // Hook to trigger confetti celebration
  
  const [gameState, setGameState] = useState('onboarding'); // onboarding, playing, review, finished
  const [activeDeck, setActiveDeck] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12); // Slightly optimized for split-second decisions
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [historyLog, setHistoryLog] = useState([]);
  
  const timerRef = useRef(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Fisher-Yates randomization to stop users from memorizing muscle-patterns
  const shuffleQuizDeck = () => {
    let randomizedDeck = CLIMATE_QUIZ_DATA.map(item => {
      const standardCorrectString = item.options[item.correct];
      const randomizedOptions = [...item.options].sort(() => Math.random() - 0.5);
      const updatedCorrectIndex = randomizedOptions.indexOf(standardCorrectString);

      return {
        ...item,
        options: randomizedOptions,
        correct: updatedCorrectIndex
      };
    });

    for (let i = randomizedDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomizedDeck[i], randomizedDeck[j]] = [randomizedDeck[j], randomizedDeck[i]];
    }
    setActiveDeck(randomizedDeck);
  };

  const startQuizEngine = () => {
    shuffleQuizDeck();
    setCurrentQ(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setHistoryLog([]);
    setTimeLeft(12);
    setGameState('playing');
    refreshTimer();
  };

  const refreshTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          processEvaluation(-1); // Automatically fails via timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const processEvaluation = (index) => {
    if (gameState !== 'playing' || selectedAnswer !== null) return;
    clearInterval(timerRef.current);
    setSelectedAnswer(index);

    const currentQuizObject = activeDeck[currentQ];
    const isCorrect = index === currentQuizObject.correct;

    setHistoryLog(prev => [...prev, {
      questionText: currentQuizObject.q,
      title: currentQuizObject.reviewTitle,
      explanation: currentQuizObject.rationale,
      userSelection: index !== -1 ? currentQuizObject.options[index] : "CRITICAL TIMEOUT EXPIRED",
      accurateSolution: currentQuizObject.options[currentQuizObject.correct],
      wasSuccessful: isCorrect
    }]);

    if (isCorrect) {
      setStreak(s => s + 1);
      setScore(s => s + 50 + (streak * 15));
    } else {
      setStreak(0);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 12, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -12, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true })
      ]).start();
    }

    setTimeout(() => {
      if (currentQ < activeDeck.length - 1) {
        setSelectedAnswer(null);
        setCurrentQ(c => c + 1);
        setTimeLeft(12);
        refreshTimer();
      } else {
        setGameState('review');
      }
    }, 1800);
  };

  const finalizeReviewCycle = () => {
    const totalCorrectCalculated = historyLog.filter(x => x.wasSuccessful).length;
    
    if (totalCorrectCalculated === activeDeck.length) {
      if (typeof updatePoints === 'function') updatePoints(score);
      if (typeof addBadge === 'function'){
        addBadge('climate_crisis_master');
        triggerConfetti(); // Celebrate badge acquisition
        setGameState('finished');
      }
    } else {
      // Gated feedback loop forces restart with freshly shuffled answers
      startQuizEngine();
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const totalQuestionsCount = activeDeck.length || 1;
  const progressPct = ((currentQ + 1) / totalQuestionsCount) * 100;
  const metricsCorrectCount = historyLog.filter(x => x.wasSuccessful).length;
  const performancePassedMastery = metricsCorrectCount === totalQuestionsCount;

  return (
    <View style={styles.container}>
      
      {/* 1. ONBOARDING HUB */}
      {gameState === 'onboarding' && (
        <View style={styles.overlayCenter}>
          <View style={styles.iconCircle}>
            <Ionicons name="thunderstorm" size={44} color="#38BDF8" />
          </View>
          <Text style={styles.modalTitle}>Climate Crisis Drill</Text>
          <Text style={styles.modalDesc}>
            Climate change has increased the volatility of flash floods, hazardous haze, and severe heatwaves across Singapore. You have <Text style={{color: '#EF4444', fontWeight: 'bold'}}>12 seconds</Text> to make rapid-response tactical decisions. To break past this mission gate, you must reach a <Text style={{color: '#34D399', fontWeight: 'bold'}}>100% Perfect Mastery Score</Text>.
          </Text>
          <TouchableOpacity style={styles.actionBtn} onPress={startQuizEngine}>
            <Text style={styles.actionBtnText}>Initialize Crisis Engine</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 2. LIVE DRILL EXECUTION RUNTIME */}
      {gameState === 'playing' && activeDeck.length > 0 && (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.title}>🚨 Response Drill</Text>
            <Text style={styles.statText}>Scenario {currentQ + 1}/{activeDeck.length}</Text>
          </View>

          <View style={styles.track}>
            <View style={[styles.trackFill, { width: `${progressPct}%` }]} />
          </View>

          <View style={styles.hudContainer}>
            <View style={[styles.hudCard, timeLeft <= 4 && { borderColor: '#EF4444' }]}>
              <Text style={styles.hudLabel}>DECISION WINDOW</Text>
              <Text style={[styles.hudValue, timeLeft <= 4 && { color: '#EF4444' }]}>{timeLeft}s</Text>
            </View>
            <View style={styles.hudCard}>
              <Text style={styles.hudLabel}>COMBO STREAK</Text>
              <Text style={[styles.hudValue, { color: '#38BDF8' }]}>🔥 {streak}</Text>
            </View>
          </View>

          <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>
            <Text style={styles.questionText}>{activeDeck[currentQ].q}</Text>

            {activeDeck[currentQ].options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrectAnswer = i === activeDeck[currentQ].correct;
              const hasAnswered = selectedAnswer !== null;

              let customStyle = {};
              if (hasAnswered) {
                if (isCorrectAnswer) customStyle = styles.btnCorrect;
                else if (isSelected) customStyle = styles.btnWrong;
              }

              return (
                <TouchableOpacity
                  key={i}
                  disabled={hasAnswered}
                  activeOpacity={0.8}
                  style={[styles.optionBtn, customStyle]}
                  onPress={() => processEvaluation(i)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                  {hasAnswered && isCorrectAnswer && (
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                  )}
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </View>
      )}

      {/* 3. DYNAMIC PEDAGOGICAL DE-BRIEFING REVIEW */}
      {gameState === 'review' && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
          <View style={styles.reviewHeaderUnit}>
            <Ionicons 
              name={performancePassedMastery ? "shield-checkmark" : "warning"} 
              size={56} 
              color={performancePassedMastery ? "#10B981" : "#F59E0B"} 
            />
            <Text style={styles.modalTitle}>Tactical Assessment</Text>
            <Text style={styles.modalDesc}>
              {performancePassedMastery 
                ? "Excellent response patterns recorded. You've adapted perfectly to climate emergency criteria." 
                : `Security clearance failed (${metricsCorrectCount}/${totalQuestionsCount} correct). Review the core strategic rationales below to understand why the other choices lead to vulnerabilities.`}
            </Text>
          </View>

          {historyLog.map((log, index) => (
            <View key={index} style={[styles.reviewItemCard, !log.wasSuccessful && styles.reviewItemCardError]}>
              <View style={styles.reviewCardRow}>
                <Text style={styles.reviewCardTitle}>Analysis #{index + 1}: {log.title}</Text>
                <Ionicons 
                  name={log.wasSuccessful ? "checkmark-circle" : "close-circle"} 
                  size={20} 
                  color={log.wasSuccessful ? "#10B981" : "#EF4444"} 
                />
              </View>
              
              <Text style={styles.reviewQuestionText}>{log.questionText}</Text>
              
              <View style={styles.logDetailBlock}>
                <Text style={styles.logLabelText}>Your Protocol Action: <Text style={log.wasSuccessful ? styles.greenText : styles.redText}>{log.userSelection}</Text></Text>
                {!log.wasSuccessful && (
                  <Text style={styles.logLabelText}>Mandatory Correct Track: <Text style={styles.greenText}>{log.accurateSolution}</Text></Text>
                )}
              </View>

              <View style={styles.rationaleBox}>
                <Text style={styles.rationaleLabel}>💡 CLIMATE IMPACT BREAKDOWN:</Text>
                <Text style={styles.rationaleText}>{log.explanation}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity style={[styles.actionBtn, { marginTop: 10 }]} onPress={finalizeReviewCycle}>
            <Text style={styles.actionBtnText}>
              {performancePassedMastery ? "Commit Metrics to Hub" : "Restart Mastery Evaluation Loop"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* 4. MISSION COMPLETED PIN-LOCKED VIEW */}
      {gameState === 'finished' && (
        <View style={styles.overlayCenter}>
          <Ionicons name="ribbon" size={84} color="#34D399" />
          <Text style={styles.modalTitle}>Mission Matrix Cleared</Text>
          <Text style={styles.finalScore}>+{score} XP Gained</Text>
          <Text style={[styles.modalDesc, { marginBottom: 30 }]}>
            Your rapid response instincts meet the environmental threat threshold profiles monitored by PrepWiseSG.
          </Text>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#1E293B' }]} onPress={() => navigation.goBack()}>
            <Text style={styles.actionBtnText}>Return to Missions Hub</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  overlayCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#38BDF8', marginBottom: 12 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', marginBottom: 12, textAlign: 'center', marginTop: 10 },
  modalDesc: { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  finalScore: { fontSize: 32, fontWeight: '900', color: '#38BDF8', marginBottom: 16 },
  actionBtn: { backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 14, width: '100%', alignItems: 'center' },
  actionBtnText: { color: 'white', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  header: { paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  statText: { color: '#94A3B8', fontWeight: '700', fontSize: 14 },
  track: { height: 6, backgroundColor: '#1E293B', borderRadius: 10, marginTop: 14, overflow: 'hidden' },
  trackFill: { height: '100%', backgroundColor: '#38BDF8' },
  hudContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 12 },
  hudCard: { flex: 1, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E2937', borderRadius: 14, padding: 12, alignItems: 'center' },
  hudLabel: { fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 },
  hudValue: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', marginTop: 2 },
  card: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E2937', borderRadius: 24, padding: 20, marginTop: 16 },
  questionText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', lineHeight: 24, marginBottom: 20 },
  optionBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E293B', padding: 18, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  btnCorrect: { backgroundColor: '#059669', borderColor: '#10B981' },
  btnWrong: { backgroundColor: '#DC2626', borderColor: '#EF4444' },
  optionText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', flex: 1 },

  // REVIEW MATRIX BLOCK GENERATION
  reviewHeaderUnit: { alignItems: 'center', marginTop: 40, marginBottom: 16 },
  reviewItemCard: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E2937', borderRadius: 16, padding: 16, marginBottom: 16 },
  reviewItemCardError: { borderColor: '#7F1D1D' },
  reviewCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reviewCardTitle: { color: '#E2E8F0', fontWeight: '800', fontSize: 14 },
  reviewQuestionText: { color: '#94A3B8', fontSize: 13, lineHeight: 18, marginBottom: 12 },
  logDetailBlock: { backgroundColor: '#1E293B', padding: 10, borderRadius: 8, marginBottom: 12, gap: 4 },
  logLabelText: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  greenText: { color: '#34D399', fontWeight: '800' },
  redText: { color: '#F43F5E', fontWeight: '800' },
  rationaleBox: { backgroundColor: '#1E1B4B', borderWidth: 1, borderColor: '#3730A3', padding: 12, borderRadius: 10 },
  rationaleLabel: { color: '#F59E0B', fontWeight: '800', fontSize: 11, marginBottom: 2 },
  rationaleText: { color: '#E2E8F0', fontSize: 12, lineHeight: 17 }
});