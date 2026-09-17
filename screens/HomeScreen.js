//HERE IS THE CODE THAT WORKS FROM 1600 TO 3436.

//React Hooks
//The useState function stores changing values.
//The useEffect function runs code when the component mounts or updates.
//The useMemo function memorises values to avoid unnecessary recalculations.
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image, Alert, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon';
import { requestNotificationPermission, scheduleReadinessReminder, sendMissionCompletedNotification } from '../services/Notifications';
import { useUser } from '../contexts/UserContext';
import { useAlerts } from '../contexts/AlertContext';
import * as Haptics from 'expo-haptics';
// ===================================================================
// WEEKLY MISSION DATABASE
// -------------------------------------------------------------------
// Each day has one emergency preparedness scenario.
//
// Every mission contains:
// • title
// • description
// • XP reward
// • image
// • emergency scenario
// • multiple choice answers
//
// The current mission is automatically selected based on the day
// of the week using new Date().getDay().
// ===================================================================
const WEEKLY_MISSIONS = [
  { 
    id: 'sun_heat', 
    day: 'Sunday', 
    title: 'Severe Heatwave Protocol', 
    desc: 'Temperature spikes past 38°C in concrete blocks. Mitigate urban heat stress.', 
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600&auto=format&fit=crop', 
    pts: 50, 
    accent: '#F59E0B',
    scenario: 'A severe heatwave alert is issued. Your indoor temperature is rising rapidly. What is your immediate tactical action?',
    options: [
      { text: 'Keep all windows tightly sealed and shut curtains', correct: false, feedback: 'Incorrect! Sealing trap heat inside. You need cross-ventilation.' },
      { text: 'Draw thermal curtains, open windows for cross-breeze, and hydrate', correct: true, feedback: 'Correct! Blocking direct solar radiation while promoting airflow prevents heat exhaustion.' },
      { text: 'Turn off all ceiling fans to conserve emergency energy', correct: false, feedback: 'Incorrect! Fans assist evaporative cooling on human skin.' }
    ]
  },
  { 
    id: 'mon_flood', 
    day: 'Monday', 
    title: 'Monsoon Flash Flood Routing', 
    desc: 'Torrential downpours trigger sudden water level rises near low-lying canals.', 
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=600&auto=format&fit=crop', 
    pts: 60, 
    accent: '#38BDF8',
    scenario: 'You are driving near a low-lying underpass as rapid flash floods begin submerging the road. What do you do?',
    options: [
      { text: 'Drive through quickly before water gets higher', correct: false, feedback: 'Dangerous! Just 30cm of moving water can sweep away a vehicle.' },
      { text: 'Abandon vehicle immediately and seek high-ground terrain on foot', correct: true, feedback: 'Correct! Never risk driving through flooded underpasses. Move to elevated ground.' },
      { text: 'Wait inside the locked car and sleep until help arrives', correct: false, feedback: 'Risky! Water levels can rise swiftly and trap you inside.' }
    ]
  },
  { 
    id: 'tue_haze', 
    day: 'Tuesday', 
    title: 'Transboundary Haze Defense', 
    desc: 'PSI levels surge into unhealthy brackets due to regional smoke plumes.', 
    image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=600&auto=format&fit=crop', 
    pts: 55, 
    accent: '#64748B',
    scenario: 'The PSI hits 250 (Very Unhealthy). You need to step outside briefly. What respiratory defense is required?',
    options: [
      { text: 'Wear a standard surgical paper mask', correct: false, feedback: 'Incorrect. Surgical masks do not filter fine PM2.5 micro-particles.' },
      { text: 'Wear a fitted N95 respirator mask and minimize outdoor exertion', correct: true, feedback: 'Correct! N95 respirators create a tight seal blocking harmful micro-pollutants.' },
      { text: 'Cover your mouth with a damp cotton cloth', correct: false, feedback: 'Incorrect. Damp cloth offers virtually no protection against toxic haze smoke.' }
    ]
  },
  { 
    id: 'wed_water', 
    day: 'Wednesday', 
    title: 'PUB Water Disruption Prep', 
    desc: 'Localized pipeline disruption reported. Secure emergency hydration buffers.', 
    image: 'https://images.unsplash.com/photo-1548858850-811fa15722ab?q=80&w=600&auto=format&fit=crop', 
    pts: 45, 
    accent: '#0EA5E9',
    scenario: 'A sudden municipal water supply cut is announced for your block. How much emergency water storage should an adult maintain per day?',
    options: [
      { text: '0.5 Liters per day for drinking only', correct: false, feedback: 'Incorrect. That is dangerously low for sanitation and hydration needs.' },
      { text: 'At least 3 Liters per day for drinking, hygiene, and basic sanitation', correct: true, feedback: 'Correct! SCDF guidelines recommend minimum baseline buffer capacities per person.' },
      { text: '20 Liters per day for filling bathtubs', correct: false, feedback: 'Inefficient and unnecessary for short-term municipal disruptions.' }
    ]
  },
  { 
    id: 'thu_supply', 
    day: 'Thursday', 
    title: 'SCDF Go-Bag Compliance', 
    desc: 'Audit essential life-support equipment inside emergency deployable storage.', 
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop', 
    pts: 50, 
    accent: '#10B981',
    scenario: 'When packing your emergency Go-Bag for sudden evacuation, which electronic gear is essential?',
    options: [
      { text: 'High-end gaming laptop and heavy console chargers', correct: false, feedback: 'Incorrect. Too heavy and irrelevant for survival situations.' },
      { text: 'Power bank, hand-crank emergency radio, and waterproof flashlight', correct: true, feedback: 'Correct! Reliable communication and lighting are vital during grid outages.' },
      { text: 'An electric portable fan requiring wall sockets', correct: false, feedback: 'Incorrect. Wall outlets will likely be dead during a blackout.' }
    ]
  },
  { 
    id: 'fri_comm', 
    day: 'Friday', 
    title: 'SGSecure Mesh Comms Drill', 
    desc: 'Establish alternative offline contact protocols during cellular network disruptions.', 
    image: 'https://images.unsplash.com/photo-1516216556741-d981a54f6f85?q=80&w=600&auto=format&fit=crop', 
    pts: 65, 
    accent: '#8B5CF6',
    scenario: 'Cellular networks experience complete downtime during a crisis. How should your family sync up?',
    options: [
      { text: 'Keep calling cellular numbers repeatedly until lines clear', correct: false, feedback: 'Incorrect. This jams local cell towers and drains your battery.' },
      { text: 'Pre-agree on an offline physical rendezvous point and use SMS/mesh apps', correct: true, feedback: 'Correct! Pre-determined emergency meetup points guarantee family reunion.' },
      { text: 'Wait indefinitely inside separate shopping malls', correct: false, feedback: 'Incorrect. Leaving communication to chance causes dangerous panic.' }
    ]
  },
  { 
    id: 'sat_blackout', 
    day: 'Saturday', 
    title: 'Grid-Down Power Contingency', 
    desc: 'Manage auxiliary battery assets during island-wide grid failures.', 
    image: 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?q=80&w=600&auto=format&fit=crop', 
    pts: 60, 
    accent: '#EC4899',
    scenario: 'An island-wide blackout plunges your apartment into darkness. What is your priority power conservation move?',
    options: [
      { text: 'Leave all room lights switched on so you notice when power returns', correct: false, feedback: 'Incorrect. This creates power surges when the main grid reconnects.' },
      { text: 'Unplug sensitive electronics and use low-draw LED lighting/flashlights', correct: true, feedback: 'Correct! Protecting appliances from power surges and conserving battery life is critical.' },
      { text: 'Light indoor scented candles next to curtains', correct: false, feedback: 'Dangerous! Open flames in unmonitored rooms lead to structural fires.' }
    ]
  }
];

//AsyncStorage key is used to save leaderboard information
//persistently across app sessions. The XP_PER_LEVEL defines 
//the experience points required to level up.
const STORAGE_KEY = '@prepwise_leaderboard_data';
//Every level requires 1000 XP to progress to the next level.
const XP_PER_LEVEL = 1000;

export default function HomeScreen({ navigation }) {
  const { user, updateUser } = useUser();
  const { alerts } = useAlerts(); 
  
  const currentDayIndex = new Date().getDay();
  const activeMission = WEEKLY_MISSIONS[currentDayIndex];
  
  const [liveLeaderboard, setLiveLeaderboard] = useState([]);
  const [nextRankGap, setNextRankGap] = useState({ pointsNeeded: 0, targetRank: '' });

  // Mission Simulation Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  
  // Confetti Control
  const [showConfetti, setShowConfetti] = useState(false);

  // Fallback defaults represent a genuine zero baseline for new registrations
  const currentUserName = user?.name || 'New Responder';
  const currentUserPoints = user?.points || 0;
  const currentUserStreak = user?.streak || 0;
  const currentLevel = user?.level || 1;
  const currentXpProgress = currentUserPoints % XP_PER_LEVEL;
  const progressPercent = XP_PER_LEVEL > 0 ? (currentXpProgress / XP_PER_LEVEL) * 100 : 0;
  const currentCoins = user?.prepCoins ?? 0;
  const lastLoginDate = user?.lastLoginDate || null;
  console.log("HEADER COINS:", currentCoins);

  const completedMissions = user?.completedMissions || {};
  const missionCompleted = completedMissions[activeMission.id];
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // ─── STREAK & DAILY CHECK-IN ENGINE ───
  useEffect(() => {
    checkDailyStreakAndLoginRewards();
  }, []);

  const checkDailyStreakAndLoginRewards = async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (lastLoginDate === todayStr) return; // Already logged in today

    let updatedStreak = currentUserStreak;

    if (lastLoginDate) {
      const lastDate = new Date(lastLoginDate);
      const currentDate = new Date(todayStr);
      const diffTime = Math.abs(currentDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        updatedStreak += 1; // Consecutive day login
      } else if (diffDays > 1) {
        updatedStreak = 1; // Missed a day, streak resets
      }
    } else {
      updatedStreak = 1; // First login
    }

    // Award Daily Check-in Bonus (+10 Coins & +20 XP)
    const bonusCoins = 10;
    const bonusXP = 20;

    if (updateUser) {
      updateUser({
        ...user,
        streak: updatedStreak,
        lastLoginDate: todayStr,
        prepCoins: currentCoins + bonusCoins,
        points: currentUserPoints + bonusXP
      });
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "☀️ Daily Check-in Claimed!",
      `Welcome back! You extended your streak to ${updatedStreak} Days!\n\nRewards: +${bonusCoins} PrepCoins & +${bonusXP} XP.`
    );
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setSimulationResult(option);
    if (option.correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };
  // Handle Mission Completion & XP Reward with Confetti
  const handleCompleteMission = async () => {
    console.log("1. handleCompleteMisssion() called. Simulation Result:", simulationResult);
    if (!simulationResult?.correct) return;
    console.log("2. Mission is correct. Proceeding to update user state and send notification.");

    const awardedPts = activeMission.pts;
    const awardedCoins = 25; // Fixed coin reward for mission completion
    const newPoints = currentUserPoints + awardedPts;
    const newStreak = currentUserStreak === 0 ? 1 : currentUserStreak;
    const newCoins = currentCoins + awardedCoins;
    console.log("3. Before updateUser: newPoints:", newPoints, "newStreak:", newStreak, "newCoins:", newCoins);
    if (missionCompleted) {
      Alert.alert(
          "Mission Complete",
          "You've already completed today's weekly mission."
      );
      return;
    }

    if (updateUser) {
      updateUser({
        ...user,
        points: newPoints,
        streak: newStreak,
        prepCoins: newCoins,
        completedMissions: { ...completedMissions, [activeMission.id]: true }
      });
    }
    console.log("4. After updateUser: User state updated successfully. Sending mission completion notification.");

    //Trigger Confetti Celebration!
    // setShowConfetti(true);
    // setTimeout(() => setShowConfetti(false), 3500);
    setModalVisible(false);
    setTimeout(() => {
        setShowConfetti(true);

        setTimeout(() => {
            setShowConfetti(false);
        }, 3500);
    }, 300);

    console.log("5. Confetti triggered for mission completion.");
    Alert.alert(
      "🎉 Mission Completed!",
      `You successfully mastered the ${activeMission.title} protocol and earned +${awardedPts} XP🪙 +${awardedCoins} PrepCoins!
      Your total PrepCoins balance is now: ${currentCoins + awardedCoins}!`,
      [{ text: "Awesome!", onPress: () => setModalVisible(false) }]
    );
    await sendMissionCompletedNotification(
      activeMission.title,
      awardedPts,
      awardedCoins
    );
    console.log("6. Mission completion notification sent successfully.");

  };

  // ─── INTERACTIVE FAMILY SYNC HANDLER ────────────────────────
  // Toggles family safety check-in status between "Safe" and "Awaiting Sync"
  const handleToggleFamilySync = () => {
    const currentStatus = user?.familyEmergencyPlanRegistered || false;
    const updatedStatus = !currentStatus;

    if (updateUser) {
      updateUser({ ...user, familyEmergencyPlanRegistered: updatedStatus });
    }

    Alert.alert(
      "SGSecure Family Node",
      updatedStatus 
        ? "Status updated: Household marked as SAFE for current climate alert." 
        : "Status updated: Awaiting member response check-in.",
      [{ text: "OK" }]
    );
  };

  // ─── DYNAMIC PRODUCTION COMPLETION CALCULATIONS ──────────────────────
  // These compute structural properties out of context parameters rather than mock arrays
  const toolCompletionData = useMemo(() => {
    console.log("USER DATA:", user);
    console.log("ACTIVE MISSION:", activeMission);

    // 1. Quiz Completion calculation logic (Assumes user.completedQuizzes array matches standard list length)
    const totalAvailableQuizzes = 10; 
    const completedQuizzesCount = user?.completedQuizzes?.length || 0;
    const quizProgress = Math.min(completedQuizzesCount / totalAvailableQuizzes, 1);

    // 2. Go Bag System Auditing (Tracks baseline items filled in user's profile state checklist)
    const criticalGoBagItemsCount = user?.goBagItems?.length || 0;
    const targetGoBagItemsTotal = 8; // standard checklist requirement count
    const goBagProgress = Math.min(criticalGoBagItemsCount / targetGoBagItemsTotal, 1);

    // 3. Family Safety Sync Status
    const familyMembersCount = user?.familyMembers?.length || 0;
    const hasEmergencyRendezvous = user?.familyEmergencyPlanRegistered ? 1 : 0;
    const familyProgress = familyMembersCount > 0 ? (hasEmergencyRendezvous ? 1.0 : 0.5) : 0;

    // 4. Health QR Code / Profile Registry Matrix Check
    const hasBloodType = user?.healthData?.bloodType ? 1 : 0;
    const hasAllergiesLogged = user?.healthData?.allergies ? 1 : 0;
    const hasQrGenerated = user?.healthData?.qrCodeGenerated ? 1 : 0;
    const healthProgress = (hasBloodType + hasAllergiesLogged + hasQrGenerated) / 3;

    return [
      { id: 'QuizGame', title: 'Quiz Mastery', progress: quizProgress, icon: 'school-outline', color: '#6366F1' },
      { id: 'GoBag', title: 'Go Bag Deployment', progress: goBagProgress, icon: 'bag-outline', color: '#10B981' },
      { id: 'FamilySafety', title: 'Family Sync Link', progress: familyProgress, icon: 'people-outline', color: '#F59E0B' },
      { id: 'HealthQR', title: 'Health ID Matrix', progress: healthProgress, icon: 'medical-outline', color: '#EF4444' },
    ];
  }, [user]);

  // Sync leaderboard matrix with zero baseline storage rules
  const syncLeaderboardRegistry = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      // Fallback arrays do not seed unless historic records exist, tracking only real production database nodes
      let workingRegistry = storedData ? JSON.parse(storedData) : [];

      const targetIndex = workingRegistry.findIndex(item => item.name === currentUserName);
      if (targetIndex !== -1) {
        workingRegistry[targetIndex].points = currentUserPoints;
        workingRegistry[targetIndex].streak = currentUserStreak;
      } else {
        workingRegistry.push({
          id: user?.id || 'user_production_node',
          name: currentUserName,
          points: currentUserPoints,
          streak: currentUserStreak
        });
      }

      workingRegistry.sort((a, b) => b.points - a.points);
      setLiveLeaderboard(workingRegistry.slice(0, 5));

      // Calculate gaps against high-level ranks dynamically
      const absoluteUserRank = workingRegistry.findIndex(item => item.name === currentUserName);
      if (absoluteUserRank > 0) {
        const structuralLeaderAbove = workingRegistry[absoluteUserRank - 1];
        setNextRankGap({
          pointsNeeded: (structuralLeaderAbove.points - currentUserPoints) + 1,
          targetRank: `#${absoluteUserRank}`
        });
      } else {
        setNextRankGap({ pointsNeeded: 0, targetRank: 'TOP' });
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workingRegistry));
    } catch (error) {
      console.error("Leaderboard engine registration sync failure:", error);
    }
  };

  useEffect(() => {
    syncLeaderboardRegistry();
  }, [currentUserPoints, currentUserName, currentUserStreak]);

  const activeAlertCount = alerts?.length || 0;
  const highSeverityAlert = alerts?.some(alert => alert.severity?.toUpperCase() === 'HIGH');
  const checkMilestoneLit = (daysRequired) => currentUserStreak >= daysRequired;

  return (
    <View style={styles.masterContainer}>
      {/* {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: Dimensions.get("window").width / 2, y: 0 }}
          fadeOut
          explosionSpeed={400}
          fallSpeed={3000}
          autoStart
        />
      )} */}
      {showConfetti && (
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          elevation: 9999,
        }}
      >
        <ConfettiCannon
          count={220}
          origin={{
            x: Dimensions.get("window").width / 2,
            y: 0,
          }}
          fadeOut
        />
      </View>
      )}


      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* HEADER BRANDING DISPLAY */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brandTitle}>PrepWise</Text>
            <Text style={styles.metaLabel}>OPERATIONAL NODE: {currentUserName}</Text>
          </View>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>LVL {currentLevel}</Text>
          </View>
          <View style={styles.coinBadge}>
            <Ionicons
                name="logo-bitcoin"
                size={16}
                color="#FACC15"
            />
            <Text style={styles.coinText}>
                {currentCoins}
            </Text>
        </View>

        </View>

        {/* PROFILE XP ENGINE PERFORMANCE TRACK */}
        <View style={styles.levelCard}>
          <View style={styles.levelSplitHeader}>
            <Text style={styles.progressDataText}>Next Level Progression</Text>
            <Text style={styles.xpTextIndicator}>{currentXpProgress} / {XP_PER_LEVEL} XP</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.levelSubtext}>
            Score <Text style={{ fontWeight: '700', color: '#38BDF8' }}>{XP_PER_LEVEL - currentXpProgress} more XP</Text> to hit Level {currentLevel + 1}
          </Text>
        </View>

        {/* EMERGENCY INCIDENT INTERFACE LINK */}
        {activeAlertCount > 0 && (
          <TouchableOpacity 
            style={[styles.alertsShortcutCard, highSeverityAlert && { borderColor: '#EF4444', backgroundColor: '#1A0B0B' }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Alerts')}
          >
            <View style={styles.shortcutLeftCell}>
              <View style={[styles.iconFrame, { backgroundColor: highSeverityAlert ? '#451A1A' : '#1E1B4B' }]}>
                <Ionicons name={highSeverityAlert ? "alert-circle" : "shield-half"} size={22} color={highSeverityAlert ? "#EF4444" : "#818CF8"} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.shortcutMainTitle}>{activeAlertCount} Active Threat Broadcasts</Text>
                <Text style={styles.shortcutSubtext}>Latest: {alerts[0]?.title || 'Environmental Hazard Logged'}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#475569" />
          </TouchableOpacity>
        )}

        {/* MILESTONE EXPANSION MATRIX */}
        <Text style={styles.globalSectionHeader}>Streak Milestone Emblems</Text>
        <View style={styles.milestoneRowContainer}>
          {[
            { days: 1, label: '1 Day' },
            { days: 3, label: '3 Days' },
            { days: 5, label: '5 Days' },
            { days: 7, label: 'Weekly' }
          ].map((milestone) => {
            const isLit = checkMilestoneLit(milestone.days);
            return (
              <View key={milestone.days} style={[styles.milestoneBadgeCell, isLit && styles.milestoneBadgeLit]}>
                <Ionicons 
                  name={isLit ? "flame" : "flame-outline"} 
                  size={24} 
                  color={isLit ? "#F59E0B" : "#334155"} 
                />
                <Text style={[styles.milestoneLabel, isLit && styles.milestoneLabelLit]}>{milestone.label}</Text>
                {isLit && <View style={styles.litDotGlow} />}
              </View>
            );
          })}
        </View>

        {/* STRUCTURAL PROGRESSION TOOL GRID SETUP */}
        <Text style={styles.globalSectionHeader}>Deployment Readiness Trackers</Text>
        <View style={styles.toolGridSetup}>
          {toolCompletionData.map((tool) => {
            console.log("USER DATA:", user);
            console.log("ACTIVE MISSION:", activeMission);

            const displayPercentage = Math.round(tool.progress * 100) || 0;
            const isFullyComplete = displayPercentage === 100;
            return (
              <TouchableOpacity 
                key={tool.id} 
                style={styles.toolGridCell}
                onPress={() => navigation.navigate(tool.id)}
              >
                <View style={styles.cellRowHeader}>
                  <Ionicons name={tool.icon} size={22} color={tool.color} />
                  <Text style={[styles.completionPercentageBadge, isFullyComplete && { color: '#10B981' }]}>
                    {displayPercentage}%
                  </Text>
                </View>
                <Text style={styles.toolCellTitle}>{tool.title}</Text>
                <View style={styles.miniProgressTrack}>
                  <View style={[styles.miniProgressFill, { width: `${displayPercentage}%`, backgroundColor: tool.color }]} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* INTERACTIVE DAILY MISSION CARD */}
        <Text style={styles.globalSectionHeader}>Active Climate Drill ({activeMission.day})</Text>
        <TouchableOpacity 
          style={[styles.premiumDailyCard, { borderColor: activeMission.accent + '30' }]}
          activeOpacity={0.9}
          onPress={() => {
            setSelectedOption(null);
            setSimulationResult(null);
            setModalVisible(true);
          }}
        >
          <View style={styles.imageWrapper}>
            <Image source={{ uri: activeMission.image }} style={styles.scenarioImage} resizeMode="cover" />
            <View style={styles.imageOverlay} />
            <View style={[styles.pointsIndicatorFloating, { backgroundColor: activeMission.accent }]}>
              <Text style={styles.floatingPointsText}>+{activeMission.pts} XP</Text>
              <Text style={styles.coinReward}>🪙 +25</Text>
            </View>
          </View>
          <Text style={styles.mainMissionTitle}>{activeMission.title}</Text>
          <Text style={styles.mainMissionDesc}>{activeMission.desc}</Text>
          {missionCompleted && (
            <Text style={{color:'#10B981'}}>
              ✅ Mission completed - review mode
            </Text>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="flash" size={16} color="#38BDF8" />
            <Text style={{ color: '#38BDF8', fontSize: 12, fontWeight: '700' }}>Tap to Take Tactical Decision Drill</Text>
          </View>
        </TouchableOpacity>

        {/* DYNAMIC LEADERBOARD TERMINAL CONTAINER */}
        <View style={styles.sectionHeaderRowInline}>
          <Text style={styles.globalSectionHeaderInline}>Regional Leaderboard</Text>
          {nextRankGap.pointsNeeded > 0 && (
            <Text style={styles.dynamicRankGapText}>
              Need <Text style={{ color: '#FACC15' }}>+{nextRankGap.pointsNeeded} XP</Text> to pass {nextRankGap.targetRank}
            </Text>
          )}
        </View>

        <View style={styles.leaderboardContainerBox}>
          {liveLeaderboard.length === 0 ? (
            <Text style={styles.emptyLeaderboardText}>Awaiting system configuration metrics...</Text>
          ) : (
            liveLeaderboard.map((player, index) => {
              const isSelf = player.name === currentUserName;
              const rank = index + 1;
              return (
                <View key={`${player.id || player.name}-${index}`} style={[styles.leaderboardRowItem, isSelf && styles.highlightedSelfRow]}>
                  <View style={styles.leaderboardLeftBlock}>
                    <Text style={[styles.rankText, rank === 1 && { color: '#FACC15' }]}>#{rank}</Text>
                    <View style={styles.identityMeta}>
                      <Text style={[styles.playerProfileName, isSelf && { color: '#10B981', fontWeight: '900' }]}>
                        {player.name} {isSelf && '(You)'}
                      </Text>
                      <Text style={styles.playerSubTelemetry}>{player.streak || 0} Day Continuous Active Streak</Text>
                    </View>
                  </View>
                  <Text style={[styles.playerXpMetrics, isSelf && { color: '#10B981' }]}>{player.points || 0} XP</Text>
                </View>
              );
            })
          )}
        </View>
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>

            <View style={styles.modalBox}>

              <Text style={styles.modalTitle}>
                {activeMission.title}
              </Text>
              <Text style={styles.modalScenario}>
                {activeMission.scenario}
              </Text>
              {activeMission.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedOption === option && {
                      borderColor: option.correct ? '#10B981' : '#EF4444'
                    }
                  ]}
                  onPress={() => handleSelectOption(option)}
                >
                  <Text style={styles.optionText}>
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
              {simulationResult && (
                <Text style={{
                  color: simulationResult.correct
                    ? '#10B981'
                    : '#EF4444',
                  marginTop:20
                }}>
                  {simulationResult.feedback}
                </Text>
              )}
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleCompleteMission}
              >
                <Text style={{color:'white'}}>
                  Complete Mission
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: 
  { 
    flex: 1, 
    backgroundColor: '#020617' 
    },
  container: 
  { 
    flex: 1, 
    paddingHorizontal: 16 
    },
  topBar: 
  { 
    paddingTop: 50, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
    },
  brandTitle: 
  { 
    color: '#FFFFFF', 
    fontSize: 28, 
    fontWeight: '900', 
    letterSpacing: -0.5 
    },
  metaLabel: 
  { 
    color: '#475569', 
    fontSize: 9, 
    fontWeight: '800', 
    letterSpacing: 1 
    },
  badgePill: 
  { 
    backgroundColor: '#1E1B4B', 
    borderWidth: 1, 
    borderColor: '#4338CA', 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 10 
    },
  badgePillText: 
  { 
    color: '#818CF8', 
    fontSize: 12, 
    fontWeight: '900' 
    },
  
  levelCard: 
  { 
    backgroundColor: '#0F172A', 
    padding: 18, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#1E293B', 
    marginBottom: 12 
    },
  levelSplitHeader: 
  { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8 
    },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
    minWidth: 55,
  },

  coinText: {
    color: '#FACC15',
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 5,
  },

  progressDataText: 
  { 
    color: '#94A3B8', 
    fontSize: 12, 
    fontWeight: '700' 
    },
  xpTextIndicator: 
  { 
    color: '#FFFFFF', 
    fontSize: 13, 
    fontWeight: '800' 
},
  progressBarTrack: 
  { 
    height: 10, 
    backgroundColor: '#1E293B', 
    borderRadius: 5, 
    overflow: 'hidden', 
    marginBottom: 8 
    },
  progressBarFill: 
  { 
    height: '100%', 
    backgroundColor: '#38BDF8', 
    borderRadius: 5 
    },
  levelSubtext: 
  { 
    color: '#64748B', 
    fontSize: 11 
    },

  globalSectionHeader: 
  { 
    color: '#475569', 
    fontSize: 11, 
    fontWeight: '800', 
    letterSpacing: 1.2, 
    marginBottom: 10, 
    marginTop: 18 
    },
  sectionHeaderRowInline: 
  { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 18, 
    marginBottom: 10 
    },
  globalSectionHeaderInline: 
  { 
    color: '#475569', 
    fontSize: 11, 
    fontWeight: '800', 
    letterSpacing: 1.2 
    },
  dynamicRankGapText: 
  { 
    color: '#94A3B8', 
    fontSize: 11, 
    fontWeight: '600' 
    },

  alertsShortcutCard: 
  { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#0F172A', 
    borderWidth: 1, 
    borderColor: '#1E293B', 
    borderRadius: 16, 
    padding: 14, 
    marginTop: 6 
  },
  shortcutLeftCell: 
  { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    flex: 1 
  },
  iconFrame: 
  { 
    width: 40, 
    height: 40, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  shortcutMainTitle: 
  { 
    color: '#FFFFFF', 
    fontSize: 13, 
    fontWeight: '700' 
    },
  shortcutSubtext: 
  { 
    color: '#64748B', 
    fontSize: 11, 
    marginTop: 1 
    },

  milestoneRowContainer: 
  { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 10 
    },
  milestoneBadgeCell: 
  { 
    flex: 1, 
    backgroundColor: '#0F172A', 
    borderWidth: 1, 
    borderColor: '#1E293B', 
    borderRadius: 16, 
    paddingVertical: 14, 
    alignItems: 'center', 
    position: 'relative' 
    },
  milestoneBadgeLit: 
  { 
    borderColor: '#F59E0B20', 
    backgroundColor: '#1E150B' 
    },
  milestoneLabel: 
  { 
    color: '#475569', 
    fontSize: 10, 
    fontWeight: '700', 
    marginTop: 6 
    },
  milestoneLabelLit: 
  { 
    color: '#F59E0B' 
    },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalBox: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },

  modalTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 12,
  },

  modalScenario: {
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },

  optionButton: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#334155',
  },

  optionText: {
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 20,
  },

  completeButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  
  litDotGlow: 
  { 
    position: 'absolute', 
    top: 6, 
    right: 6, 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: '#10B981' 
    },

  toolGridSetup: 
  { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12 
    },
  toolGridCell: 
  { 
    backgroundColor: '#0F172A', 
    width: '48%', 
    padding: 16, 
    borderRadius: 18, 
    borderWidth: 1, 
    borderColor: '#1E293B' 
    },
  cellRowHeader: 
  { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
    },
  completionPercentageBadge: 
  { 
    color: '#94A3B8', 
    fontSize: 12, 
    fontWeight: '800' 
    },
  toolCellTitle: 
  { 
    color: '#FFFFFF', 
    fontSize: 13, 
    fontWeight: '700', 
    marginBottom: 8 
    },
  miniProgressTrack: 
  { 
    height: 4, 
    backgroundColor: '#1E293B', 
    borderRadius: 2, 
    overflow: 'hidden' 
    },
  miniProgressFill: 
  { 
    height: '100%', 
    borderRadius: 2 
    },

  premiumDailyCard: 
  { 
    backgroundColor: '#0F172A', 
    borderWidth: 1, 
    borderRadius: 20, 
    padding: 16, 
    overflow: 'hidden' 
    },
  imageWrapper: 
  { 
    height: 110, 
    marginHorizontal: -16, 
    marginTop: -16, 
    marginBottom: 14, 
    overflow: 'hidden', 
    position: 'relative' 
    },
  scenarioImage: 
  { 
    width: '100%', 
    height: '100%' 
    },
  imageOverlay: 
  { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(2, 6, 23, 0.3)' 
    },
  pointsIndicatorFloating: 
  { 
    position: 'absolute', 
    top: 12, 
    right: 12, 
    paddingVertical: 4, 
    paddingHorizontal: 8, 
    borderRadius: 6 
    },
  floatingPointsText: 
  { 
    color: '#FFFFFF', 
    fontSize: 11, 
    fontWeight: '900' 
    },
  mainMissionTitle: 
  { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '800', 
    marginBottom: 4 
    },
  mainMissionDesc: 
  { 
    color: '#94A3B8', 
    fontSize: 12, 
    marginBottom: 12, 
    lineHeight: 16 
    },

  leaderboardContainerBox: 
  { 
    backgroundColor: '#0F172A', 
    borderWidth: 1, 
    borderColor: '#1E293B', 
    borderRadius: 16, 
    paddingHorizontal: 14, 
    paddingVertical: 4, 
    overflow: 'hidden' 
    },
  leaderboardRowItem: 
  { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 12, 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#1E293B' 
    },
  highlightedSelfRow: 
  { 
    backgroundColor: 'rgba(16, 185, 129, 0.05)', 
    marginHorizontal: -14, 
    paddingHorizontal: 14 
    },
  leaderboardLeftBlock: 
  { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, flex: 1 
    },
  rankText: 
  { 
    fontSize: 14, 
    fontWeight: '900', 
    color: '#64748B', 
    width: 28 
    },
  identityMeta: 
  { 
    flex: 1 
},
  playerProfileName: 
  { 
    color: '#E2E8F0', 
    fontSize: 13, 
    fontWeight: '600' 
    },
  playerSubTelemetry: 
  { 
    color: '#475569', 
    fontSize: 10, 
    marginTop: 1 
    },
  playerXpMetrics: 
  { 
    color: '#38BDF8', 
    fontSize: 13, 
    fontWeight: '800' 
    },
  emptyLeaderboardText: 
  { 
    color: '#64748B', 
    fontSize: 13, 
    textAlign: 'center', 
    paddingVertical: 20 
    }
});


/**
 * Yes. The easiest approach is **keep your old UI** (the one with the readiness trackers, milestones, leaderboard, alerts, etc.) and **merge in the new functionality** (daily check-in, PrepCoins, confetti, haptics, game modal, mission modal). You don't need to rewrite the whole screen.

The reason your **percentages never move** is because your progress is calculated from arrays in the user object that are probably never being updated.

For example, in your old code you have:

```js
const completedQuizzesCount = user?.completedQuizzes?.length || 0;
const quizProgress = Math.min(completedQuizzesCount / totalAvailableQuizzes, 1);

const criticalGoBagItemsCount = user?.goBagItems?.length || 0;
const goBagProgress = Math.min(criticalGoBagItemsCount / targetGoBagItemsTotal, 1);

const familyMembersCount = user?.familyMembers?.length || 0;
const hasEmergencyRendezvous = user?.familyEmergencyPlanRegistered ? 1 : 0;

const hasBloodType = user?.healthData?.bloodType ? 1 : 0;
```

If those values never change, the percentages will stay at **0% forever**.

---

# 1. Use the old tracker section

Keep this exactly:

```jsx
<Text style={styles.globalSectionHeader}>
  Deployment Readiness Trackers
</Text>

<View style={styles.toolGridSetup}>
  {toolCompletionData.map((tool) => {
    const displayPercentage = Math.round(tool.progress * 100);

    return (
      <TouchableOpacity
        key={tool.id}
        style={styles.toolGridCell}
        onPress={() => navigation.navigate(tool.id)}
      >
        <View style={styles.cellRowHeader}>
          <Ionicons
            name={tool.icon}
            size={22}
            color={tool.color}
          />

          <Text style={styles.completionPercentageBadge}>
            {displayPercentage}%
          </Text>
        </View>

        <Text style={styles.toolCellTitle}>
          {tool.title}
        </Text>

        <View style={styles.miniProgressTrack}>
          <View
            style={[
              styles.miniProgressFill,
              {
                width: `${displayPercentage}%`,
                backgroundColor: tool.color,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  })}
</View>
```

That UI is fine.

---

# 2. Replace your old `toolCompletionData`

Instead of using arrays that never update, calculate from your actual app data.

Example:

```js
const toolCompletionData = useMemo(() => {

    const quizProgress =
        Math.min((user?.completedQuizzes?.length || 0) / 10, 1);

    const goBagProgress =
        Math.min((user?.goBagItems?.length || 0) / 8, 1);

    const familyProgress =
        user?.familyEmergencyPlanRegistered ? 1 : 0;

    const healthFields = [
        user?.healthData?.bloodType,
        user?.healthData?.allergies,
        user?.healthData?.medicalConditions,
        user?.healthData?.emergencyContact,
    ];

    const healthProgress =
        healthFields.filter(Boolean).length / healthFields.length;

    return [
        {
            id: "QuizGame",
            title: "Quiz Mastery",
            progress: quizProgress,
            icon: "school-outline",
            color: "#6366F1",
        },
        {
            id: "GoBag",
            title: "Go Bag",
            progress: goBagProgress,
            icon: "bag-outline",
            color: "#10B981",
        },
        {
            id: "FamilySafety",
            title: "Family Sync",
            progress: familyProgress,
            icon: "people-outline",
            color: "#F59E0B",
        },
        {
            id: "HealthQR",
            title: "Health ID",
            progress: healthProgress,
            icon: "medical-outline",
            color: "#EF4444",
        },
    ];

}, [user]);
```

---

# 3. Actually update the user

This is the part that's probably missing.

If the user completes a quiz:

```js
updateUser({
    ...user,
    completedQuizzes: [
        ...(user.completedQuizzes || []),
        quizId
    ]
});
```

If they pack a Go Bag item:

```js
updateUser({
    ...user,
    goBagItems: [
        ...(user.goBagItems || []),
        itemName
    ]
});
```

If they create a family plan:

```js
updateUser({
    ...user,
    familyEmergencyPlanRegistered: true
});
```

If they complete their health profile:

```js
updateUser({
    ...user,
    healthData: {
        ...user.healthData,
        bloodType,
        allergies,
        emergencyContact,
        medicalConditions
    }
});
```

Then your `useMemo` recalculates automatically.

---

# 4. If you want a true overall percentage

Instead of each tracker only showing its own percentage, you can average them:

```js
const overallProgress = useMemo(() => {

    const values = toolCompletionData.map(t => t.progress);

    return Math.round(
        (values.reduce((a, b) => a + b, 0) / values.length) * 100
    );

}, [toolCompletionData]);
```

Then display:

```jsx
<Text style={styles.overallText}>
    Deployment Readiness {overallProgress}%
</Text>
```

---

# 5. Keep your new functionality

You can keep everything you've added:

* ✅ Daily login streak
* ✅ PrepCoins
* ✅ Confetti
* ✅ Haptics
* ✅ Flood Runner mini-game
* ✅ Mission modal
* ✅ Reward claiming

Those don't conflict with the old layout.

---

## What I'd recommend

I would use:

* **Old layout** (it's much richer):

  * XP bar
  * Alert card
  * Streak milestones
  * Deployment Readiness trackers
  * Daily Mission
  * Leaderboard

plus

* **New features**:

  * Daily check-in rewards
  * PrepCoins
  * Confetti
  * Haptics
  * Flood Runner game
  * Mission completion modal

This gives you the more polished dashboard while keeping all of the gameplay mechanics you've already built.

One thing to check is your `UserContext`: if `updateUser` doesn't persist changes to `AsyncStorage` (or your chosen storage), the progress bars will appear to reset or never advance even though `toolCompletionData` is calculated correctly.

 */


// /**
//  * import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   TouchableOpacity, 
//   ScrollView, 
//   StatusBar, 
//   Image, 
//   Modal, 
//   Alert 
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ConfettiCannon from 'react-native-confetti-cannon';
// import { useUser } from '../contexts/UserContext';
// import { useAlerts } from '../contexts/AlertContext';

// const WEEKLY_MISSIONS = [
//   { 
//     id: 'sun_heat', 
//     day: 'Sunday', 
//     title: 'Severe Heatwave Protocol', 
//     desc: 'Temperature spikes past 38°C in concrete blocks. Mitigate urban heat stress.', 
//     image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600&auto=format&fit=crop', 
//     pts: 50, 
//     accent: '#F59E0B',
//     scenario: 'A severe heatwave alert is issued. Your indoor temperature is rising rapidly. What is your immediate tactical action?',
//     options: [
//       { text: 'Keep all windows tightly sealed and shut curtains', correct: false, feedback: 'Incorrect! Sealing traps heat inside. You need cross-ventilation.' },
//       { text: 'Draw thermal curtains, open windows for cross-breeze, and hydrate', correct: true, feedback: 'Correct! Blocking direct solar radiation while promoting airflow prevents heat exhaustion.' },
//       { text: 'Turn off all ceiling fans to conserve emergency energy', correct: false, feedback: 'Incorrect! Fans assist evaporative cooling on human skin.' }
//     ]
//   },
//   { 
//     id: 'mon_flood', 
//     day: 'Monday', 
//     title: 'Monsoon Flash Flood Routing', 
//     desc: 'Torrential downpours trigger sudden water level rises near low-lying canals.', 
//     image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=600&auto=format&fit=crop', 
//     pts: 60, 
//     accent: '#38BDF8',
//     scenario: 'You are driving near a low-lying underpass as rapid flash floods begin submerging the road. What do you do?',
//     options: [
//       { text: 'Drive through quickly before water gets higher', correct: false, feedback: 'Dangerous! Just 30cm of moving water can sweep away a vehicle.' },
//       { text: 'Abandon vehicle immediately and seek high-ground terrain on foot', correct: true, feedback: 'Correct! Never risk driving through flooded underpasses. Move to elevated ground.' },
//       { text: 'Wait inside the locked car and sleep until help arrives', correct: false, feedback: 'Risky! Water levels can rise swiftly and trap you inside.' }
//     ]
//   },
//   { 
//     id: 'tue_haze', 
//     day: 'Tuesday', 
//     title: 'Transboundary Haze Defense', 
//     desc: 'PSI levels surge into unhealthy brackets due to regional smoke plumes.', 
//     image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=600&auto=format&fit=crop', 
//     pts: 55, 
//     accent: '#64748B',
//     scenario: 'The PSI hits 250 (Very Unhealthy). You need to step outside briefly. What respiratory defense is required?',
//     options: [
//       { text: 'Wear a standard surgical paper mask', correct: false, feedback: 'Incorrect. Surgical masks do not filter fine PM2.5 micro-particles.' },
//       { text: 'Wear a fitted N95 respirator mask and minimize outdoor exertion', correct: true, feedback: 'Correct! N95 respirators create a tight seal blocking harmful micro-pollutants.' },
//       { text: 'Cover your mouth with a damp cotton cloth', correct: false, feedback: 'Incorrect. Damp cloth offers virtually no protection against toxic haze smoke.' }
//     ]
//   },
//   { 
//     id: 'wed_water', 
//     day: 'Wednesday', 
//     title: 'PUB Water Disruption Prep', 
//     desc: 'Localized pipeline disruption reported. Secure emergency hydration buffers.', 
//     image: 'https://images.unsplash.com/photo-1548858850-811fa15722ab?q=80&w=600&auto=format&fit=crop', 
//     pts: 45, 
//     accent: '#0EA5E9',
//     scenario: 'A sudden municipal water supply cut is announced for your block. How much emergency water storage should an adult maintain per day?',
//     options: [
//       { text: '0.5 Liters per day for drinking only', correct: false, feedback: 'Incorrect. That is dangerously low for sanitation and hydration needs.' },
//       { text: 'At least 3 Liters per day for drinking, hygiene, and basic sanitation', correct: true, feedback: 'Correct! SCDF guidelines recommend minimum baseline buffer capacities per person.' },
//       { text: '20 Liters per day for filling bathtubs', correct: false, feedback: 'Inefficient and unnecessary for short-term municipal disruptions.' }
//     ]
//   },
//   { 
//     id: 'thu_supply', 
//     day: 'Thursday', 
//     title: 'SCDF Go-Bag Compliance', 
//     desc: 'Audit essential life-support equipment inside emergency deployable storage.', 
//     image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop', 
//     pts: 50, 
//     accent: '#10B981',
//     scenario: 'When packing your emergency Go-Bag for sudden evacuation, which electronic gear is essential?',
//     options: [
//       { text: 'High-end gaming laptop and heavy console chargers', correct: false, feedback: 'Incorrect. Too heavy and irrelevant for survival situations.' },
//       { text: 'Power bank, hand-crank emergency radio, and waterproof flashlight', correct: true, feedback: 'Correct! Reliable communication and lighting are vital during grid outages.' },
//       { text: 'An electric portable fan requiring wall sockets', correct: false, feedback: 'Incorrect. Wall outlets will likely be dead during a blackout.' }
//     ]
//   },
//   { 
//     id: 'fri_comm', 
//     day: 'Friday', 
//     title: 'SGSecure Mesh Comms Drill', 
//     desc: 'Establish alternative offline contact protocols during cellular network disruptions.', 
//     image: 'https://images.unsplash.com/photo-1516216556741-d981a54f6f85?q=80&w=600&auto=format&fit=crop', 
//     pts: 65, 
//     accent: '#8B5CF6',
//     scenario: 'Cellular networks experience complete downtime during a crisis. How should your family sync up?',
//     options: [
//       { text: 'Keep calling cellular numbers repeatedly until lines clear', correct: false, feedback: 'Incorrect. This jams local cell towers and drains your battery.' },
//       { text: 'Pre-agree on an offline physical rendezvous point and use SMS/mesh apps', correct: true, feedback: 'Correct! Pre-determined emergency meetup points guarantee family reunion.' },
//       { text: 'Wait indefinitely inside separate shopping malls', correct: false, feedback: 'Incorrect. Leaving communication to chance causes dangerous panic.' }
//     ]
//   },
//   { 
//     id: 'sat_blackout', 
//     day: 'Saturday', 
//     title: 'Grid-Down Power Contingency', 
//     desc: 'Manage auxiliary battery assets during island-wide grid failures.', 
//     image: 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?q=80&w=600&auto=format&fit=crop', 
//     pts: 60, 
//     accent: '#EC4899',
//     scenario: 'An island-wide blackout plunges your apartment into darkness. What is your priority power conservation move?',
//     options: [
//       { text: 'Leave all room lights switched on so you notice when power returns', correct: false, feedback: 'Incorrect. This creates power surges when the main grid reconnects.' },
//       { text: 'Unplug sensitive electronics and use low-draw LED lighting/flashlights', correct: true, feedback: 'Correct! Protecting appliances from power surges and conserving battery life is critical.' },
//       { text: 'Light indoor scented candles next to curtains', correct: false, feedback: 'Dangerous! Open flames in unmonitored rooms lead to structural fires.' }
//     ]
//   }
// ];

// const STORAGE_KEY = '@prepwise_leaderboard_data';
// const XP_PER_LEVEL = 1000;

// export default function HomeScreen({ navigation }) {
//   const { user, updateUser } = useUser();
//   const { alerts } = useAlerts(); 
  
//   const currentDayIndex = new Date().getDay();
//   const activeMission = WEEKLY_MISSIONS[currentDayIndex];
  
//   const [liveLeaderboard, setLiveLeaderboard] = useState([]);
//   const [nextRankGap, setNextRankGap] = useState({ pointsNeeded: 0, targetRank: '' });

//   // Mission Simulation Modal State
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [simulationResult, setSimulationResult] = useState(null);
  
//   // Confetti Control
//   const [showConfetti, setShowConfetti] = useState(false);

//   const currentUserName = user?.name || 'New Responder';
//   const currentUserPoints = user?.points || 0;
//   const currentUserStreak = user?.streak || 0;
//   const currentLevel = user?.level || Math.floor(currentUserPoints / XP_PER_LEVEL) + 1;
//   const currentXpProgress = currentUserPoints % XP_PER_LEVEL;
//   const progressPercent = XP_PER_LEVEL > 0 ? (currentXpProgress / XP_PER_LEVEL) * 100 : 0;

//   // Handle Mission Completion & XP Reward with Confetti
//   const handleCompleteMission = useCallback(() => {
//     if (!simulationResult?.correct) return;

//     const awardedPts = activeMission.pts;
//     const newPoints = currentUserPoints + awardedPts;
//     const newStreak = currentUserStreak === 0 ? 1 : currentUserStreak;

//     if (updateUser) {
//       updateUser({
//         ...user,
//         points: newPoints,
//         streak: newStreak
//       });
//     }

//     setShowConfetti(true);
//     setTimeout(() => setShowConfetti(false), 3500);

//     Alert.alert(
//       "🎉 Mission Completed!",
//       `You successfully mastered the ${activeMission.title} protocol and earned +${awardedPts} XP!`,
//       [{ text: "Awesome!", onPress: () => setModalVisible(false) }]
//     );
//   }, [simulationResult, activeMission, currentUserPoints, currentUserStreak, user, updateUser]);

//   const toolCompletionData = useMemo(() => {
//     const totalAvailableQuizzes = 10; 
//     const completedQuizzesCount = user?.completedQuizzes?.length || 0;
//     const quizProgress = Math.min(completedQuizzesCount / totalAvailableQuizzes, 1);

//     const criticalGoBagItemsCount = user?.goBagItems?.length || 0;
//     const targetGoBagItemsTotal = 8; 
//     const goBagProgress = Math.min(criticalGoBagItemsCount / targetGoBagItemsTotal, 1);

//     const familyMembersCount = user?.familyMembers?.length || 0;
//     const hasEmergencyRendezvous = user?.familyEmergencyPlanRegistered ? 1 : 0;
//     const familyProgress = familyMembersCount > 0 ? (hasEmergencyRendezvous ? 1.0 : 0.5) : 0;

//     const hasBloodType = user?.healthData?.bloodType ? 1 : 0;
//     const hasAllergiesLogged = user?.healthData?.allergies ? 1 : 0;
//     const hasQrGenerated = user?.healthData?.qrCodeGenerated ? 1 : 0;
//     const healthProgress = (hasBloodType + hasAllergiesLogged + hasQrGenerated) / 3;

//     return [
//       { id: 'QuizGame', title: 'Quiz Mastery', progress: quizProgress, icon: 'school-outline', color: '#6366F1' },
//       { id: 'GoBag', title: 'Go Bag Deployment', progress: goBagProgress, icon: 'bag-outline', color: '#10B981' },
//       { id: 'FamilySafety', title: 'Family Sync Link', progress: familyProgress, icon: 'people-outline', color: '#F59E0B' },
//       { id: 'HealthQR', title: 'Health ID Matrix', progress: healthProgress, icon: 'medical-outline', color: '#EF4444' },
//     ];
//   }, [user]);

//   useEffect(() => {
//     let isMounted = true;

//     const syncLeaderboardRegistry = async () => {
//       try {
//         const storedData = await AsyncStorage.getItem(STORAGE_KEY);
//         let workingRegistry = storedData ? JSON.parse(storedData) : [];

//         const targetIndex = workingRegistry.findIndex(item => item.name === currentUserName);
//         if (targetIndex !== -1) {
//           workingRegistry[targetIndex].points = currentUserPoints;
//           workingRegistry[targetIndex].streak = currentUserStreak;
//         } else {
//           workingRegistry.push({
//             id: user?.id || 'user_production_node',
//             name: currentUserName,
//             points: currentUserPoints,
//             streak: currentUserStreak
//           });
//         }

//         workingRegistry.sort((a, b) => b.points - a.points);
        
//         if (!isMounted) return;

//         setLiveLeaderboard(workingRegistry.slice(0, 5));

//         const absoluteUserRank = workingRegistry.findIndex(item => item.name === currentUserName);
//         if (absoluteUserRank > 0) {
//           const structuralLeaderAbove = workingRegistry[absoluteUserRank - 1];
//           setNextRankGap({
//             pointsNeeded: (structuralLeaderAbove.points - currentUserPoints) + 1,
//             targetRank: `#${absoluteUserRank}`
//           });
//         } else {
//           setNextRankGap({ pointsNeeded: 0, targetRank: 'TOP' });
//         }

//         await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workingRegistry));
//       } catch (error) {
//         console.error("Leaderboard engine registration sync failure:", error);
//       }
//     };

//     syncLeaderboardRegistry();

//     return () => {
//       isMounted = false;
//     };
//   }, [currentUserPoints, currentUserName, currentUserStreak, user?.id]);

//   const activeAlertCount = alerts?.length || 0;
//   const highSeverityAlert = alerts?.some(alert => alert.severity?.toUpperCase() === 'HIGH');
//   const checkMilestoneLit = (daysRequired) => currentUserStreak >= daysRequired;

//   return (
//     <View style={styles.masterContainer}>
//       <StatusBar barStyle="light-content" backgroundColor="#020617" />
      
//       <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
//         {/* HEADER BRANDING DISPLAY */}
//         <View style={styles.topBar}>
//           <View>
//             <Text style={styles.brandTitle}>PrepWise</Text>
//             <Text style={styles.metaLabel}>OPERATIONAL NODE: {currentUserName}</Text>
//           </View>
//           <View style={styles.badgePill}>
//             <Text style={styles.badgePillText}>LVL {currentLevel}</Text>
//           </View>
//         </View>

//         {/* PROFILE XP ENGINE PERFORMANCE TRACK */}
//         <View style={styles.levelCard}>
//           <View style={styles.levelSplitHeader}>
//             <Text style={styles.progressDataText}>Next Level Progression</Text>
//             <Text style={styles.xpTextIndicator}>{currentXpProgress} / {XP_PER_LEVEL} XP</Text>
//           </View>
//           <View style={styles.progressBarTrack}>
//             <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
//           </View>
//           <Text style={styles.levelSubtext}>
//             Score <Text style={{ fontWeight: '700', color: '#38BDF8' }}>{XP_PER_LEVEL - currentXpProgress} more XP</Text> to hit Level {currentLevel + 1}
//           </Text>
//         </View>

//         {/* EMERGENCY INCIDENT INTERFACE LINK */}
//         {activeAlertCount > 0 && (
//           <TouchableOpacity 
//             style={[styles.alertsShortcutCard, highSeverityAlert && { borderColor: '#EF4444', backgroundColor: '#1A0B0B' }]}
//             activeOpacity={0.85}
//             onPress={() => navigation.navigate('Alerts')}
//           >
//             <View style={styles.shortcutLeftCell}>
//               <View style={[styles.iconFrame, { backgroundColor: highSeverityAlert ? '#451A1A' : '#1E1B4B' }]}>
//                 <Ionicons name={highSeverityAlert ? "alert-circle" : "shield-half"} size={22} color={highSeverityAlert ? "#EF4444" : "#818CF8"} />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.shortcutMainTitle}>{activeAlertCount} Active Threat Broadcasts</Text>
//                 <Text style={styles.shortcutSubtext}>Latest: {alerts[0]?.title || 'Environmental Hazard Logged'}</Text>
//               </View>
//             </View>
//             <Ionicons name="chevron-forward" size={16} color="#475569" />
//           </TouchableOpacity>
//         )}

//         {/* MILESTONE EXPANSION MATRIX */}
//         <Text style={styles.globalSectionHeader}>Streak Milestone Emblems</Text>
//         <View style={styles.milestoneRowContainer}>
//           {[
//             { days: 1, label: '1 Day' },
//             { days: 3, label: '3 Days' },
//             { days: 5, label: '5 Days' },
//             { days: 7, label: 'Weekly' }
//           ].map((milestone) => {
//             const isLit = checkMilestoneLit(milestone.days);
//             return (
//               <View key={milestone.days} style={[styles.milestoneBadgeCell, isLit && styles.milestoneBadgeLit]}>
//                 <Ionicons 
//                   name={isLit ? "flame" : "flame-outline"} 
//                   size={24} 
//                   color={isLit ? "#F59E0B" : "#334155"} 
//                 />
//                 <Text style={[styles.milestoneLabel, isLit && styles.milestoneLabelLit]}>{milestone.label}</Text>
//                 {isLit && <View style={styles.litDotGlow} />}
//               </View>
//             );
//           })}
//         </View>

//         {/* STRUCTURAL PROGRESSION TOOL GRID SETUP */}
//         <Text style={styles.globalSectionHeader}>Deployment Readiness Trackers</Text>
//         <View style={styles.toolGridSetup}>
//           {toolCompletionData.map((tool) => {
//             const displayPercentage = Math.round(tool.progress * 100) || 0;
//             const isFullyComplete = displayPercentage === 100;
//             return (
//               <TouchableOpacity 
//                 key={tool.id} 
//                 style={styles.toolGridCell}
//                 onPress={() => navigation.navigate(tool.id)}
//               >
//                 <View style={styles.cellRowHeader}>
//                   <Ionicons name={tool.icon} size={22} color={tool.color} />
//                   <Text style={[styles.completionPercentageBadge, isFullyComplete && { color: '#10B981' }]}>
//                     {displayPercentage}%
//                   </Text>
//                 </View>
//                 <Text style={styles.toolCellTitle}>{tool.title}</Text>
//                 <View style={styles.miniProgressTrack}>
//                   <View style={[styles.miniProgressFill, { width: `${displayPercentage}%`, backgroundColor: tool.color }]} />
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         {/* INTERACTIVE DAILY MISSION CARD */}
//         <Text style={styles.globalSectionHeader}>Active Climate Drill ({activeMission.day})</Text>
//         <TouchableOpacity 
//           style={[styles.premiumDailyCard, { borderColor: activeMission.accent + '30' }]}
//           activeOpacity={0.9}
//           onPress={() => {
//             setSelectedOption(null);
//             setSimulationResult(null);
//             setModalVisible(true);
//           }}
//         >
//           <View style={styles.imageWrapper}>
//             <Image source={{ uri: activeMission.image }} style={styles.scenarioImage} resizeMode="cover" />
//             <View style={styles.imageOverlay} />
//             <View style={[styles.pointsIndicatorFloating, { backgroundColor: activeMission.accent }]}>
//               <Text style={styles.floatingPointsText}>+{activeMission.pts} XP</Text>
//             </View>
//           </View>
//           <Text style={styles.mainMissionTitle}>{activeMission.title}</Text>
//           <Text style={styles.mainMissionDesc}>{activeMission.desc}</Text>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
//             <Ionicons name="flash" size={16} color="#38BDF8" />
//             <Text style={{ color: '#38BDF8', fontSize: 12, fontWeight: '700' }}>Tap to Take Tactical Decision Drill</Text>
//           </View>
//         </TouchableOpacity>

//         {/* DYNAMIC LEADERBOARD TERMINAL CONTAINER */}
//         <View style={styles.sectionHeaderRowInline}>
//           <Text style={styles.globalSectionHeaderInline}>Regional Leaderboard</Text>
//           {nextRankGap.pointsNeeded > 0 && (
//             <Text style={styles.dynamicRankGapText}>
//               Need <Text style={{ color: '#FACC15' }}>+{nextRankGap.pointsNeeded} XP</Text> to pass {nextRankGap.targetRank}
//             </Text>
//           )}
//         </View>

//         <View style={styles.leaderboardContainerBox}>
//           {liveLeaderboard.length === 0 ? (
//             <Text style={styles.emptyLeaderboardText}>Awaiting system configuration metrics...</Text>
//           ) : (
//             liveLeaderboard.map((player, index) => {
//               const isSelf = player.name === currentUserName;
//               const rank = index + 1;
//               return (
//                 <View key={player.id || index} style={[styles.leaderboardRowItem, isSelf && styles.highlightedSelfRow]}>
//                   <View style={styles.leaderboardLeftBlock}>
//                     <Text style={[styles.rankText, rank === 1 && { color: '#FACC15' }]}>#{rank}</Text>
//                     <View style={styles.identityMeta}>
//                       <Text style={[styles.playerProfileName, isSelf && { color: '#10B981', fontWeight: '900' }]}>
//                         {player.name} {isSelf && '(You)'}
//                       </Text>
//                       <Text style={styles.playerSubTelemetry}>{player.streak || 0} Day Continuous Active Streak</Text>
//                     </View>
//                   </View>
//                   <Text style={[styles.playerXpMetrics, isSelf && { color: '#10B981' }]}>{player.points || 0} XP</Text>
//                 </View>
//               );
//             })
//           )}
//         </View>

//       </ScrollView>

//       {/* ─── MISSION SIMULATION MODAL ────────────────────────── */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
            
//             {/* Header */}
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalCategoryText}>TACTICAL SIMULATION</Text>
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Ionicons name="close-circle" size={26} color="#64748B" />
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.modalTitle}>{activeMission.title}</Text>
            
//             <View style={styles.scenarioBox}>
//               <Ionicons name="alert-circle-outline" size={20} color="#38BDF8" style={{ marginTop: 2 }} />
//               <Text style={styles.scenarioText}>{activeMission.scenario}</Text>
//             </View>

//             {/* Options List */}
//             <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 10 }}>
//               {activeMission.options.map((opt, index) => {
//                 const isSelected = selectedOption === index;
//                 return (
//                   <TouchableOpacity
//                     key={index}
//                     style={[
//                       styles.optionCard,
//                       isSelected && (opt.correct ? styles.optionCorrect : styles.optionIncorrect)
//                     ]}
//                     onPress={() => {
//                       setSelectedOption(index);
//                       setSimulationResult(opt);
//                     }}
//                   >
//                     <Text style={[styles.optionText, isSelected && { color: '#FFFFFF', fontWeight: '700' }]}>
//                       {opt.text}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </ScrollView>

//             {/* Feedback / Result section */}
//             {simulationResult && (
//               <View style={[styles.feedbackBox, simulationResult.correct ? styles.feedbackSuccess : styles.feedbackError]}>
//                 <Ionicons 
//                   name={simulationResult.correct ? "checkmark-circle" : "close-circle"} 
//                   size={20} 
//                   color={simulationResult.correct ? "#10B981" : "#EF4444"} 
//                 />
//                 <Text style={styles.feedbackText}>{simulationResult.feedback}</Text>
//               </View>
//             )}

//             {/* Action Buttons */}
//             {simulationResult?.correct ? (
//               <TouchableOpacity style={styles.completeMissionBtn} onPress={handleCompleteMission}>
//                 <Text style={styles.completeMissionBtnText}>Claim +{activeMission.pts} XP Reward</Text>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity 
//                 style={[styles.completeMissionBtn, { backgroundColor: '#334155' }]} 
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.completeMissionBtnText}>Close Simulation</Text>
//               </TouchableOpacity>
//             )}

//           </View>
//         </View>

//         {/* Confetti Celebration Trigger */}
//         {showConfetti && (
//           <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
//             <ConfettiCannon count={150} origin={{ x: 200, y: 0 }} fadeOut={true} />
//           </View>
//         )}
//       </Modal>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   masterContainer: { flex: 1, backgroundColor: '#020617' },
//   container: { flex: 1, paddingHorizontal: 16 },
//   topBar: { paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
//   brandTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
//   metaLabel: { color: '#475569', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
//   badgePill: { backgroundColor: '#1E1B4B', borderWidth: 1, borderColor: '#4338CA', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
//   badgePillText: { color: '#818CF8', fontSize: 12, fontWeight: '900' },
  
//   levelCard: { backgroundColor: '#0F172A', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: '#1E293B', marginBottom: 12 },
//   levelSplitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
//   progressDataText: { color: '#94A3B8', fontSize: 12, fontWeight: '700' },
//   xpTextIndicator: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
//   progressBarTrack: { height: 10, backgroundColor: '#1E293B', borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
//   progressBarFill: { height: '100%', backgroundColor: '#38BDF8', borderRadius: 5 },
//   levelSubtext: { color: '#64748B', fontSize: 11 },

//   globalSectionHeader: { color: '#475569', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 10, marginTop: 18 },
//   sectionHeaderRowInline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 10 },
//   globalSectionHeaderInline: { color: '#475569', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
//   dynamicRankGapText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },

//   alertsShortcutCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E293B', borderRadius: 16, padding: 14, marginTop: 6 },
//   shortcutLeftCell: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
//   iconFrame: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
//   shortcutMainTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
//   shortcutSubtext: { color: '#64748B', fontSize: 11, marginTop: 1 },

//   milestoneRowContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
//   milestoneBadgeCell: { flex: 1, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E293B', borderRadius: 16, paddingVertical: 14, alignItems: 'center', position: 'relative' },
//   milestoneBadgeLit: { borderColor: '#F59E0B20', backgroundColor: '#1E150B' },
//   milestoneLabel: { color: '#475569', fontSize: 10, fontWeight: '700', marginTop: 6 },
//   milestoneLabelLit: { color: '#F59E0B' },
//   litDotGlow: { position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },

//   toolGridSetup: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
//   toolGridCell: { backgroundColor: '#0F172A', width: '48%', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#1E293B' },
//   cellRowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   completionPercentageBadge: { color: '#94A3B8', fontSize: 12, fontWeight: '800' },
//   toolCellTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginBottom: 8 },
//   miniProgressTrack: { height: 4, backgroundColor: '#1E293B', borderRadius: 2, overflow: 'hidden' },
//   miniProgressFill: { height: '100%', borderRadius: 2 },

//   premiumDailyCard: { backgroundColor: '#0F172A', borderWidth: 1, borderRadius: 20, padding: 16, overflow: 'hidden' },
//   imageWrapper: { height: 110, marginHorizontal: -16, marginTop: -16, marginBottom: 14, overflow: 'hidden', position: 'relative' },
//   scenarioImage: { width: '100%', height: '100%' },
//   imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2, 6, 23, 0.3)' },
//   pointsIndicatorFloating: { position: 'absolute', top: 12, right: 12, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
//   floatingPointsText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
//   mainMissionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', marginBottom: 4 },
//   mainMissionDesc: { color: '#94A3B8', fontSize: 12, marginBottom: 12, lineHeight: 16 },

//   leaderboardContainerBox: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E293B', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, overflow: 'hidden' },
//   leaderboardRowItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#1E293B' },
//   highlightedSelfRow: { backgroundColor: 'rgba(16, 185, 129, 0.05)', marginHorizontal: -14, paddingHorizontal: 14 },
//   leaderboardLeftBlock: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
//   rankText: { fontSize: 14, fontWeight: '900', color: '#64748B', width: 28 },
//   identityMeta: { flex: 1 },
//   playerProfileName: { color: '#E2E8F0', fontSize: 13, fontWeight: '600' },
//   playerSubTelemetry: { color: '#475569', fontSize: 10, marginTop: 1 },
//   playerXpMetrics: { color: '#38BDF8', fontSize: 13, fontWeight: '800' },
//   emptyLeaderboardText: { color: '#64748B', fontSize: 13, textAlign: 'center', paddingVertical: 20 },

//   modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(2, 6, 23, 0.8)' },
//   modalContent: { backgroundColor: '#0F172A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '85%', borderWidth: 1, borderColor: '#1E293B' },
//   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
//   modalCategoryText: { color: '#38BDF8', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
//   modalTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 12 },
//   scenarioBox: { flexDirection: 'row', gap: 10, backgroundColor: '#1E293B', padding: 12, borderRadius: 12, marginBottom: 16 },
//   scenarioText: { color: '#E2E8F0', fontSize: 13, flex: 1, lineHeight: 18 },
//   optionCard: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', padding: 14, borderRadius: 12, marginBottom: 10 },
//   optionCorrect: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981' },
//   optionIncorrect: { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#EF4444' },
//   optionText: { color: '#94A3B8', fontSize: 13 },
//   feedbackBox: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10, marginVertical: 10 },
//   feedbackSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
//   feedbackError: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
//   feedbackText: { color: '#FFFFFF', fontSize: 12, flex: 1 },
//   completeMissionBtn: { backgroundColor: '#10B981', padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 10 },
//   completeMissionBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' }
// });
//  */





// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   StatusBar,
//   Image,
//   Modal,
//   Alert,
//   Dimensions
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ConfettiCannon from 'react-native-confetti-cannon';
// import * as Haptics from 'expo-haptics';

// import { useUser } from '../contexts/UserContext';
// import { useAlerts } from '../contexts/AlertContext';
// import FloodRunnerGameModal from './FloodRunnerGameModal';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// const WEEKLY_MISSIONS = [
//   { 
//     id: 'sun_heat', day: 'Sunday', title: 'Severe Heatwave Protocol', desc: 'Temperature spikes past 38°C in concrete blocks.', 
//     image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600&auto=format&fit=crop', pts: 50, coins: 20, accent: '#F59E0B',
//     scenario: 'A severe heatwave alert is issued. Indoor temperatures are rising. What is your immediate action?',
//     options: [
//       { text: 'Keep all windows tightly sealed and shut curtains', correct: false, feedback: 'Incorrect! Sealing traps heat inside. You need cross-ventilation.' },
//       { text: 'Draw thermal curtains, open windows for cross-breeze, and hydrate', correct: true, feedback: 'Correct! Blocking direct radiation while promoting airflow prevents heat exhaustion.' },
//       { text: 'Turn off ceiling fans to conserve power', correct: false, feedback: 'Incorrect! Fans assist evaporative cooling.' }
//     ]
//   },
//   { 
//     id: 'mon_flood', day: 'Monday', title: 'Monsoon Flash Flood Routing', desc: 'Torrential downpours trigger water level rises.', 
//     image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=600&auto=format&fit=crop', pts: 60, coins: 25, accent: '#38BDF8',
//     scenario: 'Flash floods submerge a road near an underpass. What do you do?',
//     options: [
//       { text: 'Drive through quickly before water gets higher', correct: false, feedback: 'Dangerous! 30cm of moving water can sweep vehicles away.' },
//       { text: 'Abandon vehicle immediately and seek high ground on foot', correct: true, feedback: 'Correct! Move to elevated ground immediately.' },
//       { text: 'Wait inside the locked car', correct: false, feedback: 'Risky! Rapidly rising water can trap you inside.' }
//     ]
//   },
//   { 
//     id: 'tue_haze', day: 'Tuesday', title: 'Transboundary Haze Defense', desc: 'PSI levels surge into unhealthy brackets.', 
//     image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=600&auto=format&fit=crop', pts: 55, coins: 20, accent: '#64748B',
//     scenario: 'PSI hits 250 (Very Unhealthy). What respiratory defense is required?',
//     options: [
//       { text: 'Wear a standard paper surgical mask', correct: false, feedback: 'Incorrect. Surgical masks do not filter fine PM2.5 micro-particles.' },
//       { text: 'Wear a fitted N95 respirator mask and minimize outdoor activity', correct: true, feedback: 'Correct! N95 respirators block PM2.5 micro-pollutants.' },
//       { text: 'Cover mouth with damp cotton cloth', correct: false, feedback: 'Incorrect. Damp cloths offer negligible protection against toxic haze smoke.' }
//     ]
//   },
//   { 
//     id: 'wed_water', day: 'Wednesday', title: 'PUB Water Disruption Prep', desc: 'Localized pipeline disruption reported.', 
//     image: 'https://images.unsplash.com/photo-1548858850-811fa15722ab?q=80&w=600&auto=format&fit=crop', pts: 45, coins: 15, accent: '#0EA5E9',
//     scenario: 'A municipal water supply cut is announced. Recommended emergency water reserve per person/day?',
//     options: [
//       { text: '0.5 Liters per day', correct: false, feedback: 'Too low for drinking and sanitation.' },
//       { text: 'At least 3 Liters per day for drinking, hygiene, and basic sanitation', correct: true, feedback: 'Correct! SCDF baseline recommends 3L/person/day.' },
//       { text: '20 Liters per day for filling bathtubs', correct: false, feedback: 'Inefficient for short-term disruptions.' }
//     ]
//   },
//   { 
//     id: 'thu_supply', day: 'Thursday', title: 'SCDF Go-Bag Compliance', desc: 'Audit essential life-support gear inside storage.', 
//     image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop', pts: 50, coins: 20, accent: '#10B981',
//     scenario: 'When packing your emergency Go-Bag, which gear is essential?',
//     options: [
//       { text: 'Heavy gaming laptop', correct: false, feedback: 'Incorrect. Too heavy and impractical.' },
//       { text: 'Power bank, emergency radio, and waterproof flashlight', correct: true, feedback: 'Correct! Essential for offline communication and light.' },
//       { text: 'An electric wall-socket fan', correct: false, feedback: 'Outlets won\'t work in grid-down blackouts.' }
//     ]
//   },
//   { 
//     id: 'fri_comm', day: 'Friday', title: 'SGSecure Mesh Comms Drill', desc: 'Establish offline communication protocols.', 
//     image: 'https://images.unsplash.com/photo-1516216556741-d981a54f6f85?q=80&w=600&auto=format&fit=crop', pts: 65, coins: 30, accent: '#8B5CF6',
//     scenario: 'Cellular networks fail during a crisis. How should your household coordinate?',
//     options: [
//       { text: 'Keep spamming phone calls', correct: false, feedback: 'Jams network lines and drains battery.' },
//       { text: 'Pre-agree on a physical rendezvous location and offline SMS/mesh apps', correct: true, feedback: 'Correct! Physical meetup points guarantee safety sync.' },
//       { text: 'Wait in separate shopping malls', correct: false, feedback: 'Causes dangerous confusion.' }
//     ]
//   },
//   { 
//     id: 'sat_blackout', day: 'Saturday', title: 'Grid-Down Power Contingency', desc: 'Manage power assets during blackouts.', 
//     image: 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?q=80&w=600&auto=format&fit=crop', pts: 60, coins: 25, accent: '#EC4899',
//     scenario: 'An island-wide blackout plunges your home into darkness. What is your priority action?',
//     options: [
//       { text: 'Leave all light switches turned on', correct: false, feedback: 'Causes sudden power surges when grid restores.' },
//       { text: 'Unplug sensitive electronics and use LED flashlights', correct: true, feedback: 'Correct! Prevents power surge damage and saves battery.' },
//       { text: 'Light indoor scented candles near curtains', correct: false, feedback: 'High fire risk.' }
//     ]
//   }
// ];

// const STORAGE_KEY = '@prepwise_leaderboard_data';
// const XP_PER_LEVEL = 1000;

// export default function HomeScreen({ navigation }) {
//   const { user, updateUser } = useUser();
//   const { alerts } = useAlerts(); 
  
//   const currentDayIndex = new Date().getDay();
//   const activeMission = WEEKLY_MISSIONS[currentDayIndex];
  
//   const [liveLeaderboard, setLiveLeaderboard] = useState([]);
//   const [nextRankGap, setNextRankGap] = useState({ pointsNeeded: 0, targetRank: '' });

//   // Modal Controls
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [simulationResult, setSimulationResult] = useState(null);
//   const [gameModalVisible, setGameModalVisible] = useState(false);
//   const [showConfetti, setShowConfetti] = useState(false);

//   // User State Baseline
//   const currentUserName = user?.name || 'New Responder';
//   const currentUserPoints = user?.points || 0;
//   const currentUserCoins = user?.coins || 0;
//   const currentUserStreak = user?.streak || 0;
//   const lastLoginDate = user?.lastLoginDate || null;
//   const hasCompletedDailyDrill = user?.completedMissions?.includes(activeMission.id);

//   const currentLevel = user?.level || Math.floor(currentUserPoints / XP_PER_LEVEL) + 1;
//   const currentXpProgress = currentUserPoints % XP_PER_LEVEL;
//   const progressPercent = XP_PER_LEVEL > 0 ? (currentXpProgress / XP_PER_LEVEL) * 100 : 0;

//   // ─── STREAK & DAILY CHECK-IN ENGINE ───
//   useEffect(() => {
//     checkDailyStreakAndLoginRewards();
//   }, []);

//   const checkDailyStreakAndLoginRewards = async () => {
//     const todayStr = new Date().toISOString().split('T')[0];
//     if (lastLoginDate === todayStr) return; // Already logged in today

//     let updatedStreak = currentUserStreak;

//     if (lastLoginDate) {
//       const lastDate = new Date(lastLoginDate);
//       const currentDate = new Date(todayStr);
//       const diffTime = Math.abs(currentDate - lastDate);
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//       if (diffDays === 1) {
//         updatedStreak += 1; // Consecutive day login
//       } else if (diffDays > 1) {
//         updatedStreak = 1; // Missed a day, streak resets
//       }
//     } else {
//       updatedStreak = 1; // First login
//     }

//     // Award Daily Check-in Bonus (+10 Coins & +20 XP)
//     const bonusCoins = 10;
//     const bonusXP = 20;

//     if (updateUser) {
//       updateUser({
//         ...user,
//         streak: updatedStreak,
//         lastLoginDate: todayStr,
//         coins: currentUserCoins + bonusCoins,
//         points: currentUserPoints + bonusXP
//       });
//     }

//     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//     Alert.alert(
//       "☀️ Daily Check-in Claimed!",
//       `Welcome back! You extended your streak to ${updatedStreak} Days!\n\nRewards: +${bonusCoins} PrepCoins & +${bonusXP} XP.`
//     );
//   };

//   const handleSelectOption = (option) => {
//     setSelectedOption(option);
//     setSimulationResult(option);
//     if (option.correct) {
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//     } else {
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
//     }
//   };

//   const handleCompleteMission = () => {
//     if (!simulationResult?.correct) return;

//     const newPoints = currentUserPoints + activeMission.pts;
//     const newCoins = currentUserCoins + activeMission.coins;
//     const completedList = [...(user?.completedMissions || []), activeMission.id];

//     if (updateUser) {
//       updateUser({
//         ...user,
//         points: newPoints,
//         coins: newCoins,
//         completedMissions: completedList
//       });
//     }

//     setModalVisible(false);
//     setShowConfetti(true);
//     setTimeout(() => setShowConfetti(false), 4000);

//     Alert.alert(
//       "🎉 Drill Mastered!",
//       `Earned +${activeMission.pts} XP & +${activeMission.coins} PrepCoins!`
//     );
//   };

//   const handleGameReward = ({ xp, coins }) => {
//     if (updateUser) {
//       updateUser({
//         ...user,
//         points: currentUserPoints + xp,
//         coins: currentUserCoins + coins
//       });
//     }
//     setShowConfetti(true);
//     setTimeout(() => setShowConfetti(false), 4000);
//   };

//   return (
//     <View style={styles.masterContainer}>
//       <StatusBar barStyle="light-content" backgroundColor="#020617" />

//       {showConfetti && (
//         <ConfettiCannon count={150} origin={{ x: SCREEN_WIDTH / 2, y: -20 }} fallSpeed={3000} fadeOut />
//       )}
      
//       <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
//         {/* TOP BAR BRANDING & CURRENCY DISPLAY */}
//         <View style={styles.topBar}>
//           <View>
//             <Text style={styles.brandTitle}>PrepWise</Text>
//             <Text style={styles.metaLabel}>RESPONDER: {currentUserName.toUpperCase()}</Text>
//           </View>
//           <View style={{ flexDirection: 'row', gap: 8 }}>
//             {/* Coins Badge */}
//             <TouchableOpacity style={styles.coinPill} onPress={() => navigation.navigate('VoucherStore')}>
//               <Ionicons name="ellipse" size={12} color="#FACC15" />
//               <Text style={styles.coinPillText}>{currentUserCoins} PTS</Text>
//             </TouchableOpacity>
//             {/* Level Badge */}
//             <View style={styles.badgePill}>
//               <Text style={styles.badgePillText}>LVL {currentLevel}</Text>
//             </View>
//           </View>
//         </View>

//         {/* DAILY STREAK REMINDER & ENCOURAGEMENT BANNER */}
//         <View style={styles.streakEncouragementBanner}>
//           <View style={styles.streakBannerLeft}>
//             <Ionicons name="flame" size={26} color="#F59E0B" />
//             <View style={{ flex: 1 }}>
//               <Text style={styles.streakBannerTitle}>{currentUserStreak} Day Active Streak!</Text>
//               <Text style={styles.streakBannerSub}>
//                 {hasCompletedDailyDrill 
//                   ? 'Great job! Today\'s daily climate drill is complete.' 
//                   : 'Complete today\'s drill to protect your streak & earn PrepCoins!'}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* PROGRESSION LEVEL CARD */}
//         <View style={styles.levelCard}>
//           <View style={styles.levelSplitHeader}>
//             <Text style={styles.progressDataText}>Next Level Progression</Text>
//             <Text style={styles.xpTextIndicator}>{currentXpProgress} / {XP_PER_LEVEL} XP</Text>
//           </View>
//           <View style={styles.progressBarTrack}>
//             <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
//           </View>
//           <Text style={styles.levelSubtext}>
//             Score <Text style={{ fontWeight: '700', color: '#38BDF8' }}>{XP_PER_LEVEL - currentXpProgress} more XP</Text> to hit Level {currentLevel + 1}
//           </Text>
//         </View>

//         {/* INTERACTIVE MINI-GAME LINK BANNER */}
//         <TouchableOpacity style={styles.gameBannerCard} activeOpacity={0.88} onPress={() => setGameModalVisible(true)}>
//           <View style={styles.gameBannerContent}>
//             <View style={styles.gameIconBadge}>
//               <Ionicons name="navigate-circle" size={28} color="#0EA5E9" />
//             </View>
//             <View style={{ flex: 1 }}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
//                 <Text style={styles.gameBannerTitle}>Monsoon Evacuation Simulation</Text>
//                 <View style={styles.gameTag}><Text style={styles.gameTagText}>MOTION</Text></View>
//               </View>
//               <Text style={styles.gameBannerSub}>Tilt phone to steer through flash floods & earn rewards!</Text>
//             </View>
//             <Ionicons name="play" size={20} color="#38BDF8" />
//           </View>
//         </TouchableOpacity>

//         {/* ACTIVE DAILY DRILL */}
//         <Text style={styles.globalSectionHeader}>Active Climate Drill ({activeMission.day})</Text>
//         <TouchableOpacity 
//           style={[styles.premiumDailyCard, { borderColor: activeMission.accent + '40' }]}
//           activeOpacity={0.9}
//           onPress={() => {
//             setSelectedOption(null);
//             setSimulationResult(null);
//             setModalVisible(true);
//           }}
//         >
//           <View style={styles.imageWrapper}>
//             <Image source={{ uri: activeMission.image }} style={styles.scenarioImage} resizeMode="cover" />
//             <View style={styles.imageOverlay} />
//             <View style={[styles.pointsIndicatorFloating, { backgroundColor: activeMission.accent }]}>
//               <Text style={styles.floatingPointsText}>+{activeMission.pts} XP | +{activeMission.coins} PTS</Text>
//             </View>
//           </View>
//           <Text style={styles.mainMissionTitle}>{activeMission.title}</Text>
//           <Text style={styles.mainMissionDesc}>{activeMission.desc}</Text>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
//             <Ionicons name="flash" size={16} color="#38BDF8" />
//             <Text style={{ color: '#38BDF8', fontSize: 12, fontWeight: '700' }}>
//               {hasCompletedDailyDrill ? 'Drill Completed (Tap to review)' : 'Tap to Take Tactical Decision Drill'}
//             </Text>
//           </View>
//         </TouchableOpacity>

//       </ScrollView>

//       {/* DECISION DRILL MODAL */}
//       <Modal visible={modalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContentCard}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>{activeMission.title}</Text>
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Ionicons name="close-circle" size={26} color="#64748B" />
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.modalScenario}>{activeMission.scenario}</Text>

//             {activeMission.options.map((opt, i) => {
//               const isSelected = selectedOption?.text === opt.text;
//               return (
//                 <TouchableOpacity
//                   key={i}
//                   style={[
//                     styles.optionBtn,
//                     isSelected && (opt.correct ? styles.optionCorrect : styles.optionIncorrect)
//                   ]}
//                   onPress={() => handleSelectOption(opt)}
//                 >
//                   <Text style={styles.optionText}>{opt.text}</Text>
//                 </TouchableOpacity>
//               );
//             })}

//             {simulationResult && (
//               <View style={[styles.feedbackBox, simulationResult.correct ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
//                 <Ionicons name={simulationResult.correct ? "checkmark-circle" : "alert-circle"} size={20} color={simulationResult.correct ? "#10B981" : "#EF4444"} />
//                 <Text style={styles.feedbackText}>{simulationResult.feedback}</Text>
//               </View>
//             )}

//             {simulationResult?.correct && (
//               <TouchableOpacity style={styles.claimRewardBtn} onPress={handleCompleteMission}>
//                 <Text style={styles.claimRewardText}>Claim +{activeMission.pts} XP & +{activeMission.coins} PrepCoins</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* MINI-GAME COMPONENT MODAL */}
//       <FloodRunnerGameModal 
//         visible={gameModalVisible} 
//         onClose={() => setGameModalVisible(false)} 
//         onWin={handleGameReward}
//       />

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   masterContainer: { flex: 1, backgroundColor: '#020617' },
//   container: { flex: 1, paddingHorizontal: 16 },
//   topBar: { paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
//   brandTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
//   metaLabel: { color: '#475569', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
//   badgePill: { backgroundColor: '#1E1B4B', borderWidth: 1, borderColor: '#4338CA', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 },
//   badgePillText: { color: '#818CF8', fontSize: 11, fontWeight: '900' },
//   coinPill: { backgroundColor: '#2E2203', borderWidth: 1, borderColor: '#CA8A04', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
//   coinPillText: { color: '#FACC15', fontSize: 11, fontWeight: '900' },

//   streakEncouragementBanner: { backgroundColor: '#1E150B', borderWidth: 1, borderColor: '#B4530940', borderRadius: 16, padding: 14, marginBottom: 12 },
//   streakBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   streakBannerTitle: { color: '#F59E0B', fontSize: 13, fontWeight: '800' },
//   streakBannerSub: { color: '#D97706', fontSize: 11, marginTop: 2 },

//   levelCard: { backgroundColor: '#0F172A', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#1E293B', marginBottom: 12 },
//   levelSplitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
//   progressDataText: { color: '#94A3B8', fontSize: 12, fontWeight: '700' },
//   xpTextIndicator: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
//   progressBarTrack: { height: 8, backgroundColor: '#1E293B', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
//   progressBarFill: { height: '100%', backgroundColor: '#38BDF8', borderRadius: 4 },
//   levelSubtext: { color: '#64748B', fontSize: 11 },

//   gameBannerCard: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#0284C7', borderRadius: 16, padding: 14, marginBottom: 16 },
//   gameBannerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   gameIconBadge: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#0C4A6E', justifyContent: 'center', alignItems: 'center' },
//   gameBannerTitle: { color: '#FFF', fontSize: 13, fontWeight: '800' },
//   gameBannerSub: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
//   gameTag: { backgroundColor: '#0EA5E9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
//   gameTagText: { color: '#FFF', fontSize: 8, fontWeight: '900' },

//   globalSectionHeader: { color: '#475569', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 10 },
//   premiumDailyCard: { backgroundColor: '#0F172A', borderWidth: 1, borderRadius: 20, padding: 16, overflow: 'hidden' },
//   imageWrapper: { height: 110, marginHorizontal: -16, marginTop: -16, marginBottom: 14, overflow: 'hidden', position: 'relative' },
//   scenarioImage: { width: '100%', height: '100%' },
//   imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2, 6, 23, 0.3)' },
//   pointsIndicatorFloating: { position: 'absolute', top: 12, right: 12, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
//   floatingPointsText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
//   mainMissionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', marginBottom: 4 },
//   mainMissionDesc: { color: '#94A3B8', fontSize: 12, marginBottom: 12, lineHeight: 16 },

//   modalOverlay: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 },
//   modalContentCard: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E293B', borderRadius: 20, padding: 20, width: '100%' },
//   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   modalTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
//   modalScenario: { color: '#CBD5E1', fontSize: 13, marginBottom: 16, lineHeight: 18 },
//   optionBtn: { backgroundColor: '#1E293B', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
//   optionCorrect: { borderColor: '#10B981', backgroundColor: '#064E3B' },
//   optionIncorrect: { borderColor: '#EF4444', backgroundColor: '#451A1A' },
//   optionText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
//   feedbackBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 10, marginVertical: 10 },
//   feedbackCorrect: { backgroundColor: '#065F4620' },
//   feedbackIncorrect: { backgroundColor: '#991B1B20' },
//   feedbackText: { color: '#E2E8F0', fontSize: 11, flex: 1 },
//   claimRewardBtn: { backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 10 },
//   claimRewardText: { color: '#FFF', fontWeight: '900', fontSize: 13 }
// });