// React Hooks
// The useState function stores changing values.
// The useEffect function runs code when the component mounts or updates.
// The useMemo function memorises values to avoid unnecessary recalculations.
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Alert,
  Modal,
  Dimensions
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon';

import {
  requestNotificationPermission,
  sendMissionCompletedNotification
} from '../services/Notifications';

import { useUser } from '../contexts/UserContext';
import { useAlerts } from '../contexts/AlertContext';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

// ===================================================================
// WEEKLY MISSION DATABASE
// ===================================================================

const WEEKLY_MISSIONS = [
  {
    id: 'sun_heat',
    day: 'Sunday',
    title: 'Severe Heatwave Protocol',
    desc: 'Temperature spikes past 38°C in concrete blocks. Mitigate urban heat stress.',
    image:
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600&auto=format&fit=crop',
    pts: 50,
    accent: '#F59E0B',
    scenario:
      'A severe heatwave alert is issued. Your indoor temperature is rising rapidly. What is your immediate tactical action?',
    options: [
      {
        text: 'Keep all windows tightly sealed and shut curtains',
        correct: false,
        feedback:
          'Incorrect! Sealing trap heat inside. You need cross-ventilation.'
      },
      {
        text: 'Draw thermal curtains, open windows for cross-breeze, and hydrate',
        correct: true,
        feedback:
          'Correct! Blocking direct solar radiation while promoting airflow prevents heat exhaustion.'
      },
      {
        text: 'Turn off all ceiling fans to conserve emergency energy',
        correct: false,
        feedback:
          'Incorrect! Fans assist evaporative cooling on human skin.'
      }
    ]
  },

  {
    id: 'mon_flood',
    day: 'Monday',
    title: 'Monsoon Flash Flood Routing',
    desc:
      'Torrential downpours trigger sudden water level rises near low-lying canals.',
    image:
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=600&auto=format&fit=crop',
    pts: 60,
    accent: '#38BDF8',
    scenario:
      'You are driving near a low-lying underpass as rapid flash floods begin submerging the road. What do you do?',
    options: [
      {
        text: 'Drive through quickly before water gets higher',
        correct: false,
        feedback:
          'Dangerous! Just 30cm of moving water can sweep away a vehicle.'
      },
      {
        text:
          'Abandon vehicle immediately and seek high-ground terrain on foot',
        correct: true,
        feedback:
          'Correct! Never risk driving through flooded underpasses. Move to elevated ground.'
      },
      {
        text: 'Wait inside the locked car and sleep until help arrives',
        correct: false,
        feedback:
          'Risky! Water levels can rise swiftly and trap you inside.'
      }
    ]
  },

  {
    id: 'tue_haze',
    day: 'Tuesday',
    title: 'Transboundary Haze Defense',
    desc:
      'PSI levels surge into unhealthy brackets due to regional smoke plumes.',
    image:
      'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=600&auto=format&fit=crop',
    pts: 55,
    accent: '#64748B',
    scenario:
      'The PSI hits 250 (Very Unhealthy). You need to step outside briefly. What respiratory defense is required?',
    options: [
      {
        text: 'Wear a standard surgical paper mask',
        correct: false,
        feedback:
          'Incorrect. Surgical masks do not filter fine PM2.5 micro-particles.'
      },
      {
        text:
          'Wear a fitted N95 respirator mask and minimize outdoor exertion',
        correct: true,
        feedback:
          'Correct! N95 respirators create a tight seal blocking harmful micro-pollutants.'
      },
      {
        text: 'Cover your mouth with a damp cotton cloth',
        correct: false,
        feedback:
          'Incorrect. Damp cloth offers virtually no protection against toxic haze smoke.'
      }
    ]
  },

  {
    id: 'wed_water',
    day: 'Wednesday',
    title: 'PUB Water Disruption Prep',
    desc:
      'Localized pipeline disruption reported. Secure emergency hydration buffers.',
    image:
      'https://images.unsplash.com/photo-1548858850-811fa15722ab?q=80&w=600&auto=format&fit=crop',
    pts: 45,
    accent: '#0EA5E9',
    scenario:
      'A sudden municipal water supply cut is announced for your block. How much emergency water storage should an adult maintain per day?',
    options: [
      {
        text: '0.5 Liters per day for drinking only',
        correct: false,
        feedback:
          'Incorrect. That is dangerously low for sanitation and hydration needs.'
      },
      {
        text:
          'At least 3 Liters per day for drinking, hygiene, and basic sanitation',
        correct: true,
        feedback:
          'Correct! SCDF guidelines recommend minimum baseline buffer capacities per person.'
      },
      {
        text: '20 Liters per day for filling bathtubs',
        correct: false,
        feedback:
          'Inefficient and unnecessary for short-term municipal disruptions.'
      }
    ]
  },

  {
    id: 'thu_supply',
    day: 'Thursday',
    title: 'SCDF Go-Bag Compliance',
    desc:
      'Audit essential life-support equipment inside emergency deployable storage.',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    pts: 50,
    accent: '#10B981',
    scenario:
      'When packing your emergency Go-Bag for sudden evacuation, which electronic gear is essential?',
    options: [
      {
        text: 'High-end gaming laptop and heavy console chargers',
        correct: false,
        feedback:
          'Incorrect. Too heavy and irrelevant for survival situations.'
      },
      {
        text:
          'Power bank, hand-crank emergency radio, and waterproof flashlight',
        correct: true,
        feedback:
          'Correct! Reliable communication and lighting are vital during grid outages.'
      },
      {
        text: 'An electric portable fan requiring wall sockets',
        correct: false,
        feedback:
          'Incorrect. Wall outlets will likely be dead during a blackout.'
      }
    ]
  },

  {
    id: 'fri_comm',
    day: 'Friday',
    title: 'SGSecure Mesh Comms Drill',
    desc:
      'Establish alternative offline contact protocols during cellular network disruptions.',
    image:
      'https://images.unsplash.com/photo-1516216556741-d981a54f6f85?q=80&w=600&auto=format&fit=crop',
    pts: 65,
    accent: '#8B5CF6',
    scenario:
      'Cellular networks experience complete downtime during a crisis. How should your family sync up?',
    options: [
      {
        text:
          'Keep calling cellular numbers repeatedly until lines clear',
        correct: false,
        feedback:
          'Incorrect. This jams local cell towers and drains your battery.'
      },
      {
        text:
          'Pre-agree on an offline physical rendezvous point and use SMS/mesh apps',
        correct: true,
        feedback:
          'Correct! Pre-determined emergency meetup points guarantee family reunion.'
      },
      {
        text: 'Wait indefinitely inside separate shopping malls',
        correct: false,
        feedback:
          'Incorrect. Leaving communication to chance causes dangerous panic.'
      }
    ]
  },

  {
    id: 'sat_blackout',
    day: 'Saturday',
    title: 'Grid-Down Power Contingency',
    desc:
      'Manage auxiliary battery assets during island-wide grid failures.',
    image:
      'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?q=80&w=600&auto=format&fit=crop',
    pts: 60,
    accent: '#EC4899',
    scenario:
      'An island-wide blackout plunges your apartment into darkness. What is your priority power conservation move?',
    options: [
      {
        text:
          'Leave all room lights switched on so you notice when power returns',
        correct: false,
        feedback:
          'Incorrect. This creates power surges when the main grid reconnects.'
      },
      {
        text:
          'Unplug sensitive electronics and use low-draw LED lighting/flashlights',
        correct: true,
        feedback:
          'Correct! Protecting appliances from power surges and conserving battery life is critical.'
      },
      {
        text: 'Light indoor scented candles next to curtains',
        correct: false,
        feedback:
          'Dangerous! Open flames in unmonitored rooms lead to structural fires.'
      }
    ]
  }
];

const STORAGE_KEY = '@prepwise_leaderboard_data';
const XP_PER_LEVEL = 1000;

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const { alerts } = useAlerts();

  const currentDayIndex = new Date().getDay();
  const activeMission = WEEKLY_MISSIONS[currentDayIndex];

  const [liveLeaderboard, setLiveLeaderboard] = useState([]);
  const [nextRankGap, setNextRankGap] = useState({
    pointsNeeded: 0,
    targetRank: ''
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentUserName = user?.name || t('home.defaults.newResponder');
  const currentUserPoints = user?.points || 0;
  const currentUserStreak = user?.streak || 0;
  const currentLevel = user?.level || 1;

  const currentXpProgress = currentUserPoints % XP_PER_LEVEL;

  const progressPercent =
    XP_PER_LEVEL > 0
      ? (currentXpProgress / XP_PER_LEVEL) * 100
      : 0;

  const currentCoins = user?.prepCoins ?? 0;
  const lastLoginDate = user?.lastLoginDate || null;

  const completedMissions = user?.completedMissions || {};
  const missionCompleted = completedMissions[activeMission.id];

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // ================================================================
  // DAILY CHECK-IN
  // ================================================================

  const checkDailyStreakAndLoginRewards = useCallback(async () => {
    const todayStr = new Date().toISOString().split('T')[0];

    if (lastLoginDate === todayStr) return;

    let updatedStreak = currentUserStreak;

    if (lastLoginDate) {
      const lastDate = new Date(lastLoginDate);
      const currentDate = new Date(todayStr);

      const diffTime = Math.abs(currentDate - lastDate);
      const diffDays = Math.ceil(
        diffTime / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        updatedStreak += 1;
      } else if (diffDays > 1) {
        updatedStreak = 1;
      }
    } else {
      updatedStreak = 1;
    }

    const bonusCoins = 50;
    const bonusXP = 100;

    if (updateUser) {
      updateUser({
        ...user,
        streak: updatedStreak,
        lastLoginDate: todayStr,
        prepCoins: currentCoins + bonusCoins,
        points: currentUserPoints + bonusXP
      });
    }

    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );

    Alert.alert(
      t('home.alerts.dailyCheckin.title'),
      t('home.alerts.dailyCheckin.message', {
        streak: updatedStreak,
        coins: bonusCoins,
        xp: bonusXP
      })
    );
  }, [
    lastLoginDate,
    currentUserStreak,
    currentCoins,
    currentUserPoints,
    updateUser,
    user,
    t
  ]);

  useEffect(() => {
    checkDailyStreakAndLoginRewards();
  }, [checkDailyStreakAndLoginRewards]);

  // ================================================================
  // MISSION ANSWER
  // ================================================================

  const handleSelectOption = option => {
    setSelectedOption(option);
    setSimulationResult(option);

    if (option.correct) {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    } else {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );
    }
  };

  // ================================================================
  // MISSION COMPLETION
  // ================================================================

  const handleCompleteMission = async () => {
    if (!simulationResult?.correct) return;

    const awardedPts = activeMission.pts;
    const awardedCoins = 25;

    const newPoints = currentUserPoints + awardedPts;
    const newStreak = currentUserStreak === 0 ? 1 : currentUserStreak;
    const newCoins = currentCoins + awardedCoins;

    if (missionCompleted) {
      Alert.alert(
        t('home.alerts.missionCompleted.title'),
        t('home.alerts.missionAlreadyComplete.message'),
        [
          {
            text: 'OK',
            onPress: () => setModalVisible(false)
          }
        ]
      );
      return;
    }

    if (updateUser) {
      updateUser({
        ...user,
        points: newPoints,
        streak: newStreak,
        prepCoins: newCoins,
        completedMissions: {
          ...completedMissions,
          [activeMission.id]: true
        }
      });
    }

    setModalVisible(false);

    setTimeout(() => {
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
      }, 3500);
    }, 300);

    Alert.alert(
      t('home.alerts.missionCompleted.title'),
      t('home.alerts.missionCompleted.message', {
        mission: t(`home.missions.${activeMission.id}.title`),
        xp: awardedPts,
        coins: awardedCoins,
        totalCoins: currentCoins + awardedCoins
      }),
      [
        {
          text: t('common.ok'),
          onPress: () => setModalVisible(false)
        }
      ]
    );

    await sendMissionCompletedNotification(
      activeMission.title,
      awardedPts,
      awardedCoins
    );
  };

  // ================================================================
  // FAMILY SYNC
  // ================================================================

  const handleToggleFamilySync = () => {
    const currentStatus =
      user?.familyEmergencyPlanRegistered || false;

    const updatedStatus = !currentStatus;

    if (updateUser) {
      updateUser({
        ...user,
        familyEmergencyPlanRegistered: updatedStatus
      });
    }

    Alert.alert(
      t('home.familySync.title'),
      updatedStatus
        ? t('home.familySync.safe')
        : t('home.familySync.awaiting'),
      [{ text: t('common.ok') }]
    );
  };

  // ================================================================
  // READINESS DATA
  // ================================================================

  const toolCompletionData = useMemo(() => {
    const totalAvailableQuizzes = 3;

    const completedQuizzesCount =
      user?.completedQuizzes?.length || 0;

    const quizProgress = Math.min(
      completedQuizzesCount / totalAvailableQuizzes,
      1
    );

    const familyMembersCount =
      user?.familyMembers?.length || 0;

    const hasEmergencyRendezvous =
      user?.familyEmergencyPlanRegistered ? 1 : 0;

    const familyProgress =
      familyMembersCount > 0
        ? hasEmergencyRendezvous
          ? 1.0
          : 0.5
        : 0;

    const hasBloodType =
      user?.healthData?.bloodType ? 1 : 0;

    const hasAllergiesLogged =
      user?.healthData?.allergies ? 1 : 0;

    const hasQrGenerated =
      user?.healthData?.qrCodeGenerated ? 1 : 0;

    const healthProgress =
      (hasBloodType +
        hasAllergiesLogged +
        hasQrGenerated) /
      3;

    const profileCompletedItems =
      (familyProgress === 1 ? 1 : 0) +
      (healthProgress === 1 ? 1 : 0);

    const profileTotalItems = 2;

    return [
      {
        id: 'Missions',
        title: t('home.readiness.missions'),
        progress: quizProgress,
        completed: completedQuizzesCount,
        total: totalAvailableQuizzes,
        icon: 'school-outline',
        color: '#6366F1'
      },
      {
        id: 'Profile',
        title: t('home.readiness.profile'),
        progress:
          profileCompletedItems / profileTotalItems,
        completed: profileCompletedItems,
        total: profileTotalItems,
        icon: 'person-circle-outline',
        color: '#10B981'
      }
    ];
  }, [user, t]);

  // ================================================================
  // LEADERBOARD
  // ================================================================

  const syncLeaderboardRegistry = useCallback(async () => {
    try {
      const storedData =
        await AsyncStorage.getItem(STORAGE_KEY);

      let workingRegistry = storedData
        ? JSON.parse(storedData)
        : [];

      const targetIndex = workingRegistry.findIndex(
        item => item.name === currentUserName
      );

      if (targetIndex !== -1) {
        workingRegistry[targetIndex].points =
          currentUserPoints;

        workingRegistry[targetIndex].streak =
          currentUserStreak;
      } else {
        workingRegistry.push({
          id: user?.id || 'user_production_node',
          name: currentUserName,
          points: currentUserPoints,
          streak: currentUserStreak
        });
      }

      workingRegistry.sort(
        (a, b) => b.points - a.points
      );

      setLiveLeaderboard(
        workingRegistry.slice(0, 5)
      );

      const absoluteUserRank =
        workingRegistry.findIndex(
          item => item.name === currentUserName
        );

      if (absoluteUserRank > 0) {
        const structuralLeaderAbove =
          workingRegistry[absoluteUserRank - 1];

        setNextRankGap({
          pointsNeeded:
            structuralLeaderAbove.points -
            currentUserPoints +
            1,
          targetRank: `#${absoluteUserRank}`
        });
      } else {
        setNextRankGap({
          pointsNeeded: 0,
          targetRank: 'TOP'
        });
      }

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(workingRegistry)
      );
    } catch (error) {
      console.error(
        'Leaderboard engine registration sync failure:',
        error
      );
    }
  }, [
    currentUserName,
    currentUserPoints,
    currentUserStreak,
    user?.id
  ]);

  useEffect(() => {
    syncLeaderboardRegistry();
  }, [syncLeaderboardRegistry]);

  // ================================================================
  // ALERTS
  // ================================================================

  const activeAlertCount = alerts?.length || 0;

  const highSeverityAlert = alerts?.some(
    alert =>
      alert.severity?.toUpperCase() === 'HIGH'
  );

  const checkMilestoneLit = daysRequired =>
    currentUserStreak >= daysRequired;

  // ================================================================
  // DAILY CHECKLIST
  // ================================================================

  const CHECKLIST_TOTAL = 5;
  const CHECKLIST_XP_PER_ITEM = 20;

  const checklistItems =
    user?.dailyChecklist || {};

  const completedCount = Object.values(
    checklistItems
  ).filter(item => item === true).length;

  const totalCount = CHECKLIST_TOTAL;

  const checklistPercentage =
    totalCount > 0
      ? Math.round(
          (completedCount / totalCount) * 100
        )
      : 0;

  const remainingXP =
    Math.max(
      totalCount - completedCount,
      0
    ) * CHECKLIST_XP_PER_ITEM;

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <View style={styles.masterContainer}>
      {showConfetti && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            elevation: 9999
          }}
        >
          <ConfettiCannon
            count={220}
            origin={{
              x:
                Dimensions.get('window').width / 2,
              y: 0
            }}
            fadeOut
          />
        </View>
      )}

      <StatusBar
        barStyle="light-content"
        backgroundColor="#020617"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 40
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* =========================================================
            HEADER BRANDING
        ========================================================= */}

        <View style={styles.topBar}>
          <View>
            <Text style={styles.brandTitle}>
              PrepWiseSG
            </Text>

            <Text style={styles.metaLabel}>
              {t('home.branding.avatar')}: {currentUserName}
            </Text>
          </View>

          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>
              {t('home.branding.level', {
                level: currentLevel
              })}
            </Text>
          </View>

          <View style={styles.coinBadge}>
            <Ionicons
              name="shield-checkmark"
              size={16}
              color="#34D399"
            />

            <Text style={styles.coinText}>
              {currentCoins}
            </Text>
          </View>
        </View>

        {/* =========================================================
            XP PROGRESS
        ========================================================= */}

        <View style={styles.levelCard}>
          <View style={styles.levelSplitHeader}>
            <Text style={styles.progressDataText}>
              {t('home.progress.nextLevel')}
            </Text>

            <Text style={styles.xpTextIndicator}>
              {currentXpProgress} / {XP_PER_LEVEL} XP
            </Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercent}%`
                }
              ]}
            />
          </View>

          <Text style={styles.levelSubtext}>
            {t('home.progress.xpRemaining', {
              xp: XP_PER_LEVEL - currentXpProgress,
              level: currentLevel + 1
            })}
          </Text>
        </View>
        {/* =========================================================
            ACTIVE ALERTS
        ========================================================= */}
        <TouchableOpacity
          style={[
            styles.alertsShortcutCard,
            {
              borderColor: highSeverityAlert
                ? '#EF4444'
                : '#7F1D1D',
              backgroundColor: highSeverityAlert
                ? '#1A0B0B'
                : '#160B0B'
            }
          ]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Alerts')
          }
        >
          <View style={styles.shortcutLeftCell}>
            <View
              style={[
                styles.iconFrame,
                {
                  backgroundColor: highSeverityAlert
                    ? '#451A1A'
                    : '#2A1010'
                }
              ]}
            >
              <Ionicons
                name="alert-circle"
                size={22}
                color="#EF4444"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.shortcutMainTitle,
                  {
                    color: '#EF4444'
                  }
                ]}
              >
                {t('home.alerts.title')}
              </Text>

              <Text style={styles.shortcutSubtext}>
                {activeAlertCount > 0
                  ? t('home.alerts.latest', {
                      title:
                        alerts?.[0]?.title ||
                        t(
                          'home.alerts.environmentalHazard'
                        )
                    })
                  : t('home.alerts.environmentalHazard')}
              </Text>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={16}
            color="#EF4444"
          />
        </TouchableOpacity>

        {/* =========================================================
            MILESTONES
        ========================================================= */}

        <Text style={styles.globalSectionHeader}>
          {t('home.milestones.sectionTitle')}
        </Text>

        <View style={styles.milestoneRowContainer}>
          {[
            {
              days: 1,
              label: t('home.milestones.oneDay')
            },
            {
              days: 3,
              label: t('home.milestones.threeDays')
            },
            {
              days: 5,
              label: t('home.milestones.fiveDays')
            },
            {
              days: 7,
              label: t('home.milestones.weekly')
            }
          ].map(milestone => {
            const isLit = checkMilestoneLit(
              milestone.days
            );

            return (
              <View
                key={milestone.days}
                style={[
                  styles.milestoneBadgeCell,
                  isLit &&
                    styles.milestoneBadgeLit
                ]}
              >
                <Ionicons
                  name={
                    isLit
                      ? 'flame'
                      : 'flame-outline'
                  }
                  size={24}
                  color={
                    isLit
                      ? '#F59E0B'
                      : '#334155'
                  }
                />

                <Text
                  style={[
                    styles.milestoneLabel,
                    isLit &&
                      styles.milestoneLabelLit
                  ]}
                >
                  {milestone.label}
                </Text>

                {isLit && (
                  <View
                    style={styles.litDotGlow}
                  />
                )}
              </View>
            );
          })}
        </View>

        {/* =========================================================
            READINESS
        ========================================================= */}

        <Text style={styles.globalSectionHeader}>
          {t('home.readiness.sectionTitle')}
        </Text>

        <View style={styles.toolGridSetup}>
          {toolCompletionData.map(tool => {
            return (
              <TouchableOpacity
                key={tool.id}
                style={styles.toolGridCell}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate(tool.id)
                }
              >
                <View style={styles.cellRowHeader}>
                  <View
                    style={[
                      styles.toolIconContainer,
                      {
                        backgroundColor:
                          `${tool.color}18`
                      }
                    ]}
                  >
                    <Ionicons
                      name={tool.icon}
                      size={22}
                      color={tool.color}
                    />
                  </View>
                </View>

                <Text
                  style={styles.toolCellTitle}
                >
                  {tool.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* =========================================================
            CHECKLIST
        ========================================================= */}

        <TouchableOpacity
          style={styles.checklistButton}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('Checklist')
          }
        >
          <View
            style={styles.checklistButtonLeft}
          >
            <View
              style={styles.checklistButtonIcon}
            >
              <Ionicons
                name="checkbox-outline"
                size={26}
                color="#10B981"
              />
            </View>

            <View
              style={
                styles.checklistButtonTextContainer
              }
            >
              <Text
                style={
                  styles.checklistButtonTitle
                }
              >
                {t('home.checklist.title')}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#64748B"
            />
          </View>
        </TouchableOpacity>

        {/* =========================================================
            DAILY MISSION
        ========================================================= */}

        <Text style={styles.globalSectionHeader}>
          {t('home.mission.activeDrill', {
            day: t(
              `home.missionDays.${activeMission.day.toLowerCase()}`
            )
          })}
        </Text>

        <TouchableOpacity
          style={[
            styles.premiumDailyCard,
            {
              borderColor:
                activeMission.accent + '30'
            }
          ]}
          activeOpacity={0.9}
          onPress={() => {
            setSelectedOption(null);
            setSimulationResult(null);
            setModalVisible(true);
          }}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: activeMission.image
              }}
              style={styles.scenarioImage}
              resizeMode="cover"
            />

            <View
              style={styles.imageOverlay}
            />

            <View
              style={[
                styles.pointsIndicatorFloating,
                {
                  backgroundColor:
                    activeMission.accent
                }
              ]}
            >
              <Text
                style={
                  styles.floatingPointsText
                }
              >
                +{activeMission.pts} XP
              </Text>

              <Text
                style={styles.coinReward}
              >
                🪙 +25
              </Text>
            </View>
          </View>

          <Text
            style={styles.mainMissionTitle}
          >
            {t(
              `home.missions.${activeMission.id}.title`
            )}
          </Text>

          <Text
            style={styles.mainMissionDesc}
          >
            {t(
              `home.missions.${activeMission.id}.desc`
            )}
          </Text>

          {missionCompleted && (
            <Text
              style={{
                color: '#10B981'
              }}
            >
              {t('home.mission.completedReview')}
            </Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Ionicons
              name="flash"
              size={16}
              color="#38BDF8"
            />

            <Text
              style={{
                color: '#38BDF8',
                fontSize: 12,
                fontWeight: '700'
              }}
            >
              {t('home.mission.tacticalDecision')}
            </Text>
          </View>
        </TouchableOpacity>

        {/* =========================================================
            LEADERBOARD
        ========================================================= */}

        <View
          style={styles.sectionHeaderRowInline}
        >
          <Text
            style={
              styles.globalSectionHeaderInline
            }
          >
            {t('home.leaderboard.title')}
          </Text>

          {nextRankGap.pointsNeeded > 0 && (
            <Text
              style={styles.dynamicRankGapText}
            >
              {t('home.leaderboard.needXp', {
                xp: nextRankGap.pointsNeeded,
                rank: nextRankGap.targetRank
              })}
            </Text>
          )}
        </View>

        <View
          style={
            styles.leaderboardContainerBox
          }
        >
          {liveLeaderboard.length === 0 ? (
            <Text
              style={
                styles.emptyLeaderboardText
              }
            >
              {t(
                'home.leaderboard.awaitingConfiguration'
              )}
            </Text>
          ) : (
            liveLeaderboard.map(
              (player, index) => {
                const isSelf =
                  player.name ===
                  currentUserName;

                const rank = index + 1;

                return (
                  <View
                    key={`${player.id || player.name}-${index}`}
                    style={[
                      styles.leaderboardRowItem,
                      isSelf &&
                        styles.highlightedSelfRow
                    ]}
                  >
                    <View
                      style={
                        styles.leaderboardLeftBlock
                      }
                    >
                      <Text
                        style={[
                          styles.rankText,
                          rank === 1 && {
                            color: '#FACC15'
                          }
                        ]}
                      >
                        #{rank}
                      </Text>

                      <View
                        style={
                          styles.identityMeta
                        }
                      >
                        <Text
                          style={[
                            styles.playerProfileName,
                            isSelf && {
                              color: '#10B981',
                              fontWeight: '900'
                            }
                          ]}
                        >
                          {player.name}{' '}
                          {isSelf &&
                            `(${t(
                              'home.leaderboard.you'
                            )})`}
                        </Text>

                        <Text
                          style={
                            styles.playerSubTelemetry
                          }
                        >
                          {t(
                            'home.leaderboard.streak',
                            {
                              days:
                                player.streak ||
                                0
                            }
                          )}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.playerXpMetrics,
                        isSelf && {
                          color: '#10B981'
                        }
                      ]}
                    >
                      {player.points || 0} XP
                    </Text>
                  </View>
                );
              }
            )
          )}
        </View>

        {/* =========================================================
            MISSION MODAL
        ========================================================= */}

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() =>
            setModalVisible(false)
          }
        >
          <View
            style={styles.modalOverlay}
          >
            <View style={styles.modalBox}>
              <Text
                style={styles.modalTitle}
              >
                {t(
                  `home.missions.${activeMission.id}.title`
                )}
              </Text>

              <Text
                style={styles.modalScenario}
              >
                {t(
                  `home.missions.${activeMission.id}.scenario`
                )}
              </Text>

              {activeMission.options.map(
                (option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      selectedOption ===
                        option && {
                        borderColor:
                          option.correct
                            ? '#10B981'
                            : '#EF4444'
                      }
                    ]}
                    onPress={() =>
                      handleSelectOption(
                        option
                      )
                    }
                  >
                    <Text
                      style={
                        styles.optionText
                      }
                    >
                      {t(
                        `home.missions.${activeMission.id}.options.${index}.text`
                      )}
                    </Text>
                  </TouchableOpacity>
                )
              )}

              {simulationResult && (
                <Text
                  style={{
                    color:
                      simulationResult.correct
                        ? '#10B981'
                        : '#EF4444',
                    marginTop: 20
                  }}
                >
                  {t(
                    `home.missions.${activeMission.id}.options.${activeMission.options.indexOf(
                      simulationResult
                    )}.feedback`
                  )}
                </Text>
              )}

              <TouchableOpacity
                style={
                  styles.completeButton
                }
                onPress={
                  handleCompleteMission
                }
              >
                <Text
                  style={{
                    color: 'white'
                  }}
                >
                  {t(
                    'home.mission.complete'
                  )}
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
  masterContainer: {
    flex: 1,
    backgroundColor: '#020617'
  },

  container: {
    flex: 1,
    paddingHorizontal: 16
  },

  topBar: {
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },

  brandTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5
  },

  metaLabel: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1
  },

  badgePill: {
    backgroundColor: '#1E1B4B',
    borderWidth: 1,
    borderColor: '#4338CA',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10
  },

  badgePillText: {
    color: '#818CF8',
    fontSize: 12,
    fontWeight: '900'
  },

  levelCard: {
    backgroundColor: '#0F172A',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 12
  },

  levelSplitHeader: {
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
    minWidth: 55
  },

  coinText: {
    color: '#FACC15',
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 5
  },

  checklistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    marginTop: 18
  },

  checklistButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },

  checklistButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor:
      'rgba(16, 185, 129, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },

  checklistButtonTextContainer: {
    flex: 1
  },

  checklistButtonTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4
  },

  checklistButtonSubtitle: {
    color: '#64748B',
    fontSize: 11
  },

  checklistButtonRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },

  checklistProgressCircle: {
    minWidth: 42,
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: '#064E3B',
    justifyContent: 'center',
    alignItems: 'center'
  },

  checklistProgressText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '900'
  },

  progressDataText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700'
  },

  xpTextIndicator: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },

  progressBarTrack: {
    height: 10,
    backgroundColor: '#1E293B',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 5
  },

  levelSubtext: {
    color: '#64748B',
    fontSize: 11
  },

  globalSectionHeader: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 18
  },

  sectionHeaderRowInline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10
  },

  globalSectionHeaderInline: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2
  },

  dynamicRankGapText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600'
  },

  alertsShortcutCard: {
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

  shortcutLeftCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },

  iconFrame: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  shortcutMainTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },

  shortcutSubtext: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 1
  },

  milestoneRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },

  milestoneBadgeCell: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    position: 'relative'
  },

  milestoneBadgeLit: {
    borderColor: '#F59E0B20',
    backgroundColor: '#1E150B'
  },

  milestoneLabel: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6
  },

  milestoneLabelLit: {
    color: '#F59E0B'
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  modalBox: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155'
  },

  modalTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 12
  },

  modalScenario: {
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20
  },

  optionButton: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#334155'
  },

  optionText: {
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 20
  },

  completeButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20
  },

  litDotGlow: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981'
  },

  toolGridSetup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },

  toolGridCell: {
    backgroundColor: '#0F172A',
    width: '48%',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E293B'
  },

  toolIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },

  toolCellSubtitle: {
    color: '#64748B',
    fontSize: 10,
    marginBottom: 10
  },

  cellRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },

  completionPercentageBadge: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800'
  },

  completionCountText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 8
  },

  toolCellTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    justifyContent: 'center',
    textAlign: 'center'
  },

  miniProgressTrack: {
    height: 4,
    backgroundColor: '#1E293B',
    borderRadius: 2,
    overflow: 'hidden'
  },

  miniProgressFill: {
    height: '100%',
    borderRadius: 2
  },

  premiumDailyCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden'
  },

  imageWrapper: {
    height: 110,
    marginHorizontal: -16,
    marginTop: -16,
    marginBottom: 14,
    overflow: 'hidden',
    position: 'relative'
  },

  scenarioImage: {
    width: '100%',
    height: '100%'
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(2, 6, 23, 0.3)'
  },

  pointsIndicatorFloating: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6
  },

  floatingPointsText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900'
  },

  mainMissionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4
  },

  mainMissionDesc: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 16
  },

  leaderboardContainerBox: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
    overflow: 'hidden'
  },

  leaderboardRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1E293B'
  },

  highlightedSelfRow: {
    backgroundColor:
      'rgba(16, 185, 129, 0.05)',
    marginHorizontal: -14,
    paddingHorizontal: 14
  },

  leaderboardLeftBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },

  rankText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#64748B',
    width: 28
  },

  identityMeta: {
    flex: 1
  },

  playerProfileName: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600'
  },

  playerSubTelemetry: {
    color: '#475569',
    fontSize: 10,
    marginTop: 1
  },

  playerXpMetrics: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '800'
  },

  emptyLeaderboardText: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20
  }
});
