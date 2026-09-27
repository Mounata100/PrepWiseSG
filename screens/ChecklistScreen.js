import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import * as Haptics from 'expo-haptics';

/*
|--------------------------------------------------------------------------
| DAILY PREPAREDNESS CHECKLIST
|--------------------------------------------------------------------------
| Each checklist item:
| - Has a unique ID
| - Has a title
| - Has a description
| - Has an icon
| - Has an XP reward
|
| IMPORTANT:
| Completion is stored against today's date inside user.checklistProgress.
| This prevents users from repeatedly claiming XP for the same item.
|--------------------------------------------------------------------------
*/

const DAILY_CHECKLIST = [
  {
    id: 'water_buffer',
    title: 'Check Emergency Water',
    description:
      'Make sure your household has an adequate supply of drinking and basic-use water.',
    icon: 'water-outline',
    color: '#38BDF8',
    xp: 20,
  },
  {
    id: 'go_bag',
    title: 'Inspect Your Go-Bag',
    description:
      'Check that your emergency bag contains essential supplies and is ready to deploy.',
    icon: 'briefcase-outline',
    color: '#10B981',
    xp: 25,
  },
  {
    id: 'power_bank',
    title: 'Charge Emergency Power',
    description:
      'Confirm your power bank or backup battery is charged and ready for a blackout.',
    icon: 'battery-charging-outline',
    color: '#FACC15',
    xp: 15,
  },
  {
    id: 'flashlight',
    title: 'Check Your Flashlight',
    description:
      'Verify that your flashlight works and has sufficient battery power.',
    icon: 'flashlight-outline',
    color: '#F59E0B',
    xp: 15,
  },
  {
    id: 'emergency_contacts',
    title: 'Review Emergency Contacts',
    description:
      'Make sure important family and emergency contact numbers are current.',
    icon: 'call-outline',
    color: '#A78BFA',
    xp: 20,
  },
  {
    id: 'family_meetup',
    title: 'Confirm Family Meeting Point',
    description:
      'Review your household emergency rendezvous point and make sure everyone knows it.',
    icon: 'location-outline',
    color: '#FB7185',
    xp: 20,
  },
  {
    id: 'weather_alerts',
    title: 'Check Emergency Alerts',
    description:
      'Review current alerts and make sure emergency notifications are enabled.',
    icon: 'notifications-outline',
    color: '#F97316',
    xp: 15,
  },
  {
    id: 'first_aid',
    title: 'Inspect First-Aid Kit',
    description:
      'Check that your first-aid supplies are present, usable, and not expired.',
    icon: 'medkit-outline',
    color: '#EF4444',
    xp: 20,
  },
];

/*
|--------------------------------------------------------------------------
| DATE HELPER
|--------------------------------------------------------------------------
| Using local calendar date rather than a timestamp prevents a checklist
| from accidentally changing because of timezone conversion.
|--------------------------------------------------------------------------
*/

const getLocalDateKey = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export default function ChecklistScreen({ navigation }) {
  const { user, updateUser } = useUser();

  const todayKey = getLocalDateKey();

  /*
  |--------------------------------------------------------------------------
  | STORED CHECKLIST STATE
  |--------------------------------------------------------------------------
  |
  | Expected structure:
  |
  | checklistProgress: {
  |   "2026-09-24": {
  |      water_buffer: true,
  |      go_bag: true
  |   }
  | }
  |
  */

  const checklistProgress = user?.checklistProgress || {};
  const todayProgress = checklistProgress[todayKey] || {};

  const [processingId, setProcessingId] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | CALCULATE PROGRESS
  |--------------------------------------------------------------------------
  */

  const completedCount = useMemo(() => {
    return DAILY_CHECKLIST.filter(
      item => todayProgress[item.id] === true
    ).length;
  }, [todayProgress]);

  const totalItems = DAILY_CHECKLIST.length;

  const totalPossibleXP = useMemo(() => {
    return DAILY_CHECKLIST.reduce((sum, item) => sum + item.xp, 0);
  }, []);

  const earnedXP = useMemo(() => {
    return DAILY_CHECKLIST.reduce((sum, item) => {
      return todayProgress[item.id] ? sum + item.xp : sum;
    }, 0);
  }, [todayProgress]);

  const progressPercentage =
    totalItems > 0
      ? Math.round((completedCount / totalItems) * 100)
      : 0;

  const isComplete = completedCount === totalItems;

  const handleBackToHome = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('HomeScreen');
    }
  };


  /*
  |--------------------------------------------------------------------------
  | COMPLETE CHECKLIST ITEM
  |--------------------------------------------------------------------------
  |
  | This is the important production behaviour:
  |
  | 1. Check whether item was already completed today.
  | 2. If yes, do nothing.
  | 3. Award XP exactly once.
  | 4. Persist completion.
  |
  |--------------------------------------------------------------------------
  */

  const handleToggleItem = async item => {
    if (processingId) return;

    const alreadyCompleted = todayProgress[item.id] === true;

    /*
    |--------------------------------------------------------------------------
    | Prevent duplicate rewards
    |--------------------------------------------------------------------------
    */

    if (alreadyCompleted) {
      return;
    }

    try {
      setProcessingId(item.id);

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      const updatedTodayProgress = {
        ...todayProgress,
        [item.id]: true,
      };

      const updatedChecklistProgress = {
        ...checklistProgress,
        [todayKey]: updatedTodayProgress,
      };

      const currentPoints = user?.points || 0;

      /*
      |--------------------------------------------------------------------------
      | Update user
      |--------------------------------------------------------------------------
      */

      if (typeof updateUser === 'function') {
        updateUser({
          ...user,
          points: currentPoints + item.xp,
          checklistProgress: updatedChecklistProgress,
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Completion feedback
      |--------------------------------------------------------------------------
      */

      Alert.alert(
        'Checklist Item Complete',
        `${item.title}\n\n+${item.xp} XP added to your preparedness score.`,
        [{ text: 'Continue' }]
      );
    } catch (error) {
      console.error(
        'Checklist completion error:',
        error
      );
    } finally {
      setProcessingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | COMPLETE ALL REMAINING ITEMS
  |--------------------------------------------------------------------------
  |
  | This is intentionally optional.
  | It gives the user a convenient way to complete multiple checklist
  | actions after they have physically done them.
  |
  | Every individual item's XP is still calculated separately.
  |--------------------------------------------------------------------------
  */

  const handleCompleteRemaining = async () => {
    if (processingId || isComplete) return;

    const remainingItems = DAILY_CHECKLIST.filter(
      item => !todayProgress[item.id]
    );

    if (remainingItems.length === 0) return;

    const remainingXP = remainingItems.reduce(
      (sum, item) => sum + item.xp,
      0
    );

    Alert.alert(
      'Complete Remaining Items?',
      `This will mark all ${remainingItems.length} remaining checklist items as completed and award +${remainingXP} XP.\n\nOnly use this after you have actually completed the listed preparedness checks.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              setProcessingId('all');

              const completedToday = {
                ...todayProgress,
              };

              remainingItems.forEach(item => {
                completedToday[item.id] = true;
              });

              const updatedChecklistProgress = {
                ...checklistProgress,
                [todayKey]: completedToday,
              };

              const currentPoints = user?.points || 0;

              if (typeof updateUser === 'function') {
                updateUser({
                  ...user,
                  points: currentPoints + remainingXP,
                  checklistProgress: updatedChecklistProgress,
                });
              }

              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );

              Alert.alert(
                'Daily Checklist Complete!',
                `Excellent work. You completed all remaining preparedness checks and earned +${remainingXP} XP.`,
                [{ text: 'Done' }]
              );
            } catch (error) {
              console.error(
                'Complete remaining checklist error:',
                error
              );
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      {/* =========================================================
          HEADER
      ========================================================= */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToHome}
          activeOpacity={0.8}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>
            Daily Checklist
          </Text>

          <Text style={styles.headerSubtitle}>
            Preparedness Readiness
          </Text>
        </View>

        <View style={styles.headerXP}>
          <Ionicons
            name="flash"
            size={16}
            color="#38BDF8"
          />

          <Text style={styles.headerXPText}>
            +{earnedXP}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* =======================================================
            DAILY SUMMARY
        ======================================================= */}

        <View style={styles.summaryCard}>

          <View style={styles.summaryTopRow}>

            <View>
              <Text style={styles.summaryLabel}>
                TODAY'S READINESS
              </Text>

              <Text style={styles.summaryTitle}>
                {completedCount}/{totalItems} Checks Complete
              </Text>
            </View>

            <View
              style={[
                styles.progressCircle,
                isComplete && styles.progressCircleComplete,
              ]}
            >
              <Text
                style={[
                  styles.progressPercentage,
                  isComplete &&
                    styles.progressPercentageComplete,
                ]}
              >
                {progressPercentage}%
              </Text>
            </View>

          </View>

          {/* Progress bar */}

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercentage}%`,
                },
              ]}
            />
          </View>

          <View style={styles.summaryBottomRow}>

            <View>
              <Text style={styles.summaryMetricLabel}>
                XP EARNED
              </Text>

              <Text style={styles.summaryMetricValue}>
                +{earnedXP} XP
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View>
              <Text style={styles.summaryMetricLabel}>
                AVAILABLE
              </Text>

              <Text style={styles.summaryMetricValue}>
                +{totalPossibleXP} XP
              </Text>
            </View>

          </View>
        </View>

        {/* =======================================================
            COMPLETE STATE
        ======================================================= */}

        {isComplete && (
          <View style={styles.completeBanner}>

            <View style={styles.completeIcon}>
              <Ionicons
                name="checkmark"
                size={22}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.completeTextContainer}>
              <Text style={styles.completeTitle}>
                Daily Checklist Complete
              </Text>

              <Text style={styles.completeSubtitle}>
                Your preparedness checks are up to date.
              </Text>
            </View>

          </View>
        )}

        {/* =======================================================
            SECTION HEADER
        ======================================================= */}

        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>
              Preparedness Checks
            </Text>

            <Text style={styles.sectionSubtitle}>
              Complete each check once per day
            </Text>
          </View>

          {!isComplete && (
            <TouchableOpacity
              onPress={handleCompleteRemaining}
              disabled={processingId !== null}
              activeOpacity={0.8}
            >
              <Text style={styles.completeAllText}>
                Complete All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* =======================================================
            CHECKLIST
        ======================================================= */}

        <View style={styles.checklistContainer}>

          {DAILY_CHECKLIST.map((item, index) => {

            const completed =
              todayProgress[item.id] === true;

            const isProcessing =
              processingId === item.id ||
              processingId === 'all';

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.checklistItem,
                  completed &&
                    styles.checklistItemCompleted,
                  index === DAILY_CHECKLIST.length - 1 &&
                    styles.lastChecklistItem,
                ]}
                activeOpacity={0.8}
                disabled={completed || isProcessing}
                onPress={() => handleToggleItem(item)}
              >

                {/* Icon */}

                <View
                  style={[
                    styles.itemIcon,
                    {
                      backgroundColor: `${item.color}18`,
                    },
                    completed && {
                      backgroundColor: '#064E3B',
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      completed
                        ? 'checkmark'
                        : item.icon
                    }
                    size={23}
                    color={
                      completed
                        ? '#34D399'
                        : item.color
                    }
                  />
                </View>

                {/* Text */}

                <View style={styles.itemContent}>

                  <Text
                    style={[
                      styles.itemTitle,
                      completed &&
                        styles.itemTitleCompleted,
                    ]}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={[
                      styles.itemDescription,
                      completed &&
                        styles.itemDescriptionCompleted,
                    ]}
                  >
                    {item.description}
                  </Text>

                </View>

                {/* XP / Check */}

                <View style={styles.itemRewardContainer}>

                  {completed ? (
                    <View style={styles.completedBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color="#10B981"
                      />
                    </View>
                  ) : (
                    <Text style={styles.itemXP}>
                      +{item.xp}
                    </Text>
                  )}

                </View>

              </TouchableOpacity>
            );
          })}

        </View>

        {/* =======================================================
            INFORMATION CARD
        ======================================================= */}

        <View style={styles.infoCard}>

          <View style={styles.infoIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color="#38BDF8"
            />
          </View>

          <View style={styles.infoContent}>

            <Text style={styles.infoTitle}>
              Daily readiness matters
            </Text>

            <Text style={styles.infoText}>
              Checklist rewards are issued once per item each
              day. Your progress is saved automatically and a
              fresh checklist becomes available on the next day.
            </Text>

          </View>

        </View>

        <View style={styles.bottomSpacing} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 16,
  },

  /*
  |--------------------------------------------------------------------------
  | HEADER
  |--------------------------------------------------------------------------
  */

  header: {
    paddingTop: 48,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },

  headerSubtitle: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
  },

  headerXP: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },

  headerXPText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 4,
  },

  /*
  |--------------------------------------------------------------------------
  | SCROLL
  |--------------------------------------------------------------------------
  */

  scrollContent: {
    paddingBottom: 30,
  },

  /*
  |--------------------------------------------------------------------------
  | SUMMARY
  |--------------------------------------------------------------------------
  */

  summaryCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },

  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 5,
  },

  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  progressCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617',
  },

  progressCircleComplete: {
    borderColor: '#10B981',
    backgroundColor: '#052E2B',
  },

  progressPercentage: {
    color: '#38BDF8',
    fontSize: 15,
    fontWeight: '900',
  },

  progressPercentageComplete: {
    color: '#34D399',
  },

  progressTrack: {
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 18,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 4,
  },

  summaryBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },

  summaryMetricLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  summaryMetricValue: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 3,
  },

  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
  },

  /*
  |--------------------------------------------------------------------------
  | COMPLETE BANNER
  |--------------------------------------------------------------------------
  */

  completeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#052E2B',
    borderWidth: 1,
    borderColor: '#065F46',
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
  },

  completeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },

  completeTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  completeTitle: {
    color: '#34D399',
    fontSize: 13,
    fontWeight: '900',
  },

  completeSubtitle: {
    color: '#6EE7B7',
    fontSize: 11,
    marginTop: 2,
  },

  /*
  |--------------------------------------------------------------------------
  | SECTION HEADER
  |--------------------------------------------------------------------------
  */

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  sectionSubtitle: {
    color: '#475569',
    fontSize: 10,
    marginTop: 3,
  },

  completeAllText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '900',
  },

  /*
  |--------------------------------------------------------------------------
  | CHECKLIST
  |--------------------------------------------------------------------------
  */

  checklistContainer: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 18,
    overflow: 'hidden',
  },

  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    minHeight: 92,
  },

  checklistItemCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.045)',
  },

  lastChecklistItem: {
    borderBottomWidth: 0,
  },

  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemContent: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },

  itemTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },

  itemTitleCompleted: {
    color: '#34D399',
  },

  itemDescription: {
    color: '#64748B',
    fontSize: 10.5,
    lineHeight: 15,
  },

  itemDescriptionCompleted: {
    color: '#4B806E',
  },

  itemRewardContainer: {
    minWidth: 38,
    alignItems: 'flex-end',
  },

  itemXP: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '900',
  },

  completedBadge: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  /*
  |--------------------------------------------------------------------------
  | INFORMATION
  |--------------------------------------------------------------------------
  */

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#0B1220',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginTop: 18,
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#0C2940',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoContent: {
    flex: 1,
    marginLeft: 11,
  },

  infoTitle: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },

  infoText: {
    color: '#64748B',
    fontSize: 10.5,
    lineHeight: 16,
  },

  bottomSpacing: {
    height: 30,
  },
});
