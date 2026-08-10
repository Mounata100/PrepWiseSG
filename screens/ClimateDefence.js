import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Added native hook for stable routing
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';

const { width, height } = Dimensions.get('window');

const SCENARIO = {
  id: 'orchard_flood',
  title: 'ORCHARD RD: FLASH FLOOD',
  subtitle: 'Intense rain has caused flash floods. Water is breaching basement shopping links!',
  initialHp: 20,
  timeLimit: 20,
  cards: [
    {
      id: 'c1',
      title: 'Vertical Evacuation',
      tag: '⚡ SPEED +30',
      cost: 35,
      hpImpact: 40,
      desc: 'Evacuate up stairs immediately to Level 2 or higher public zones.',
      isCorrect: true,
      feedback: 'Excellent! Moving above ground levels keeps you safe from rapid water convergence.'
    },
    {
      id: 'c2',
      title: 'Grab Emergency Go-Bag',
      tag: 'SURVIVAL +20',
      cost: 20,
      hpImpact: 25,
      desc: 'Snatch your kit containing power banks, cash, and identity papers.',
      isCorrect: true,
      feedback: 'Smart step. Having an emergency kit ready saves vital time later.'
    },
    {
      id: 'c3',
      title: 'Basement Shade Search',
      tag: 'WRONG HAZARD',
      cost: 25,
      hpImpact: -25,
      desc: 'Seek cooling shelter hubs deep inside the basement layout to rest.',
      isCorrect: false,
      feedback: 'CRITICAL ERROR: Seeking shelter in basements traps you directly within flash flood zones!'
    },
    {
      id: 'c4',
      title: 'Deploy Sandbags Locally',
      tag: 'DEFENCE +15',
      cost: 20,
      hpImpact: 15,
      desc: 'Deploy sandbags outside store entrances to slow minor water tracking.',
      isCorrect: true,
      feedback: 'Good mitigation. Sways back early water flow vectors.'
    }
  ]
};

export default function ClimateDefenceGame() {
  const navigation = useNavigation(); // Hook decoupled from route properties safely
  const { answerQuiz, triggerConfetti } = useGame();
  const { addPoints } = useUser();

  // Core Variables
  const [hp, setHp] = useState(SCENARIO.initialHp);
  const [energy, setEnergy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(SCENARIO.timeLimit);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResult, setGameResult] = useState({ status: null, title: '', msg: '', xp: 0, stars: 0 });
  const [feedback, setFeedback] = useState({ text: '', isError: false });
  const [showTutorial, setShowTutorial] = useState(true);
  const [usedCardIds, setUsedCardIds] = useState([]);

  const timerRef = useRef(null);
  const flashAnim = useRef(new Animated.Value(0)).current;
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (showTutorial) return; 

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endGame(false, 'SURVIVAL FAILED', 'The flash flood overtook the linkages before you built stable safety protocols.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [showTutorial]);

  const triggerScreenFlash = () => {
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 0, duration: 200, useNativeDriver: true })
    ]).start();
  };

  const endGame = async (isWin, title, customMessage) => {
    if (gameEnded) return;
    setGameEnded(true);
    clearInterval(timerRef.current);

    const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
    
    let calculatedStars = 0;
    if (isWin) {
      if (timeSpent <= 8) calculatedStars = 3;
      else if (timeSpent <= 14) calculatedStars = 2;
      else calculatedStars = 1;
    }
    
    const calculatedXp = isWin ? 100 + (calculatedStars * 20) : 20;

    setGameResult({
      status: isWin ? 'VICTORY' : 'DEFEAT',
      title,
      msg: `${customMessage}\nTime taken: ${timeSpent}s`,
      xp: calculatedXp,
      stars: calculatedStars
    });

    if (isWin && answerQuiz) {
      answerQuiz(true, calculatedXp);
      triggerConfetti();
      if (addPoints) addPoints(calculatedXp);
    }
  };

  const handleExecuteCard = (card) => {
    if (gameEnded || energy < card.cost || usedCardIds.includes(card.id)) return;

    setUsedCardIds((prev) => [...prev, card.id]);

    if (!card.isCorrect) {
      triggerScreenFlash();
      const nextHp = Math.max(0, hp + card.hpImpact);
      setHp(nextHp);
      setEnergy((prev) => prev - card.cost);
      setFeedback({ text: card.feedback, isError: true });

      if (nextHp <= 0) {
        endGame(false, 'CRITICAL FAILURE', 'Your tactical moves directly compromised personal safety limits.');
      }
      return;
    }

    const nextEnergy = energy - card.cost;
    const nextHp = Math.min(100, hp + card.hpImpact);

    setEnergy(nextEnergy);
    setHp(nextHp);
    setFeedback({ text: card.feedback, isError: false });

    if (nextHp >= 100) {
      endGame(true, 'SURVIVAL SECURED', 'Superb reflexes! You successfully cleared the underground flashpoint hazard area.');
    } else if (nextEnergy < 20 && nextHp < 100) {
      const remainingCards = SCENARIO.cards.filter(c => !usedCardIds.includes(c.id) && c.id !== card.id);
      const canAffordAny = remainingCards.some(c => nextEnergy >= c.cost);
      if (!canAffordAny) {
        endGame(false, 'STRANDED', 'You ran out of Action Points (AP) before building full resilience.');
      }
    }
  };

  // const handleRedirectToHub = () => {
  //   if (!navigation) return;

  //   // Try target routings sequence
  //   try {
  //     // Priority 1: Simple direct name if it's placed inside a common stack
  //     navigation.navigate('Missions');
  //     return;
  //   } catch (e) {
  //     try {
  //       // Priority 2: Alternative common screen key variation
  //       navigation.navigate('MissionsScreen');
  //       return;
  //     } catch (err) {
  //       try {
  //         // Priority 3: Nested configuration tracking structure
  //         navigation.navigate('MainTabs', { screen: 'Missions' });
  //         return;
  //       } catch (nestErr) {
  //         // Terminal Fallback execution mechanics
  //         if (typeof navigation.popToTop === 'function') {
  //           navigation.popToTop();
  //         } else if (typeof navigation.goBack === 'function') {
  //           navigation.goBack();
  //         }
  //       }
  //     }
  //   }
  // };

  const handleRedirectToHub = () => {
    // 1. Check if a standard navigation object exists
    if (!navigation) {
      console.warn("Navigation engine context missing.");
      return;
    }

    // 2. Safe Unwind Array: Executing sequential fallback logic
    try {
      // Check if we can safely go back in the current stack history
      if (navigation.canGoBack()) {
        navigation.goBack();
        return;
      }
      
      // If canGoBack fails, pop straight to the root screen container
      if (typeof navigation.popToTop === 'function') {
        navigation.popToTop();
        return;
      }

      // Hard navigation override fallback paths if structural tracking is altered
      navigation.navigate('Missions');
    } catch (error) {
      console.log("Navigation lifecycle recovery triggered: ", error);
      
      // Final Emergency Escape: Force pop if standard routes fail
      try {
        navigation.pop();
      } catch (nestedErr) {
        console.error("All navigation paths exhausted.");
      }
    }
  };

  const renderCardItem = ({ item }) => {
    const isUsed = usedCardIds.includes(item.id);
    const isAffordable = energy >= item.cost;
    
    return (
      <View style={[styles.card, isUsed && styles.cardUsed, (!isAffordable && !isUsed) && styles.cardLocked]}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardTag, !item.isCorrect && styles.negativeText]}>{item.tag}</Text>
          <Text style={styles.costBadge}>{item.cost} AP</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.desc}</Text>

        <View style={styles.divider} />
        
        <TouchableOpacity
          style={[styles.actionBtn, (isUsed || !isAffordable || gameEnded) && styles.disabledBtn]}
          onPress={() => handleExecuteCard(item)}
          disabled={isUsed || !isAffordable || gameEnded}
        >
          <Text style={styles.actionBtnText}>
            {isUsed ? 'DEPLOYED' : isAffordable ? 'PLAY CARD' : 'INSUFFICIENT AP'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const backgroundFlashColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(9, 13, 22, 0)', 'rgba(239, 68, 68, 0.4)']
  });

  return (
    <View style={styles.mainContainer}>
      <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: backgroundFlashColor, pointerEvents: 'none' }]} />

      {/* Top HUD Display */}
      <View style={[styles.hudBanner, timeLeft <= 8 && styles.hudPanic]}>
        <Text style={styles.hudText}>⚡ RISING FLASH FLOOD: {timeLeft}s LEFT</Text>
      </View>

      {/* Tactical Status Panel */}
      <View style={styles.incidentPanel}>
        <Text style={styles.locationTitle}>{SCENARIO.title}</Text>
        <Text style={styles.locationSubtitle}>{SCENARIO.subtitle}</Text>

        {/* Progress Bars */}
        <View style={styles.metricContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.metricLabel}>Survival Integrity (Goal: 100%)</Text>
            <Text style={styles.metricValueText}>{hp}%</Text>
          </View>
          <View style={styles.barFrame}>
            <View style={[styles.barFill, { width: `${hp}%` }]} />
          </View>
        </View>

        <View style={styles.resourceRow}>
          <Text style={styles.resourceLabel}>Energy Reserves:</Text>
          <Text style={styles.resourceValue}>{energy} AP</Text>
        </View>
      </View>

      {/* Actionable Live Feed Box */}
      {feedback.text ? (
        <View style={[styles.feedbackBox, feedback.isError ? styles.feedbackBoxErr : styles.feedbackBoxSuccess]}>
          <Text style={styles.feedbackText}>{feedback.text}</Text>
        </View>
      ) : (
        <View style={styles.feedbackPlaceholder}>
          <Text style={styles.placeholderText}>Swipe horizontally. Play the right cards to reach 100%.</Text>
        </View>
      )}

      {/* Horizontally Scrollable Action Deck */}
      <FlatList
        data={SCENARIO.cards}
        renderItem={renderCardItem}
        keyExtractor={(item, index) => item.id ? `${item.id}-${index}` : `card-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width * 0.78 + 16}
        decelerationRate="fast"
        contentContainerStyle={styles.deckScrollArea}
      />

      {/* ONBOARDING TUTORIAL OVERLAY */}
      {showTutorial && (
        <View style={styles.tutorialShade}>
          <View style={styles.tutorialBox}>
            <Text style={styles.tutorialHeading}>HOW TO SURVIVE</Text>
            <Text style={styles.tutorialStep}>1. Time is ticking down fast.</Text>
            <Text style={styles.tutorialStep}>2. Spend AP points to deploy tactical cards from your deck hand below.</Text>
            <Text style={styles.tutorialStep}>3. Build your Survival Integrity to 100% before you run out of time or options.</Text>
            <Text style={styles.tutorialStep}>4. Be careful! Wrong climate decisions drain health and map directly to disaster penalties.</Text>
            <Text style={styles.tutorialStep}>5. Manage your resources wisely to ensure long-term survival.</Text>
            <Text style={styles.tutorialStep}>Good Luck!</Text>

            <TouchableOpacity style={styles.startBtn} onPress={() => setShowTutorial(false)}>
              <Text style={styles.startBtnText}>START OPERATION</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* END GAME WRAP OVERLAY WITH STAR SYSTEM */}
      {gameEnded && (
        <View style={styles.modalShade}>
          <View style={[styles.modalBox, gameResult.status === 'VICTORY' ? styles.modalWin : styles.modalLose]}>
            <Text style={styles.modalStatusText}>{gameResult.status}</Text>
            
            {gameResult.status === 'VICTORY' && (
              <View style={styles.starRow}>
                <Text style={styles.starText}>{gameResult.stars >= 1 ? '⭐' : '☆'}</Text>
                <Text style={styles.starText}>{gameResult.stars >= 2 ? '⭐' : '☆'}</Text>
                <Text style={styles.starText}>{gameResult.stars === 3 ? '⭐' : '☆'}</Text>
              </View>
            )}

            <Text style={styles.modalTitleText}>{gameResult.title}</Text>
            <Text style={styles.modalMsgText}>{gameResult.msg}</Text>

            <View style={styles.xpTag}>
              <Text style={styles.xpTagText}>+{gameResult.xp} PREP-XP REWARDED</Text>
            </View>

            <TouchableOpacity
              style={styles.hubRedirectBtn}
              onPress={handleRedirectToHub}
            >
              <Text style={styles.hubRedirectBtnText}>PROCEED TO MISSIONS HUB</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#05070c', paddingTop: 30 },
  hudBanner: { backgroundColor: '#d97706', paddingVertical: 14, alignItems: 'center' },
  hudPanic: { backgroundColor: '#dc2626' },
  hudText: { color: '#ffffff', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  incidentPanel: { padding: 18, backgroundColor: '#0f172a', margin: 16, borderRadius: 16, borderWidth: 1, borderColor: '#1e293b' },
  locationTitle: { color: '#ef4444', fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
  locationSubtitle: { color: '#94a3b8', fontSize: 12, marginTop: 4, lineHeight: 16 },
  metricContainer: { marginTop: 16 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  metricLabel: { color: '#cbd5e1', fontSize: 12, fontWeight: '700' },
  metricValueText: { color: '#10b981', fontSize: 14, fontWeight: '900' },
  barFrame: { height: 12, backgroundColor: '#1e293b', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#10b981' },
  resourceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderColor: '#1e293b' },
  resourceLabel: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  resourceValue: { color: '#38bdf8', fontSize: 14, fontWeight: '900' },
  feedbackBox: { marginHorizontal: 16, padding: 12, borderRadius: 10, borderWidth: 1 },
  feedbackBoxSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.4)' },
  feedbackBoxErr: { backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.4)' },
  feedbackText: { color: '#ffffff', fontSize: 12, fontWeight: '600', textAlign: 'center', lineHeight: 16 },
  feedbackPlaceholder: { marginHorizontal: 16, padding: 12, alignItems: 'center' },
  placeholderText: { color: '#475569', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  deckScrollArea: { paddingHorizontal: 10, paddingVertical: 10 },
  card: { width: width * 0.78, backgroundColor: '#1e293b', borderRadius: 20, padding: 18, marginHorizontal: 8, borderWidth: 1, borderColor: '#334155', justifyContent: 'space-between', height: 260 },
  cardUsed: { opacity: 0.3, backgroundColor: '#0f172a', borderColor: '#1e293b' },
  cardLocked: { opacity: 0.5 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTag: { color: '#f59e0b', fontSize: 11, fontWeight: '900' },
  costBadge: { backgroundColor: '#0f172a', color: '#38bdf8', fontSize: 11, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  cardTitle: { color: '#ffffff', fontSize: 17, fontWeight: '800', marginTop: 8 },
  cardDesc: { color: '#94a3b8', fontSize: 12, marginTop: 4, lineHeight: 16 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 10 },
  actionBtn: { backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  disabledBtn: { backgroundColor: '#475569' },
  actionBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 12, letterSpacing: 0.5 },
  negativeText: { color: '#ef4444' },
  
  tutorialShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2, 6, 23, 0.96)', justifyContent: 'center', alignItems: 'center', padding: 24, zIndex: 100 },
  tutorialBox: { width: '100%', backgroundColor: '#0f172a', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#334155' },
  tutorialHeading: { color: '#38bdf8', fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 18, letterSpacing: 0.5 },
  tutorialStep: { color: '#cbd5e1', fontSize: 14, marginVertical: 8, lineHeight: 22, fontWeight: '500' },
  startBtn: { backgroundColor: '#38bdf8', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  startBtnText: { color: '#05070c', fontWeight: '900', fontSize: 14, letterSpacing: 0.5 },

  modalShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2, 6, 23, 0.94)', justifyContent: 'center', alignItems: 'center', padding: 24, zIndex: 200 },
  modalBox: { width: '100%', padding: 28, borderRadius: 24, alignItems: 'center', borderWidth: 2 },
  modalWin: { backgroundColor: '#064e3b', borderColor: '#10b981' },
  modalLose: { backgroundColor: '#7f1d1d', borderColor: '#ef4444' },
  modalStatusText: { fontSize: 12, fontWeight: '900', letterSpacing: 2, color: '#ffffff', opacity: 0.5 },
  starRow: { flexDirection: 'row', marginVertical: 10 },
  starText: { fontSize: 28, marginHorizontal: 4, color: '#f59e0b' },
  modalTitleText: { color: '#ffffff', fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  modalMsgText: { color: '#cbd5e1', fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  xpTag: { backgroundColor: '#f59e0b', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 30, marginBottom: 24 },
  xpTagText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
  hubRedirectBtn: { backgroundColor: '#ffffff', paddingVertical: 15, borderRadius: 12, width: '100%', alignItems: 'center' },
  hubRedirectBtnText: { color: '#05070c', fontWeight: '900', fontSize: 14 }
});