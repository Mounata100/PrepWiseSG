import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';

export default function MissionsScreen({ navigation, route }) {
  /*
   * ---------------------------------------------------------
   * USER DATA
   * ---------------------------------------------------------
   *
   * Your UserContext should provide:
   *   points
   *   coins
   *
   * We keep earnedPoints from navigation as a temporary
   * addition in case a mission sends the user back here
   * with route.params.earnedPoints.
   */
  const { user, points, coins } = useUser();

  const [bonusPoints, setBonusPoints] = useState(0);

  useEffect(() => {
    const earned = Number(route?.params?.earnedPoints || 0);

    if (earned > 0) {
      setBonusPoints((previous) => previous + earned);

      // Prevent adding the same navigation parameter again
      // if this screen re-renders.
      navigation.setParams({
        earnedPoints: undefined,
      });
    }
  }, [route?.params?.earnedPoints, navigation]);

  const displayedPoints = Number(points || 0) + bonusPoints;

  /*
   * ---------------------------------------------------------
   * MISSION DATA
   * ---------------------------------------------------------
   *
   * This is the single source of truth for the campaign.
   *
   * Status:
   *   completed = finished
   *   current   = available to play
   *   locked    = unavailable
   *
   * You currently have 3 missions.
   */
  // const MAP_MISSIONS = [
  //   {
  //     id: 'GoBag',
  //     level: 1,
  //     title: 'Bug-Out Packing Drill',
  //     desc:
  //       'Optimize custom survival inventories under a strict 15-second window.',
  //     difficulty: 'EASY',
  //     diffColor: '#34D399',
  //     icon: 'briefcase-outline',
  //     reward: 40,
  //     status: 'completed',
  //     tag: 'PREPAREDNESS DRILL',
  //   },
  //   {
  //     id: 'QuizGame',
  //     level: 2,
  //     title: 'Dynamic Response Quiz',
  //     desc:
  //       'Test quick reflexes on civil emergency protocols under time limits.',
  //     difficulty: 'MEDIUM',
  //     diffColor: '#38BDF8',
  //     icon: 'flash-outline',
  //     reward: 50,
  //     status: 'current',
  //     tag: 'CLIMATE CRISIS DRILL',
  //   },
  //   {
  //     id: 'ClimateDefence',
  //     level: 3,
  //     title: 'Climate Defence Simulator',
  //     desc:
  //       'Formulate mitigation blueprints against shifting microclimates.',
  //     difficulty: 'HARD',
  //     diffColor: '#EF4444',
  //     icon: 'globe-outline',
  //     reward: 100,
  //     status: 'locked',
  //     tag: 'ADVANCED RESILIENCE DRILL',
  //   },
  // ];
  const MAP_MISSIONS = [
    {
      id: 'level-1',
      level: 1,
      game: 'ClimateDefence',
      title: 'Climate Defence',
      desc: 'Learn the basics of flood response and evacuation decisions.',
      difficulty: 'EASY',
      diffColor: '#34D399',
      icon: 'cloud-outline',
      reward: 40,
      tag: 'CLIMATE RESPONSE',
    },

    {
      id: 'level-2',
      level: 2,
      game: 'FloodRouting',
      title: 'Flood Routing',
      desc: 'Learn how to choose safer routes during a flood.',
      difficulty: 'EASY',
      diffColor: '#34D399',
      icon: 'water-outline',
      reward: 40,
      tag: 'ROUTE DECISION',
    },

    {
      id: 'level-3',
      level: 3,
      game: 'GoBag',
      title: 'Go-Bag',
      desc: 'Learn which emergency supplies belong in your Go-Bag.',
      difficulty: 'EASY',
      diffColor: '#34D399',
      icon: 'briefcase-outline',
      reward: 40,
      tag: 'PREPAREDNESS BASICS',
    },

    {
      id: 'level-4',
      level: 4,
      game: 'ClimateDefence',
      title: 'Climate Defence',
      desc: 'Respond to a more demanding climate emergency scenario.',
      difficulty: 'MEDIUM',
      diffColor: '#FBBF24',
      icon: 'cloud-outline',
      reward: 60,
      tag: 'CLIMATE RESPONSE',
    },

    {
      id: 'level-5',
      level: 5,
      game: 'FloodRunnerGameModal',
      title: 'Flood Routing',
      desc: 'Navigate increasingly complex flood route decisions.',
      difficulty: 'MEDIUM',
      diffColor: '#FBBF24',
      icon: 'water-outline',
      reward: 60,
      tag: 'ROUTE DECISION',
    },

    {
      id: 'level-6',
      level: 6,
      game: 'GoBag',
      title: 'Go-Bag',
      desc: 'Build an effective emergency kit while managing limited resources.',
      difficulty: 'MEDIUM',
      diffColor: '#FBBF24',
      icon: 'briefcase-outline',
      reward: 60,
      tag: 'RESOURCE MANAGEMENT',
    },

    {
      id: 'level-7',
      level: 7,
      game: 'ClimateDefence',
      title: 'Climate Defence',
      desc: 'Make rapid tactical decisions under pressure.',
      difficulty: 'HARD',
      diffColor: '#EF4444',
      icon: 'cloud-outline',
      reward: 100,
      tag: 'TACTICAL RESPONSE',
    },

    {
      id: 'level-8',
      level: 8,
      game: 'FloodRouting',
      title: 'Flood Routing',
      desc: 'Navigate multiple hazards and changing route conditions.',
      difficulty: 'HARD',
      diffColor: '#EF4444',
      icon: 'water-outline',
      reward: 100,
      tag: 'MULTI-HAZARD',
    },

    {
      id: 'level-9',
      level: 9,
      game: 'GoBag',
      title: 'Go-Bag',
      desc: 'Manage limited resources while preparing for an emergency.',
      difficulty: 'HARD',
      diffColor: '#EF4444',
      icon: 'briefcase-outline',
      reward: 100,
      tag: 'RESOURCE CHALLENGE',
    },

    {
      id: 'level-10',
      game: 'FinalMission',
      level: 10,
      title: 'Preparedness Protocol',
      desc: 'Complete your final preparedness assessment.',
      difficulty: 'FINAL',
      diffColor: '#A855F7',
      icon: 'shield-checkmark-outline',
      reward: 200,
      tag: 'FINAL MISSION',
    },
  ];


  /*
   * ---------------------------------------------------------
   * CAMPAIGN PROGRESS
   * ---------------------------------------------------------
   */
  // const completedLevels = user?.campaign?.completedLevels || [];

  // //const completedMissions = useMemo(() => {
  //   //return MAP_MISSIONS.filter(
  //     //(mission) => mission.status === 'completed'
  //   //).length;
  // //}, [MAP_MISSIONS]);
  // const completedMissions = useMemo(() => {
  //   if(completedLevels.includes(mission.level)) {
  //     return 'completed';
  //   } else if (completedLevels.length === mission.level - 1) {
  //     return 'current';
  //   } else {
  //     return 'locked';
  //   }
  // }, [completedLevels]);

  // const totalMissions = MAP_MISSIONS.length;

  // const progressPercentage =
  //   totalMissions > 0
  //     ? Math.round((completedMissions / totalMissions) * 100)
  //     : 0;
  const completedLevels = user?.campaign?.completedLevels || [];

  const completedMissions = completedLevels.length;

  const totalMissions = MAP_MISSIONS.length;

  const progressPercentage =
    totalMissions > 0
      ? Math.round((completedMissions / totalMissions) * 100)
      : 0;


  /*
   * ---------------------------------------------------------
   * NAVIGATION
   * ---------------------------------------------------------
   *
   * All mission navigation goes through this function.
   * This prevents accidentally navigating to locked missions.
   */
  const openMission = (mission) => {
    if (mission.status === 'locked') {
      return;
    }
    navigation.navigate('ClimateDefence', {
      level: mission.level,
      difficulty: mission.difficulty,
      reward: mission.reward,
    });
    //navigation.navigate(mission.id);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* =====================================================
          USER STATS HEADER
          ===================================================== */}
      <View style={styles.topProfileBar}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={22} color="#38BDF8" />
        </View>

        <View style={styles.profileMeta}>
          <Text style={styles.profileName}>First Responder</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="flash" size={12} color="#F59E0B" />
              <Text style={styles.pointsText}>
                {displayedPoints} XP
              </Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="ellipse" size={9} color="#FBBF24" />
              <Text style={styles.coinsText}>
                {Number(coins || 0)} Coins
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.profileBadgeIcon}>
          <Ionicons
            name="shield-checkmark"
            size={20}
            color="#10B981"
          />
        </View>
      </View>

      {/* =====================================================
          MAIN HEADER
          ===================================================== */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Ionicons
            name="map-outline"
            size={14}
            color="#EC4899"
          />

          <Text style={styles.sectionLabel}>
            CAMPAIGN WORLD MAP
          </Text>
        </View>

        <Text style={styles.mainHeading}>
          Missions Hub
        </Text>

        <Text style={styles.subHeading}>
          Singapore Resilience Drills
        </Text>

        <Text style={styles.description}>
          Progress through tactical sectors, complete crisis
          simulations and build your First Responder certification.
        </Text>
      </View>

      {/* =====================================================
          HOW MISSIONS WORK
          ===================================================== */}
      <View style={styles.instructionCard}>
        <View style={styles.instructionHeader}>
          <Ionicons
            name="information-circle"
            size={20}
            color="#38BDF8"
          />

          <Text style={styles.instructionTitle}>
            How Missions Work
          </Text>
        </View>

        <View style={styles.instructionRow}>
          <Ionicons
            name="flash"
            size={15}
            color="#38BDF8"
          />

          <Text style={styles.instructionText}>
            Complete crisis simulations and rapid-response drills
            to earn{' '}
            <Text style={styles.highlightXp}>
              PrepPoints (XP)
            </Text>{' '}
            and raise your rank.
          </Text>
        </View>

        <View style={styles.instructionRow}>
          <Ionicons
            name="ribbon"
            size={15}
            color="#34D399"
          />

          <Text style={styles.instructionText}>
            Complete harder drills and demonstrate strong
            performance to progress through the campaign.
          </Text>
        </View>

        <View style={styles.instructionRow}>
          <Ionicons
            name="lock-open"
            size={15}
            color="#A855F7"
          />

          <Text style={styles.instructionText}>
            Completing a previous campaign level unlocks the
            next mission.
          </Text>
        </View>
      </View>

      {/* =====================================================
          REWARDS HUB
          ===================================================== */}
      <TouchableOpacity
        style={styles.rewardsLinkBanner}
        onPress={() => navigation.navigate('VoucherStore')}
        activeOpacity={0.85}
      >
        <View style={styles.bannerLeft}>
          <View style={styles.bannerIconBox}>
            <Ionicons
              name="gift-outline"
              size={22}
              color="#34D399"
            />
          </View>

          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerHeaderTitle}>
              Preparedness Rewards Hub
            </Text>

            <Text style={styles.bannerHeaderSub}>
              Redeem preparedness rewards with your points.
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color="#94A3B8"
        />
      </TouchableOpacity>

      {/* =====================================================
          CAMPAIGN MAP
          ===================================================== */}
      <View style={styles.mapSectionHeader}>
        <View>
          <Text style={styles.mapSectionTitle}>
            Survival Journey
          </Text>

          <Text style={styles.mapSectionSubtitle}>
            {completedMissions} of {totalMissions} missions complete
          </Text>
        </View>

        <View style={styles.progressBadge}>
          <Text style={styles.progressBadgeText}>
            {progressPercentage}%
          </Text>
        </View>
      </View>

      <View style={styles.mapContainer}>
        {/* Decorative vertical path */}
        <View style={styles.windingLineBackground} />

        {MAP_MISSIONS.map((mission, index) => {
          const isEven = index % 2 === 0;
          const isLocked = mission.status === 'locked';
          const isCurrent = mission.status === 'current';
          const isCompleted = mission.status === 'completed';

          return (
            <View
              key={mission.id}
              style={[
                styles.nodeRow,
                isEven
                  ? styles.rowLeft
                  : styles.rowRight,
              ]}
            >
              {/* ---------------------------------------------
                  MISSION NODE
                  --------------------------------------------- */}
              <TouchableOpacity
                activeOpacity={isLocked ? 1 : 0.8}
                disabled={isLocked}
                onPress={() => openMission(mission)}
                style={[
                  styles.mapNode,
                  isCurrent && styles.nodeCurrent,
                  isLocked && styles.nodeLocked,
                  {
                    borderColor: isLocked
                      ? '#1E293B'
                      : mission.diffColor,
                  },
                ]}
              >
                {isCompleted && (
                  <View style={styles.statusBadgeCompleted}>
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color="#FFFFFF"
                    />
                  </View>
                )}

                {isLocked && (
                  <View style={styles.statusBadgeLocked}>
                    <Ionicons
                      name="lock-closed"
                      size={12}
                      color="#94A3B8"
                    />
                  </View>
                )}

                <Ionicons
                  name={mission.icon}
                  size={28}
                  color={
                    isLocked
                      ? '#475569'
                      : '#FFFFFF'
                  }
                />

                <Text
                  style={[
                    styles.nodeLevelText,
                    isLocked && styles.nodeLevelLocked,
                  ]}
                >
                  LVL {mission.level}
                </Text>
              </TouchableOpacity>

              {/* ---------------------------------------------
                  MISSION INFORMATION CARD
                  --------------------------------------------- */}
              <View
                style={[
                  styles.nodeCard,
                  isLocked && styles.cardLocked,
                ]}
              >
                <View style={styles.cardHeaderTop}>
                  <View
                    style={[
                      styles.diffTag,
                      {
                        backgroundColor:
                          mission.diffColor + '20',
                        borderColor:
                          mission.diffColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.diffTagText,
                        {
                          color:
                            mission.diffColor,
                        },
                      ]}
                    >
                      {mission.difficulty}
                    </Text>
                  </View>

                  <View style={styles.rewardPill}>
                    <Ionicons
                      name="trophy-outline"
                      size={12}
                      color="#F59E0B"
                    />

                    <Text style={styles.rewardText}>
                      {mission.reward} XP
                    </Text>
                  </View>
                </View>

                <Text style={styles.missionTag}>
                  {mission.tag}
                </Text>

                <Text
                  style={[
                    styles.gameTitle,
                    isLocked && styles.lockedTitle,
                  ]}
                >
                  {mission.title}
                </Text>

                <Text
                  style={[
                    styles.gameDesc,
                    isLocked && styles.lockedDescription,
                  ]}
                >
                  {mission.desc}
                </Text>

                {/* Mission action */}
                {!isLocked ? (
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => openMission(mission)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.playButtonText}>
                      {isCurrent
                        ? 'Play Mission'
                        : 'Replay Mission'}
                    </Text>

                    <Ionicons
                      name="play"
                      size={12}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.lockedContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={13}
                      color="#475569"
                    />

                    <Text style={styles.lockedNotice}>
                      Complete previous level to unlock
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* =====================================================
          CERTIFICATION PROGRESS
          ===================================================== */}
      <View style={styles.campaignCard}>
        <View style={styles.campIconContainer}>
          <Ionicons
            name="ribbon-outline"
            size={28}
            color="#A855F7"
          />
        </View>

        <View style={styles.campaignContent}>
          <Text style={styles.campTitle}>
            First Responder Certificate
          </Text>

          <Text style={styles.campSub}>
            Level {completedMissions} of {totalMissions}{' '}
            Complete ({progressPercentage}%)
          </Text>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercentage}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* =====================================================
          COMPLETION MESSAGE
          ===================================================== */}
      {completedMissions === totalMissions && (
        <View style={styles.completeCard}>
          <Ionicons
            name="checkmark-circle"
            size={24}
            color="#34D399"
          />

          <View style={styles.completeTextContainer}>
            <Text style={styles.completeTitle}>
              Campaign Complete
            </Text>

            <Text style={styles.completeSubtitle}>
              You have completed all available resilience
              missions.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },

  /* =========================================================
     PROFILE
     ========================================================= */

  topProfileBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 10,
    marginTop: 40,
    marginBottom: 18,
  },

  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },

  profileMeta: {
    flex: 1,
    marginLeft: 12,
  },

  profileName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 3,
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  pointsText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '800',
  },

  coinsText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '800',
  },

  profileBadgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#064E3B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* =========================================================
     HEADER
     ========================================================= */

  header: {
    paddingTop: 4,
    marginBottom: 18,
    alignItems: 'center',
  },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },

  sectionLabel: {
    color: '#EC4899',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  mainHeading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },

  subHeading: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },

  description: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 7,
    paddingHorizontal: 18,
  },

  /* =========================================================
     HOW MISSIONS WORK
     ========================================================= */

  instructionCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },

  instructionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginBottom: 9,
  },

  instructionText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 18,
  },

  highlightXp: {
    color: '#38BDF8',
    fontWeight: '800',
  },

  /* =========================================================
     REWARDS
     ========================================================= */

  rewardsLinkBanner: {
    flexDirection: 'row',
    backgroundColor: '#064E3B',
    borderWidth: 1,
    borderColor: '#059669',
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  bannerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bannerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },

  bannerHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  bannerHeaderSub: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 2,
  },

  /* =========================================================
     MAP HEADER
     ========================================================= */

  mapSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  mapSectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
  },

  mapSectionSubtitle: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },

  progressBadge: {
    backgroundColor: '#1E1B4B',
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  progressBadgeText: {
    color: '#C084FC',
    fontSize: 11,
    fontWeight: '900',
  },

  /* =========================================================
     MAP
     ========================================================= */

  mapContainer: {
    position: 'relative',
    gap: 32,
    marginBottom: 28,
  },

  windingLineBackground: {
    position: 'absolute',
    top: 30,
    bottom: 30,
    left: '50%',
    width: 4,
    backgroundColor: '#1E293B',
    transform: [{ translateX: -2 }],
    borderRadius: 2,
    zIndex: -1,
  },

  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  rowLeft: {
    flexDirection: 'row',
  },

  rowRight: {
    flexDirection: 'row-reverse',
  },

  mapNode: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0F172A',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#FFFFFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },

  nodeCurrent: {
    backgroundColor: '#484B1B',
    transform: [{ scale: 1.08 }],
  },

  nodeLocked: {
    backgroundColor: '#090D16',
    borderColor: '#1E293B',
    shadowOpacity: 0,
  },

  nodeLevelText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    position: 'absolute',
    bottom: 6,
  },

  nodeLevelLocked: {
    color: '#475569',
  },

  statusBadgeCompleted: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#10B981',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#020617',
    zIndex: 5,
  },

  statusBadgeLocked: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#1E293B',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#020617',
    zIndex: 5,
  },

  /* =========================================================
     MISSION CARDS
     ========================================================= */

  nodeCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 20,
    padding: 14,
  },

  cardLocked: {
    backgroundColor: '#070A12',
    borderColor: '#111827',
  },

  cardHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },

  diffTag: {
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },

  diffTagText: {
    fontSize: 9,
    fontWeight: '800',
  },

  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  rewardText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '700',
  },

  missionTag: {
    color: '#64748B',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 4,
  },

  gameTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },

  lockedTitle: {
    color: '#64748B',
  },

  gameDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },

  lockedDescription: {
    color: '#475569',
  },

  playButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },

  playButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  lockedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },

  lockedNotice: {
    color: '#475569',
    fontSize: 10,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  /* =========================================================
     CERTIFICATE
     ========================================================= */

  campaignCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  campIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2E1065',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  campaignContent: {
    flex: 1,
  },

  campTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  campSub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },

  progressBar: {
    height: 5,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#A855F7',
    borderRadius: 3,
  },

  /* =========================================================
     COMPLETION
     ========================================================= */

  completeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    borderWidth: 1,
    borderColor: '#059669',
    borderRadius: 16,
    padding: 15,
  },

  completeTextContainer: {
    flex: 1,
    marginLeft: 10,
  },

  completeTitle: {
    color: '#34D399',
    fontSize: 14,
    fontWeight: '800',
  },

  completeSubtitle: {
    color: '#A7F3D0',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
});