// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native'; // Added native hook for stable routing
// import { useGame } from '../contexts/GameContext';
// import { useUser } from '../contexts/UserContext';

// const { width, height } = Dimensions.get('window');

// const SCENARIO = {
//   id: 'orchard_flood',
//   title: 'ORCHARD RD: FLASH FLOOD',
//   subtitle: 'Intense rain has caused flash floods. Water is breaching basement shopping links!',
//   initialHp: 20,
//   timeLimit: 20,
//   cards: [
//     {
//       id: 'c1',
//       title: 'Vertical Evacuation',
//       tag: '⚡ SPEED +30',
//       cost: 35,
//       hpImpact: 40,
//       desc: 'Evacuate up stairs immediately to Level 2 or higher public zones.',
//       isCorrect: true,
//       feedback: 'Excellent! Moving above ground levels keeps you safe from rapid water convergence.'
//     },
//     {
//       id: 'c2',
//       title: 'Grab Emergency Go-Bag',
//       tag: 'SURVIVAL +20',
//       cost: 20,
//       hpImpact: 25,
//       desc: 'Snatch your kit containing power banks, cash, and identity papers.',
//       isCorrect: true,
//       feedback: 'Smart step. Having an emergency kit ready saves vital time later.'
//     },
//     {
//       id: 'c3',
//       title: 'Basement Shade Search',
//       tag: 'WRONG HAZARD',
//       cost: 25,
//       hpImpact: -25,
//       desc: 'Seek cooling shelter hubs deep inside the basement layout to rest.',
//       isCorrect: false,
//       feedback: 'CRITICAL ERROR: Seeking shelter in basements traps you directly within flash flood zones!'
//     },
//     {
//       id: 'c4',
//       title: 'Deploy Sandbags Locally',
//       tag: 'DEFENCE +15',
//       cost: 20,
//       hpImpact: 15,
//       desc: 'Deploy sandbags outside store entrances to slow minor water tracking.',
//       isCorrect: true,
//       feedback: 'Good mitigation. Sways back early water flow vectors.'
//     }
//   ]
// };

// export default function ClimateDefenceGame() {
//   const navigation = useNavigation(); // Hook decoupled from route properties safely
//   const { answerQuiz, triggerConfetti } = useGame();
//   const { addPoints } = useUser();

//   // Core Variables
//   const [hp, setHp] = useState(SCENARIO.initialHp);
//   const [energy, setEnergy] = useState(100);
//   const [timeLeft, setTimeLeft] = useState(SCENARIO.timeLimit);
//   const [gameEnded, setGameEnded] = useState(false);
//   const [gameResult, setGameResult] = useState({ status: null, title: '', msg: '', xp: 0, stars: 0 });
//   const [feedback, setFeedback] = useState({ text: '', isError: false });
//   const [showTutorial, setShowTutorial] = useState(true);
//   const [usedCardIds, setUsedCardIds] = useState([]);

//   const timerRef = useRef(null);
//   const flashAnim = useRef(new Animated.Value(0)).current;
//   const startTime = useRef(Date.now());

//   useEffect(() => {
//     if (showTutorial) return; 

//     timerRef.current = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerRef.current);
//           endGame(false, 'SURVIVAL FAILED', 'The flash flood overtook the linkages before you built stable safety protocols.');
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timerRef.current);
//   }, [showTutorial]);

//   const triggerScreenFlash = () => {
//     Animated.sequence([
//       Animated.timing(flashAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
//       Animated.timing(flashAnim, { toValue: 0, duration: 200, useNativeDriver: true })
//     ]).start();
//   };

//   const endGame = async (isWin, title, customMessage) => {
//     if (gameEnded) return;
//     setGameEnded(true);
//     clearInterval(timerRef.current);

//     const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
    
//     let calculatedStars = 0;
//     if (isWin) {
//       if (timeSpent <= 8) calculatedStars = 3;
//       else if (timeSpent <= 14) calculatedStars = 2;
//       else calculatedStars = 1;
//     }
    
//     const calculatedXp = isWin ? 100 + (calculatedStars * 20) : 20;

//     setGameResult({
//       status: isWin ? 'VICTORY' : 'DEFEAT',
//       title,
//       msg: `${customMessage}\nTime taken: ${timeSpent}s`,
//       xp: calculatedXp,
//       stars: calculatedStars
//     });

//     if (isWin && answerQuiz) {
//       answerQuiz(true, calculatedXp);
//       triggerConfetti();
//       if (addPoints) addPoints(calculatedXp);
//     }
//   };

//   const handleExecuteCard = (card) => {
//     if (gameEnded || energy < card.cost || usedCardIds.includes(card.id)) return;

//     setUsedCardIds((prev) => [...prev, card.id]);

//     if (!card.isCorrect) {
//       triggerScreenFlash();
//       const nextHp = Math.max(0, hp + card.hpImpact);
//       setHp(nextHp);
//       setEnergy((prev) => prev - card.cost);
//       setFeedback({ text: card.feedback, isError: true });

//       if (nextHp <= 0) {
//         endGame(false, 'CRITICAL FAILURE', 'Your tactical moves directly compromised personal safety limits.');
//       }
//       return;
//     }

//     const nextEnergy = energy - card.cost;
//     const nextHp = Math.min(100, hp + card.hpImpact);

//     setEnergy(nextEnergy);
//     setHp(nextHp);
//     setFeedback({ text: card.feedback, isError: false });

//     if (nextHp >= 100) {
//       endGame(true, 'SURVIVAL SECURED', 'Superb reflexes! You successfully cleared the underground flashpoint hazard area.');
//     } else if (nextEnergy < 20 && nextHp < 100) {
//       const remainingCards = SCENARIO.cards.filter(c => !usedCardIds.includes(c.id) && c.id !== card.id);
//       const canAffordAny = remainingCards.some(c => nextEnergy >= c.cost);
//       if (!canAffordAny) {
//         endGame(false, 'STRANDED', 'You ran out of Action Points (AP) before building full resilience.');
//       }
//     }
//   };

//   // const handleRedirectToHub = () => {
//   //   if (!navigation) return;

//   //   // Try target routings sequence
//   //   try {
//   //     // Priority 1: Simple direct name if it's placed inside a common stack
//   //     navigation.navigate('Missions');
//   //     return;
//   //   } catch (e) {
//   //     try {
//   //       // Priority 2: Alternative common screen key variation
//   //       navigation.navigate('MissionsScreen');
//   //       return;
//   //     } catch (err) {
//   //       try {
//   //         // Priority 3: Nested configuration tracking structure
//   //         navigation.navigate('MainTabs', { screen: 'Missions' });
//   //         return;
//   //       } catch (nestErr) {
//   //         // Terminal Fallback execution mechanics
//   //         if (typeof navigation.popToTop === 'function') {
//   //           navigation.popToTop();
//   //         } else if (typeof navigation.goBack === 'function') {
//   //           navigation.goBack();
//   //         }
//   //       }
//   //     }
//   //   }
//   // };

//   const handleRedirectToHub = () => {
//     // 1. Check if a standard navigation object exists
//     if (!navigation) {
//       console.warn("Navigation engine context missing.");
//       return;
//     }

//     // 2. Safe Unwind Array: Executing sequential fallback logic
//     try {
//       // Check if we can safely go back in the current stack history
//       if (navigation.canGoBack()) {
//         navigation.goBack();
//         return;
//       }
      
//       // If canGoBack fails, pop straight to the root screen container
//       if (typeof navigation.popToTop === 'function') {
//         navigation.popToTop();
//         return;
//       }

//       // Hard navigation override fallback paths if structural tracking is altered
//       navigation.navigate('Missions');
//     } catch (error) {
//       console.log("Navigation lifecycle recovery triggered: ", error);
      
//       // Final Emergency Escape: Force pop if standard routes fail
//       try {
//         navigation.pop();
//       } catch (nestedErr) {
//         console.error("All navigation paths exhausted.");
//       }
//     }
//   };

//   const renderCardItem = ({ item }) => {
//     const isUsed = usedCardIds.includes(item.id);
//     const isAffordable = energy >= item.cost;
    
//     return (
//       <View style={[styles.card, isUsed && styles.cardUsed, (!isAffordable && !isUsed) && styles.cardLocked]}>
//         <View style={styles.cardHeaderRow}>
//           <Text style={[styles.cardTag, !item.isCorrect && styles.negativeText]}>{item.tag}</Text>
//           <Text style={styles.costBadge}>{item.cost} AP</Text>
//         </View>
//         <Text style={styles.cardTitle}>{item.title}</Text>
//         <Text style={styles.cardDesc}>{item.desc}</Text>

//         <View style={styles.divider} />
        
//         <TouchableOpacity
//           style={[styles.actionBtn, (isUsed || !isAffordable || gameEnded) && styles.disabledBtn]}
//           onPress={() => handleExecuteCard(item)}
//           disabled={isUsed || !isAffordable || gameEnded}
//         >
//           <Text style={styles.actionBtnText}>
//             {isUsed ? 'DEPLOYED' : isAffordable ? 'PLAY CARD' : 'INSUFFICIENT AP'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const backgroundFlashColor = flashAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['rgba(9, 13, 22, 0)', 'rgba(239, 68, 68, 0.4)']
//   });

//   return (
//     <View style={styles.mainContainer}>
//       <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: backgroundFlashColor, pointerEvents: 'none' }]} />

//       {/* Top HUD Display */}
//       <View style={[styles.hudBanner, timeLeft <= 8 && styles.hudPanic]}>
//         <Text style={styles.hudText}>⚡ RISING FLASH FLOOD: {timeLeft}s LEFT</Text>
//       </View>

//       {/* Tactical Status Panel */}
//       <View style={styles.incidentPanel}>
//         <Text style={styles.locationTitle}>{SCENARIO.title}</Text>
//         <Text style={styles.locationSubtitle}>{SCENARIO.subtitle}</Text>

//         {/* Progress Bars */}
//         <View style={styles.metricContainer}>
//           <View style={styles.labelRow}>
//             <Text style={styles.metricLabel}>Survival Integrity (Goal: 100%)</Text>
//             <Text style={styles.metricValueText}>{hp}%</Text>
//           </View>
//           <View style={styles.barFrame}>
//             <View style={[styles.barFill, { width: `${hp}%` }]} />
//           </View>
//         </View>

//         <View style={styles.resourceRow}>
//           <Text style={styles.resourceLabel}>Energy Reserves:</Text>
//           <Text style={styles.resourceValue}>{energy} AP</Text>
//         </View>
//       </View>

//       {/* Actionable Live Feed Box */}
//       {feedback.text ? (
//         <View style={[styles.feedbackBox, feedback.isError ? styles.feedbackBoxErr : styles.feedbackBoxSuccess]}>
//           <Text style={styles.feedbackText}>{feedback.text}</Text>
//         </View>
//       ) : (
//         <View style={styles.feedbackPlaceholder}>
//           <Text style={styles.placeholderText}>Swipe horizontally. Play the right cards to reach 100%.</Text>
//         </View>
//       )}

//       {/* Horizontally Scrollable Action Deck */}
//       <FlatList
//         data={SCENARIO.cards}
//         renderItem={renderCardItem}
//         keyExtractor={(item, index) => item.id ? `${item.id}-${index}` : `card-${index}`}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         snapToInterval={width * 0.78 + 16}
//         decelerationRate="fast"
//         contentContainerStyle={styles.deckScrollArea}
//       />

//       {/* ONBOARDING TUTORIAL OVERLAY */}
//       {showTutorial && (
//         <View style={styles.tutorialShade}>
//           <View style={styles.tutorialBox}>
//             <Text style={styles.tutorialHeading}>HOW TO SURVIVE</Text>
//             <Text style={styles.tutorialStep}>1. Time is ticking down fast.</Text>
//             <Text style={styles.tutorialStep}>2. Spend AP points to deploy tactical cards from your deck hand below.</Text>
//             <Text style={styles.tutorialStep}>3. Build your Survival Integrity to 100% before you run out of time or options.</Text>
//             <Text style={styles.tutorialStep}>4. Be careful! Wrong climate decisions drain health and map directly to disaster penalties.</Text>
//             <Text style={styles.tutorialStep}>5. Manage your resources wisely to ensure long-term survival.</Text>
//             <Text style={styles.tutorialStep}>Good Luck!</Text>

//             <TouchableOpacity style={styles.startBtn} onPress={() => setShowTutorial(false)}>
//               <Text style={styles.startBtnText}>START OPERATION</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}

//       {/* END GAME WRAP OVERLAY WITH STAR SYSTEM */}
//       {gameEnded && (
//         <View style={styles.modalShade}>
//           <View style={[styles.modalBox, gameResult.status === 'VICTORY' ? styles.modalWin : styles.modalLose]}>
//             <Text style={styles.modalStatusText}>{gameResult.status}</Text>
            
//             {gameResult.status === 'VICTORY' && (
//               <View style={styles.starRow}>
//                 <Text style={styles.starText}>{gameResult.stars >= 1 ? '⭐' : '☆'}</Text>
//                 <Text style={styles.starText}>{gameResult.stars >= 2 ? '⭐' : '☆'}</Text>
//                 <Text style={styles.starText}>{gameResult.stars === 3 ? '⭐' : '☆'}</Text>
//               </View>
//             )}

//             <Text style={styles.modalTitleText}>{gameResult.title}</Text>
//             <Text style={styles.modalMsgText}>{gameResult.msg}</Text>

//             <View style={styles.xpTag}>
//               <Text style={styles.xpTagText}>+{gameResult.xp} PREP-XP REWARDED</Text>
//             </View>

//             <TouchableOpacity
//               style={styles.hubRedirectBtn}
//               onPress={handleRedirectToHub}
//             >
//               <Text style={styles.hubRedirectBtnText}>PROCEED TO MISSIONS HUB</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   mainContainer: { flex: 1, backgroundColor: '#05070c', paddingTop: 30 },
//   hudBanner: { backgroundColor: '#d97706', paddingVertical: 14, alignItems: 'center' },
//   hudPanic: { backgroundColor: '#dc2626' },
//   hudText: { color: '#ffffff', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
//   incidentPanel: { padding: 18, backgroundColor: '#0f172a', margin: 16, borderRadius: 16, borderWidth: 1, borderColor: '#1e293b' },
//   locationTitle: { color: '#ef4444', fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
//   locationSubtitle: { color: '#94a3b8', fontSize: 12, marginTop: 4, lineHeight: 16 },
//   metricContainer: { marginTop: 16 },
//   labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
//   metricLabel: { color: '#cbd5e1', fontSize: 12, fontWeight: '700' },
//   metricValueText: { color: '#10b981', fontSize: 14, fontWeight: '900' },
//   barFrame: { height: 12, backgroundColor: '#1e293b', borderRadius: 6, overflow: 'hidden' },
//   barFill: { height: '100%', backgroundColor: '#10b981' },
//   resourceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderColor: '#1e293b' },
//   resourceLabel: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
//   resourceValue: { color: '#38bdf8', fontSize: 14, fontWeight: '900' },
//   feedbackBox: { marginHorizontal: 16, padding: 12, borderRadius: 10, borderWidth: 1 },
//   feedbackBoxSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.4)' },
//   feedbackBoxErr: { backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.4)' },
//   feedbackText: { color: '#ffffff', fontSize: 12, fontWeight: '600', textAlign: 'center', lineHeight: 16 },
//   feedbackPlaceholder: { marginHorizontal: 16, padding: 12, alignItems: 'center' },
//   placeholderText: { color: '#475569', fontSize: 12, fontWeight: '600', textAlign: 'center' },
//   deckScrollArea: { paddingHorizontal: 10, paddingVertical: 10 },
//   card: { width: width * 0.78, backgroundColor: '#1e293b', borderRadius: 20, padding: 18, marginHorizontal: 8, borderWidth: 1, borderColor: '#334155', justifyContent: 'space-between', height: 260 },
//   cardUsed: { opacity: 0.3, backgroundColor: '#0f172a', borderColor: '#1e293b' },
//   cardLocked: { opacity: 0.5 },
//   cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   cardTag: { color: '#f59e0b', fontSize: 11, fontWeight: '900' },
//   costBadge: { backgroundColor: '#0f172a', color: '#38bdf8', fontSize: 11, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
//   cardTitle: { color: '#ffffff', fontSize: 17, fontWeight: '800', marginTop: 8 },
//   cardDesc: { color: '#94a3b8', fontSize: 12, marginTop: 4, lineHeight: 16 },
//   divider: { height: 1, backgroundColor: '#334155', marginVertical: 10 },
//   actionBtn: { backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
//   disabledBtn: { backgroundColor: '#475569' },
//   actionBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 12, letterSpacing: 0.5 },
//   negativeText: { color: '#ef4444' },
  
//   tutorialShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2, 6, 23, 0.96)', justifyContent: 'center', alignItems: 'center', padding: 24, zIndex: 100 },
//   tutorialBox: { width: '100%', backgroundColor: '#0f172a', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#334155' },
//   tutorialHeading: { color: '#38bdf8', fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 18, letterSpacing: 0.5 },
//   tutorialStep: { color: '#cbd5e1', fontSize: 14, marginVertical: 8, lineHeight: 22, fontWeight: '500' },
//   startBtn: { backgroundColor: '#38bdf8', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 24 },
//   startBtnText: { color: '#05070c', fontWeight: '900', fontSize: 14, letterSpacing: 0.5 },

//   modalShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2, 6, 23, 0.94)', justifyContent: 'center', alignItems: 'center', padding: 24, zIndex: 200 },
//   modalBox: { width: '100%', padding: 28, borderRadius: 24, alignItems: 'center', borderWidth: 2 },
//   modalWin: { backgroundColor: '#064e3b', borderColor: '#10b981' },
//   modalLose: { backgroundColor: '#7f1d1d', borderColor: '#ef4444' },
//   modalStatusText: { fontSize: 12, fontWeight: '900', letterSpacing: 2, color: '#ffffff', opacity: 0.5 },
//   starRow: { flexDirection: 'row', marginVertical: 10 },
//   starText: { fontSize: 28, marginHorizontal: 4, color: '#f59e0b' },
//   modalTitleText: { color: '#ffffff', fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
//   modalMsgText: { color: '#cbd5e1', fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
//   xpTag: { backgroundColor: '#f59e0b', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 30, marginBottom: 24 },
//   xpTagText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
//   hubRedirectBtn: { backgroundColor: '#ffffff', paddingVertical: 15, borderRadius: 12, width: '100%', alignItems: 'center' },
//   hubRedirectBtnText: { color: '#05070c', fontWeight: '900', fontSize: 14 }
// });

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';

/*
 * =========================================================
 * CLIMATE DEFENCE
 * =========================================================
 *
 * One game screen supports:
 *
 * Level 1  -> EASY
 * Level 4  -> MEDIUM
 * Level 7  -> HARD
 *
 * The mission is made up of multiple decisions.
 *
 * Lifecycle:
 *
 * ONBOARDING
 *     ↓
 * PLAYING
 *     ↓
 * REVIEW
 *     ↓
 * FINISHED
 *
 * Navigation from MissionsScreen:
 *
 * navigation.navigate('ClimateDefence', {
 *   level: mission.level,
 *   difficulty: mission.difficulty,
 *   reward: mission.reward,
 * });
 *
 * =========================================================
 */


/* =========================================================
   GAME STATES
   ========================================================= */

const GAME_STATES = {
  ONBOARDING: 'onboarding',
  PLAYING: 'playing',
  REVIEW: 'review',
  FINISHED: 'finished',
};


/* =========================================================
   DIFFICULTY CONFIGURATION
   ========================================================= */

const DIFFICULTY_CONFIG = {
  EASY: {
    timePerQuestion: 20,
    questionCount: 3,
    scoreMultiplier: 1,
    passScore: 180,
  },

  MEDIUM: {
    timePerQuestion: 15,
    questionCount: 4,
    scoreMultiplier: 1.25,
    passScore: 300,
  },

  HARD: {
    timePerQuestion: 10,
    questionCount: 5,
    scoreMultiplier: 1.5,
    passScore: 450,
  },
};


/* =========================================================
   QUESTION BANK
   =========================================================
 *
 * The game can select a different number of questions
 * depending on difficulty.
 *
 * Each question has:
 *
 * id
 * category
 * question
 * explanation
 * options
 *
 * The correct answer is represented by correct: true.
 *
 * These are training scenarios, not a replacement for
 * official emergency instructions.
 * ========================================================= */

const QUESTION_BANK = [

  {
    id: 'flood-warning',
    category: 'HAZARD IDENTIFICATION',

    question:
      'Heavy rainfall is causing water levels to rise rapidly near your area. What should you do first?',

    options: [
      {
        id: 'a',
        text: 'Move to a safer location and monitor official emergency information.',
        correct: true,
      },
      {
        id: 'b',
        text: 'Walk toward the flooded area to assess the water depth.',
        correct: false,
      },
      {
        id: 'c',
        text: 'Wait outside until the situation becomes more serious.',
        correct: false,
      },
      {
        id: 'd',
        text: 'Drive through the affected area before the road becomes busier.',
        correct: false,
      },
    ],

    explanation:
      'When flooding is developing, prioritize personal safety, move away from dangerous areas and follow information from official authorities.',
  },


  {
    id: 'flood-water',
    category: 'FLOOD RESPONSE',

    question:
      'Floodwater begins entering the ground floor of a building. Which response is most appropriate?',

    options: [
      {
        id: 'a',
        text: 'Move to a safer location using the recommended evacuation route.',
        correct: true,
      },
      {
        id: 'b',
        text: 'Enter the water to check whether the route is passable.',
        correct: false,
      },
      {
        id: 'c',
        text: 'Remain beside the entrance and wait for the water to stop.',
        correct: false,
      },
      {
        id: 'd',
        text: 'Move electrical equipment through the water to protect it.',
        correct: false,
      },
    ],

    explanation:
      'Floodwater can conceal hazards and create dangerous conditions. Follow evacuation instructions and avoid entering floodwater whenever possible.',
  },


  {
    id: 'evacuation',
    category: 'EVACUATION DECISION',

    question:
      'An official evacuation advisory has been issued for your area. What is the appropriate response?',

    options: [
      {
        id: 'a',
        text: 'Prepare essential belongings and follow the recommended evacuation instructions.',
        correct: true,
      },
      {
        id: 'b',
        text: 'Ignore the advisory until neighbours begin leaving.',
        correct: false,
      },
      {
        id: 'c',
        text: 'Stay behind to observe the developing situation.',
        correct: false,
      },
      {
        id: 'd',
        text: 'Choose an unfamiliar shortcut without checking whether it is safe.',
        correct: false,
      },
    ],

    explanation:
      'Official evacuation instructions should be taken seriously. Prepare essential supplies and use recommended routes or instructions.',
  },


  {
    id: 'weather-alert',
    category: 'EARLY WARNING',

    question:
      'Your emergency application displays a severe weather warning. What is the most useful immediate action?',

    options: [
      {
        id: 'a',
        text: 'Check the official warning and prepare according to the identified hazard.',
        correct: true,
      },
      {
        id: 'b',
        text: 'Disable notifications to avoid unnecessary alerts.',
        correct: false,
      },
      {
        id: 'c',
        text: 'Continue normal outdoor activities until conditions change.',
        correct: false,
      },
      {
        id: 'd',
        text: 'Share an unverified warning with everyone immediately.',
        correct: false,
      },
    ],

    explanation:
      'Early warnings are useful when they lead to appropriate preparation. Verify information through official sources before acting on or sharing it.',
  },


  {
    id: 'go-bag',
    category: 'PREPAREDNESS',

    question:
      'You have limited time before leaving home. Which item should receive priority?',

    options: [
      {
        id: 'a',
        text: 'Essential medication and other critical personal supplies.',
        correct: true,
      },
      {
        id: 'b',
        text: 'Large entertainment devices.',
        correct: false,
      },
      {
        id: 'c',
        text: 'Non-essential household decorations.',
        correct: false,
      },
      {
        id: 'd',
        text: 'Heavy items that are difficult to carry.',
        correct: false,
      },
    ],

    explanation:
      'When preparing quickly, prioritize essential personal needs, medication, communication and basic emergency supplies.',
  },


  {
    id: 'communication',
    category: 'COMMUNICATION',

    question:
      'Your family members are separated when an emergency warning is issued. What should you do?',

    options: [
      {
        id: 'a',
        text: 'Use your agreed communication and rendezvous plan.',
        correct: true,
      },
      {
        id: 'b',
        text: 'Everyone should independently choose a different location.',
        correct: false,
      },
      {
        id: 'c',
        text: 'Wait indefinitely without communicating.',
        correct: false,
      },
      {
        id: 'd',
        text: 'Travel toward the hazard to locate family members.',
        correct: false,
      },
    ],

    explanation:
      'A family emergency plan should provide agreed communication methods and meeting arrangements so that people know what to do when normal communication is disrupted.',
  },


  {
    id: 'power',
    category: 'POWER INTERRUPTION',

    question:
      'A severe weather event causes a temporary power interruption. Which preparation is most useful?',

    options: [
      {
        id: 'a',
        text: 'Keep a flashlight, charged power bank and essential communication devices available.',
        correct: true,
      },
      {
        id: 'b',
        text: 'Use candles beside combustible materials.',
        correct: false,
      },
      {
        id: 'c',
        text: 'Open electrical equipment to inspect it.',
        correct: false,
      },
      {
        id: 'd',
        text: 'Leave emergency supplies outside.',
        correct: false,
      },
    ],

    explanation:
      'Independent lighting and backup power can help maintain basic communication and visibility during a temporary power interruption.',
  },
];


/* =========================================================
   SHUFFLE
   ========================================================= */

const shuffleArray = (array) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(
      Math.random() * (i + 1)
    );

    [
      shuffled[i],
      shuffled[randomIndex],
    ] = [
      shuffled[randomIndex],
      shuffled[i],
    ];
  }

  return shuffled;
};


/* =========================================================
   SELECT QUESTIONS
   ========================================================= */

const buildQuestionSet = (difficulty) => {
  const config =
    DIFFICULTY_CONFIG[difficulty] ||
    DIFFICULTY_CONFIG.EASY;

  return shuffleArray(QUESTION_BANK)
    .slice(0, config.questionCount)
    .map((question) => ({
      ...question,
      options: shuffleArray(question.options),
    }));
};


/* =========================================================
   COMPONENT
   ========================================================= */

export default function ClimateDefenceScreen({ route }) {
  const navigation = useNavigation();

  const {
    updatePoints,
    addBadge,
  } = useUser();

  const {
    triggerConfetti,
  } = useGame();

  /*
   * -------------------------------------------------------
   * MISSION PARAMETERS
   * -------------------------------------------------------
   */

  const {
    level = 1,
    difficulty = 'EASY',
    reward = 40,
  } = route?.params || {};

  const difficultyKey =
    String(difficulty).toUpperCase();

  const difficultyConfig =
    DIFFICULTY_CONFIG[difficultyKey] ||
    DIFFICULTY_CONFIG.EASY;


  /*
   * -------------------------------------------------------
   * GAME STATE
   * -------------------------------------------------------
   */

  const [gameState, setGameState] = useState(
    GAME_STATES.ONBOARDING
  );

  const [questions, setQuestions] = useState([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [answers, setAnswers] = useState([]);

  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(
    difficultyConfig.timePerQuestion
  );

  const [missionComplete, setMissionComplete] =
    useState(false);

  /*
   * -------------------------------------------------------
   * ANIMATIONS
   * -------------------------------------------------------
   */

  const progressAnimation =
    useRef(new Animated.Value(0)).current;

  const timerAnimation =
    useRef(new Animated.Value(1)).current;


  /*
   * -------------------------------------------------------
   * CURRENT QUESTION
   * -------------------------------------------------------
   */

  const currentQuestion =
    questions[currentQuestionIndex] || null;

  const totalQuestions =
    questions.length;

  const questionNumber =
    currentQuestionIndex + 1;


  /*
   * -------------------------------------------------------
   * PROGRESS
   * -------------------------------------------------------
   */

  const questionProgress =
    totalQuestions > 0
      ? questionNumber / totalQuestions
      : 0;


  /*
   * -------------------------------------------------------
   * START MISSION
   * -------------------------------------------------------
   */

  const startMission = () => {
    const newQuestions =
      buildQuestionSet(difficultyKey);

    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setScore(0);
    setMissionComplete(false);

    setTimeLeft(
      difficultyConfig.timePerQuestion
    );

    progressAnimation.setValue(0);

    timerAnimation.setValue(1);

    setGameState(
      GAME_STATES.PLAYING
    );
  };


  /*
   * -------------------------------------------------------
   * TIMER
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (
      gameState !== GAME_STATES.PLAYING ||
      !currentQuestion
    ) {
      return undefined;
    }

    setTimeLeft(
      difficultyConfig.timePerQuestion
    );

    timerAnimation.setValue(1);

    Animated.timing(timerAnimation, {
      toValue: 0,
      duration:
        difficultyConfig.timePerQuestion * 1000,
      useNativeDriver: false,
    }).start();

    const timerId = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timerId);

          handleAnswer(null, true);

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
      timerAnimation.stopAnimation();
    };

  }, [
    gameState,
    currentQuestionIndex,
    currentQuestion,
  ]);


  /*
   * -------------------------------------------------------
   * CLEANUP WHEN LEAVING SCREEN
   * -------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      timerAnimation.stopAnimation();
      progressAnimation.stopAnimation();
    };
  }, []);


  /*
   * -------------------------------------------------------
   * ANSWER QUESTION
   * -------------------------------------------------------
   */

  const handleAnswer = (
    answer,
    timedOut = false
  ) => {
    if (
      gameState !== GAME_STATES.PLAYING ||
      !currentQuestion
    ) {
      return;
    }

    /*
     * Prevent the same question from being
     * submitted multiple times.
     */
    if (selectedAnswer !== null) {
      return;
    }

    const isCorrect =
      !timedOut &&
      answer?.correct === true;

    const basePoints = isCorrect
      ? 60
      : 0;

    const earnedPoints =
      Math.round(
        basePoints *
        difficultyConfig.scoreMultiplier
      );

    setSelectedAnswer(
      timedOut
        ? 'TIMEOUT'
        : answer?.id
    );

    setAnswers((previous) => [
      ...previous,
      {
        questionId: currentQuestion.id,
        selectedAnswer:
          answer?.id || null,
        correct: isCorrect,
        timedOut,
        points: earnedPoints,
      },
    ]);

    if (earnedPoints > 0) {
      setScore((previous) =>
        previous + earnedPoints
      );
    }

    /*
     * Briefly show the result before
     * moving to the next question.
     */
    setTimeout(() => {
      moveToNextQuestion(
        isCorrect,
        earnedPoints,
        timedOut
      );
    }, 650);
  };


  /*
   * -------------------------------------------------------
   * NEXT QUESTION
   * -------------------------------------------------------
   */

  const moveToNextQuestion = (
    isCorrect,
    earnedPoints,
    timedOut
  ) => {
    const nextIndex =
      currentQuestionIndex + 1;

    if (
      nextIndex >= questions.length
    ) {
      setGameState(
        GAME_STATES.REVIEW
      );

      return;
    }

    setCurrentQuestionIndex(
      nextIndex
    );

    setSelectedAnswer(null);

    progressAnimation.setValue(
      nextIndex / questions.length
    );
  };


  /*
   * -------------------------------------------------------
   * REVIEW DATA
   * -------------------------------------------------------
   */

  const correctAnswers = useMemo(() => {
    return answers.filter(
      (answer) => answer.correct
    ).length;
  }, [answers]);

  const finalScore = score;

  const passed =
    finalScore >=
    difficultyConfig.passScore;


  /*
   * -------------------------------------------------------
   * SUBMIT MISSION
   * -------------------------------------------------------
 */

  const submitMission = () => {
    /*
     * Update application progress.
     *
     * Your UserContext can later connect this
     * to Firebase through userService.js.
     */

    if (typeof updatePoints === 'function') {
      updatePoints(finalScore);
    }

    if (
      passed &&
      typeof addBadge === 'function'
    ) {
      addBadge(
        `climate_defence_${difficultyKey.toLowerCase()}`
      );
    }

    if (
      passed &&
      typeof triggerConfetti === 'function'
    ) {
      triggerConfetti();
    }

    setMissionComplete(true);

    setGameState(
      GAME_STATES.FINISHED
    );
  };


  /*
   * =======================================================
   * RENDER
   * =======================================================
 */

  return (
    <View style={styles.container}>

      {/* ===================================================
          HEADER
          =================================================== */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons
            name="close"
            size={24}
            color="#CBD5E1"
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>

          <Text style={styles.headerEyebrow}>
            CLIMATE DEFENCE
          </Text>

          <Text style={styles.headerTitle}>
            Level {level}
          </Text>

        </View>

        <View style={styles.difficultyBadge}>

          <Text style={styles.difficultyText}>
            {difficultyKey}
          </Text>

        </View>

      </View>


      {/* ===================================================
          ONBOARDING
          =================================================== */}

      {gameState === GAME_STATES.ONBOARDING && (

        <ScrollView
          contentContainerStyle={
            styles.onboardingContainer
          }
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.heroIcon}>

            <Ionicons
              name="shield-checkmark-outline"
              size={52}
              color="#38BDF8"
            />

          </View>

          <Text style={styles.heroTitle}>
            Climate Defence Exercise
          </Text>

          <Text style={styles.heroSubtitle}>
            Multi-stage emergency decision drill
          </Text>


          {/* Mission information */}

          <View style={styles.briefingCard}>

            <View style={styles.briefingHeader}>

              <Ionicons
                name="information-circle-outline"
                size={22}
                color="#38BDF8"
              />

              <Text style={styles.briefingTitle}>
                Mission Briefing
              </Text>

            </View>

            <Text style={styles.briefingText}>
              Respond to a series of climate and
              emergency-preparedness situations.
              Select the most appropriate action for
              each situation.
            </Text>

          </View>


          {/* Mission parameters */}

          <View style={styles.parameterGrid}>

            <View style={styles.parameterCard}>

              <Ionicons
                name="list-outline"
                size={22}
                color="#38BDF8"
              />

              <Text style={styles.parameterValue}>
                {difficultyConfig.questionCount}
              </Text>

              <Text style={styles.parameterLabel}>
                Decisions
              </Text>

            </View>


            <View style={styles.parameterCard}>

              <Ionicons
                name="timer-outline"
                size={22}
                color="#F59E0B"
              />

              <Text style={styles.parameterValue}>
                {difficultyConfig.timePerQuestion}s
              </Text>

              <Text style={styles.parameterLabel}>
                Per Decision
              </Text>

            </View>


            <View style={styles.parameterCard}>

              <Ionicons
                name="trophy-outline"
                size={22}
                color="#A855F7"
              />

              <Text style={styles.parameterValue}>
                {reward}
              </Text>

              <Text style={styles.parameterLabel}>
                Mission Reward
              </Text>

            </View>

          </View>


          {/* Objective */}

          <View style={styles.objectiveCard}>

            <Text style={styles.objectiveTitle}>
              OBJECTIVE
            </Text>

            <Text style={styles.objectiveText}>
              Demonstrate appropriate emergency
              decision-making across the complete
              scenario.
            </Text>

          </View>


          <TouchableOpacity
            style={styles.primaryButton}
            onPress={startMission}
            activeOpacity={0.85}
          >

            <Text style={styles.primaryButtonText}>
              Begin Mission
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
            />

          </TouchableOpacity>

        </ScrollView>
      )}


      {/* ===================================================
          PLAYING
          =================================================== */}

      {gameState === GAME_STATES.PLAYING &&
        currentQuestion && (

        <ScrollView
          contentContainerStyle={
            styles.playContainer
          }
          showsVerticalScrollIndicator={false}
        >

          {/* Progress */}

          <View style={styles.progressHeader}>

            <View>

              <Text style={styles.progressLabel}>
                DECISION {questionNumber} OF {totalQuestions}
              </Text>

              <Text style={styles.categoryText}>
                {currentQuestion.category}
              </Text>

            </View>

            <View style={styles.scoreBox}>

              <Ionicons
                name="flash-outline"
                size={14}
                color="#F59E0B"
              />

              <Text style={styles.scoreText}>
                {score}
              </Text>

            </View>

          </View>


          <View style={styles.progressTrack}>

            <Animated.View
              style={[
                styles.progressFill,
                {
                  width:
                    `${questionProgress * 100}%`,
                },
              ]}
            />

          </View>


          {/* Timer */}

          <View style={styles.timerContainer}>

            <View style={styles.timerHeader}>

              <Text style={styles.timerLabel}>
                RESPONSE WINDOW
              </Text>

              <Text
                style={[
                  styles.timerValue,
                  timeLeft <= 5 &&
                    styles.timerCritical,
                ]}
              >
                {timeLeft}s
              </Text>

            </View>

            <View style={styles.timerTrack}>

              <Animated.View
                style={[
                  styles.timerFill,
                  {
                    width:
                      timerAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          '0%',
                          '100%',
                        ],
                      }),
                  },
                  timeLeft <= 5 &&
                    styles.timerFillCritical,
                ]}
              />

            </View>

          </View>


          {/* Scenario */}

          <View style={styles.scenarioCard}>

            <View style={styles.scenarioIcon}>

              <Ionicons
                name="warning-outline"
                size={26}
                color="#F59E0B"
              />

            </View>

            <View style={styles.scenarioText}>

              <Text style={styles.scenarioLabel}>
                EMERGENCY DECISION
              </Text>

              <Text style={styles.questionText}>
                {currentQuestion.question}
              </Text>

            </View>

          </View>


          {/* Answer options */}

          <Text style={styles.selectLabel}>
            SELECT RESPONSE
          </Text>

          <View style={styles.answersContainer}>

            {currentQuestion.options.map(
              (option, index) => {

                const selected =
                  selectedAnswer === option.id;

                const showCorrect =
                  selectedAnswer !== null &&
                  option.correct;

                const showIncorrect =
                  selected &&
                  !option.correct;

                return (

                  <TouchableOpacity
                    key={option.id}
                    activeOpacity={0.85}
                    disabled={
                      selectedAnswer !== null
                    }
                    onPress={() =>
                      handleAnswer(option)
                    }
                    style={[
                      styles.answerCard,

                      selected &&
                        styles.answerSelected,

                      showCorrect &&
                        styles.answerCorrect,

                      showIncorrect &&
                        styles.answerIncorrect,
                    ]}
                  >

                    <View
                      style={[
                        styles.answerNumber,
                        showCorrect &&
                          styles.answerNumberCorrect,
                        showIncorrect &&
                          styles.answerNumberIncorrect,
                      ]}
                    >

                      <Text
                        style={
                          styles.answerNumberText
                        }
                      >
                        {String.fromCharCode(
                          65 + index
                        )}
                      </Text>

                    </View>

                    <Text
                      style={[
                        styles.answerText,
                        selected &&
                          styles.answerTextSelected,
                      ]}
                    >
                      {option.text}
                    </Text>

                    {showCorrect && (

                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color="#34D399"
                      />

                    )}

                    {showIncorrect && (

                      <Ionicons
                        name="close-circle"
                        size={22}
                        color="#F87171"
                      />

                    )}

                  </TouchableOpacity>

                );
              }
            )}

          </View>


          {/* Timeout indicator */}

          {selectedAnswer === 'TIMEOUT' && (

            <View style={styles.timeoutCard}>

              <Ionicons
                name="time-outline"
                size={20}
                color="#F59E0B"
              />

              <Text style={styles.timeoutText}>
                Response window expired. Review
                the recommended action in the
                debriefing.
              </Text>

            </View>

          )}

        </ScrollView>
      )}


      {/* ===================================================
          REVIEW
          =================================================== */}

      {gameState === GAME_STATES.REVIEW && (

        <ScrollView
          contentContainerStyle={
            styles.reviewContainer
          }
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.reviewHero}>

            <Ionicons
              name="school-outline"
              size={48}
              color="#38BDF8"
            />

            <Text style={styles.reviewTitle}>
              Mission Debrief
            </Text>

            <Text style={styles.reviewSubtitle}>
              Review each decision before recording
              your mission result.
            </Text>

          </View>


          {/* Score */}

          <View style={styles.reviewScoreCard}>

            <Text style={styles.reviewScoreLabel}>
              DECISION ACCURACY
            </Text>

            <Text style={styles.reviewScore}>
              {correctAnswers} / {totalQuestions}
            </Text>

            <Text style={styles.reviewPoints}>
              {finalScore} PrepPoints
            </Text>

          </View>


          {/* Walkthrough */}

          <Text style={styles.walkthroughHeading}>
            STEP-BY-STEP WALKTHROUGH
          </Text>

          <View style={styles.timeline}>

            {questions.map(
              (question, index) => {

                const answer =
                  answers.find(
                    (item) =>
                      item.questionId ===
                      question.id
                  );

                const correct =
                  answer?.correct === true;

                const timedOut =
                  answer?.timedOut === true;

                const correctOption =
                  question.options.find(
                    (option) =>
                      option.correct
                  );

                return (

                  <View
                    key={question.id}
                    style={styles.timelineItem}
                  >

                    <View
                      style={[
                        styles.timelineMarker,
                        correct
                          ? styles.timelineMarkerSuccess
                          : styles.timelineMarkerFailure,
                      ]}
                    >

                      <Text
                        style={
                          styles.timelineMarkerText
                        }
                      >
                        {index + 1}
                      </Text>

                    </View>


                    <View
                      style={styles.timelineContent}
                    >

                      <View
                        style={
                          styles.timelineHeader
                        }
                      >

                        <Text
                          style={
                            styles.timelineCategory
                          }
                        >
                          {question.category}
                        </Text>

                        {correct ? (

                          <Text
                            style={
                              styles.correctStatus
                            }
                          >
                            CORRECT
                          </Text>

                        ) : timedOut ? (

                          <Text
                            style={
                              styles.timeoutStatus
                            }
                          >
                            TIMEOUT
                          </Text>

                        ) : (

                          <Text
                            style={
                              styles.incorrectStatus
                            }
                          >
                            REVIEW
                          </Text>

                        )}

                      </View>


                      <Text
                        style={
                          styles.timelineQuestion
                        }
                      >
                        {question.question}
                      </Text>


                      <View
                        style={
                          styles.recommendedBox
                        }
                      >

                        <Text
                          style={
                            styles.recommendedLabel
                          }
                        >
                          RECOMMENDED RESPONSE
                        </Text>

                        <Text
                          style={
                            styles.recommendedText
                          }
                        >
                          {correctOption?.text}
                        </Text>

                      </View>


                      <Text
                        style={styles.explanationText}
                      >
                        {question.explanation}
                      </Text>

                    </View>

                  </View>

                );
              }
            )}

          </View>


          <TouchableOpacity
            style={styles.primaryButton}
            onPress={submitMission}
            activeOpacity={0.85}
          >

            <Text style={styles.primaryButtonText}>
              Record Mission Result
            </Text>

            <Ionicons
              name="checkmark"
              size={18}
              color="#FFFFFF"
            />

          </TouchableOpacity>

        </ScrollView>
      )}


      {/* ===================================================
          FINISHED
          =================================================== */}

      {gameState === GAME_STATES.FINISHED && (

        <View style={styles.finishedContainer}>

          <View
            style={[
              styles.resultIcon,
              passed
                ? styles.resultIconSuccess
                : styles.resultIconReview,
            ]}
          >

            <Ionicons
              name={
                passed
                  ? 'checkmark'
                  : 'refresh-outline'
              }
              size={48}
              color={
                passed
                  ? '#34D399'
                  : '#F59E0B'
              }
            />

          </View>


          <Text style={styles.resultTitle}>

            {passed
              ? 'Mission Completed'
              : 'Mission Recorded'}

          </Text>


          <Text style={styles.resultSubtitle}>

            {passed
              ? 'You demonstrated appropriate decision-making across the climate defence exercise.'
              : 'Review the debriefing guidance and repeat the exercise to improve your preparedness.'}

          </Text>


          <View style={styles.finalStats}>

            <View style={styles.finalStat}>

              <Text style={styles.finalStatValue}>
                {finalScore}
              </Text>

              <Text style={styles.finalStatLabel}>
                PrepPoints
              </Text>

            </View>


            <View style={styles.finalStatDivider} />


            <View style={styles.finalStat}>

              <Text style={styles.finalStatValue}>
                {correctAnswers}/{totalQuestions}
              </Text>

              <Text style={styles.finalStatLabel}>
                Decisions
              </Text>

            </View>


            <View style={styles.finalStatDivider} />


            <View style={styles.finalStat}>

              <Text style={styles.finalStatValue}>
                {difficultyKey}
              </Text>

              <Text style={styles.finalStatLabel}>
                Difficulty
              </Text>

            </View>

          </View>


          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >

            <Text style={styles.primaryButtonText}>
              Return to Missions
            </Text>

            <Ionicons
              name="arrow-back"
              size={18}
              color="#FFFFFF"
            />

          </TouchableOpacity>

        </View>
      )}

    </View>
  );
}


/* =========================================================
   STYLES
   ========================================================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 16,
  },


  /* -------------------------------------------------------
     HEADER
     ------------------------------------------------------- */

  header: {
    marginTop: 42,
    marginBottom: 14,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  headerEyebrow: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 2,
  },

  difficultyBadge: {
    minWidth: 58,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#172554',
    borderWidth: 1,
    borderColor: '#2563EB',
    alignItems: 'center',
  },

  difficultyText: {
    color: '#60A5FA',
    fontSize: 9,
    fontWeight: '900',
  },


  /* -------------------------------------------------------
     ONBOARDING
     ------------------------------------------------------- */

  onboardingContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 40,
  },

  heroIcon: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#082F49',
    borderWidth: 1,
    borderColor: '#0369A1',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 18,
  },

  heroTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    textAlign: 'center',
  },

  heroSubtitle: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 22,
  },

  briefingCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 18,
    padding: 17,
    marginBottom: 14,
  },

  briefingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  briefingTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  briefingText: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 20,
  },

  parameterGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  parameterCard: {
    width: '31.5%',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
  },

  parameterValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 7,
  },

  parameterLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 3,
    textAlign: 'center',
  },

  objectiveCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 15,
    padding: 15,
    marginBottom: 18,
  },

  objectiveTitle: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 6,
  },

  objectiveText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 19,
  },


  /* -------------------------------------------------------
     BUTTONS
     ------------------------------------------------------- */

  primaryButton: {
    minHeight: 52,
    backgroundColor: '#2563EB',
    borderRadius: 13,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },


  /* -------------------------------------------------------
     PLAY
     ------------------------------------------------------- */

  playContainer: {
    paddingBottom: 40,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  progressLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  categoryText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },

  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  scoreText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '900',
  },

  progressTrack: {
    height: 5,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 3,
  },


  /* -------------------------------------------------------
     TIMER
     ------------------------------------------------------- */

  timerContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 13,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },

  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },

  timerLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  timerValue: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '900',
  },

  timerCritical: {
    color: '#F87171',
  },

  timerTrack: {
    height: 5,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },

  timerFill: {
    height: '100%',
    backgroundColor: '#34D399',
  },

  timerFillCritical: {
    backgroundColor: '#EF4444',
  },


  /* -------------------------------------------------------
     SCENARIO
     ------------------------------------------------------- */

  scenarioCard: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },

  scenarioIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#451A03',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  scenarioText: {
    flex: 1,
  },

  scenarioLabel: {
    color: '#F59E0B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 5,
  },

  questionText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '800',
  },

  selectLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 9,
  },


  /* -------------------------------------------------------
     ANSWERS
     ------------------------------------------------------- */

  answersContainer: {
    gap: 10,
  },

  answerCard: {
    minHeight: 68,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  answerSelected: {
    borderColor: '#38BDF8',
    backgroundColor: '#082F49',
  },

  answerCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#052E2B',
  },

  answerIncorrect: {
    borderColor: '#EF4444',
    backgroundColor: '#450A0A',
  },

  answerNumber: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  answerNumberCorrect: {
    backgroundColor: '#047857',
  },

  answerNumberIncorrect: {
    backgroundColor: '#991B1B',
  },

  answerNumberText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '900',
  },

  answerText: {
    flex: 1,
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
  },

  answerTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  timeoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#451A03',
    borderWidth: 1,
    borderColor: '#92400E',
    borderRadius: 13,
    padding: 12,
    marginTop: 14,
    gap: 9,
  },

  timeoutText: {
    flex: 1,
    color: '#FDE68A',
    fontSize: 11,
    lineHeight: 17,
  },


  /* -------------------------------------------------------
     REVIEW
     ------------------------------------------------------- */

  reviewContainer: {
    paddingBottom: 40,
  },

  reviewHero: {
    alignItems: 'center',
    paddingVertical: 12,
  },

  reviewTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 10,
  },

  reviewSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 5,
  },

  reviewScoreCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginVertical: 18,
  },

  reviewScoreLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  reviewScore: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    marginTop: 5,
  },

  reviewPoints: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 3,
  },

  walkthroughHeading: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 12,
  },

  timeline: {
    marginBottom: 14,
  },

  timelineItem: {
    flexDirection: 'row',
    marginBottom: 14,
  },

  timelineMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  timelineMarkerSuccess: {
    backgroundColor: '#047857',
  },

  timelineMarkerFailure: {
    backgroundColor: '#991B1B',
  },

  timelineMarkerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  timelineContent: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 15,
    padding: 13,
  },

  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  timelineCategory: {
    color: '#64748B',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  correctStatus: {
    color: '#34D399',
    fontSize: 8,
    fontWeight: '900',
  },

  incorrectStatus: {
    color: '#F87171',
    fontSize: 8,
    fontWeight: '900',
  },

  timeoutStatus: {
    color: '#FBBF24',
    fontSize: 8,
    fontWeight: '900',
  },

  timelineQuestion: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    marginBottom: 10,
  },

  recommendedBox: {
    backgroundColor: '#052E2B',
    borderWidth: 1,
    borderColor: '#065F46',
    borderRadius: 10,
    padding: 10,
    marginBottom: 9,
  },

  recommendedLabel: {
    color: '#34D399',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
    marginBottom: 4,
  },

  recommendedText: {
    color: '#D1FAE5',
    fontSize: 11,
    lineHeight: 16,
  },

  explanationText: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 17,
  },


  /* -------------------------------------------------------
     FINISHED
     ------------------------------------------------------- */

  finishedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },

  resultIcon: {
    width: 92,
    height: 92,
    borderRadius: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  resultIconSuccess: {
    backgroundColor: '#064E3B',
    borderWidth: 1,
    borderColor: '#059669',
  },

  resultIconReview: {
    backgroundColor: '#451A03',
    borderWidth: 1,
    borderColor: '#92400E',
  },

  resultTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    textAlign: 'center',
  },

  resultSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },

  finalStats: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 17,
    paddingVertical: 17,
    marginBottom: 18,
  },

  finalStat: {
    flex: 1,
    alignItems: 'center',
  },

  finalStatValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  finalStatLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
  },

  finalStatDivider: {
    width: 1,
    backgroundColor: '#1E293B',
  },

});
