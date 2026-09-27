// // =========================================================
// // PREPWISE SG: PRODUCTION SITUATED LEARNING ENGINE
// // Features: Auto-Shuffle, Clean Lifecycle Controls, Step-by-Step Walkthroughs
// // =========================================================
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';
import { useNavigation, useRoute } from '@react-navigation/native';

/*
|--------------------------------------------------------------------------
| GO-BAG SCENARIOS
|--------------------------------------------------------------------------
|
| Each scenario defines:
|
| criticalItems
|   Items that should be packed.
|
| recommendedItems
|   Useful items that improve the score but are not essential.
|
| avoidItems
|   Items that are less useful for this particular scenario.
|
| steps
|   Used during the educational debrief.
|
*/

const SCENARIOS = [
  {
    id: 'flash_flood',
    name: 'FLASH FLOOD RESPONSE',
    location: 'Urban evacuation scenario',
    desc:
      'Flooding is affecting access routes. Prepare a compact evacuation go-bag with essential supplies, medical items and communication equipment.',
    criticalItems: [
      'water',
      'meds',
      'docs',
      'flashlight',
      'phone',
    ],
    recommendedItems: [
      'whistle',
      'food',
    ],
    avoidItems: [
      'mask',
    ],
    steps: [
      {
        id: 'water',
        title: 'Secure drinking water',
        body:
          'Safe drinking water is a core emergency requirement. Flooding can disrupt normal water access and may affect water quality.',
      },
      {
        id: 'meds',
        title: 'Pack essential medication',
        body:
          'Regular medication should be included when required. Emergency evacuation can make normal access to medication difficult.',
      },
      {
        id: 'docs',
        title: 'Protect important documents',
        body:
          'Important identification and emergency documents should be protected from water damage and kept accessible during evacuation.',
      },
      {
        id: 'flashlight',
        title: 'Carry a reliable light',
        body:
          'A flashlight provides an independent source of light if electricity is interrupted or visibility becomes poor.',
      },
      {
        id: 'phone',
        title: 'Maintain communication capability',
        body:
          'A charged power bank helps keep communication devices operational when access to mains electricity is unavailable.',
      },
    ],
  },

  {
    id: 'haze',
    name: 'HAZE RESPONSE',
    location: 'Air-quality emergency scenario',
    desc:
      'Air quality has deteriorated significantly. Prepare a go-bag that supports communication, medication needs and protection from particulate exposure.',
    criticalItems: [
      'mask',
      'water',
      'meds',
      'phone',
      'docs',
    ],
    recommendedItems: [
      'food',
    ],
    avoidItems: [
      'whistle',
      'flashlight',
    ],
    steps: [
      {
        id: 'mask',
        title: 'Prepare respiratory protection',
        body:
          'A suitable respirator can reduce exposure to fine particulate matter during poor air-quality conditions.',
      },
      {
        id: 'water',
        title: 'Maintain hydration',
        body:
          'Adequate drinking water remains an important preparedness item during extended periods away from home.',
      },
      {
        id: 'meds',
        title: 'Carry required medication',
        body:
          'People who rely on regular medication should include an appropriate supply in their emergency preparation.',
      },
      {
        id: 'phone',
        title: 'Maintain communications',
        body:
          'A power bank can extend the operating time of a phone so that emergency information and communications remain accessible.',
      },
      {
        id: 'docs',
        title: 'Protect essential information',
        body:
          'Important documents and identification should remain accessible if evacuation or relocation becomes necessary.',
      },
    ],
  },

  {
    id: 'power_outage',
    name: 'POWER OUTAGE RESPONSE',
    location: 'Extended utility disruption',
    desc:
      'A prolonged power interruption has affected the area. Build a practical go-bag while keeping within the available weight limit.',
    criticalItems: [
      'flashlight',
      'phone',
      'water',
      'meds',
      'food',
    ],
    recommendedItems: [
      'docs',
      'whistle',
    ],
    avoidItems: [
      'mask',
    ],
    steps: [
      {
        id: 'flashlight',
        title: 'Prepare independent lighting',
        body:
          'A flashlight provides immediate lighting without relying on the electrical grid.',
      },
      {
        id: 'phone',
        title: 'Preserve communication capability',
        body:
          'A power bank can help maintain access to communications and emergency information.',
      },
      {
        id: 'water',
        title: 'Maintain basic supplies',
        body:
          'Drinking water should remain part of emergency preparations during service disruptions.',
      },
      {
        id: 'meds',
        title: 'Pack essential medication',
        body:
          'Required medication should be available even when normal household routines are disrupted.',
      },
      {
        id: 'food',
        title: 'Prepare emergency food',
        body:
          'Ready-to-eat food can reduce dependence on normal cooking and food-storage arrangements during an outage.',
      },
    ],
  },
];

/*
|--------------------------------------------------------------------------
| GO-BAG EQUIPMENT
|--------------------------------------------------------------------------
*/

const GO_BAG_ITEMS = [
  {
    id: 'water',
    name: 'Drinking Water',
    shortName: 'Water',
    icon: 'water-outline',
    group: 'Essential',
    weight: 3,
  },
  {
    id: 'food',
    name: 'Emergency Food',
    shortName: 'Food',
    icon: 'fast-food-outline',
    group: 'Essential',
    weight: 1,
  },
  {
    id: 'meds',
    name: 'Essential Medication',
    shortName: 'Medication',
    icon: 'medkit-outline',
    group: 'Medical',
    weight: 0.5,
  },
  {
    id: 'docs',
    name: 'Important Documents',
    shortName: 'Documents',
    icon: 'document-text-outline',
    group: 'Information',
    weight: 0.2,
  },
  {
    id: 'flashlight',
    name: 'Flashlight',
    shortName: 'Flashlight',
    icon: 'flashlight-outline',
    group: 'Utility',
    weight: 0.5,
  },
  {
    id: 'mask',
    name: 'Respirator Mask',
    shortName: 'Mask',
    icon: 'shield-outline',
    group: 'Protection',
    weight: 0.1,
  },
  {
    id: 'phone',
    name: 'Power Bank',
    shortName: 'Power Bank',
    icon: 'battery-charging-outline',
    group: 'Communication',
    weight: 0.4,
  },
  {
    id: 'whistle',
    name: 'Emergency Whistle',
    shortName: 'Whistle',
    icon: 'megaphone-outline',
    group: 'Signalling',
    weight: 0.1,
  },
];

/*
|--------------------------------------------------------------------------
| DIFFICULTY CONFIGURATION
|--------------------------------------------------------------------------
*/

const DIFFICULTY_CONFIG = {
  EASY: {
    time: 30,
    capacity: 6,
    itemCount: 8,
    title: 'EASY',
    description:
      'Build a basic emergency loadout. Capacity is generous and the time limit is forgiving.',
  },

  MEDIUM: {
    time: 22,
    capacity: 5,
    itemCount: 8,
    title: 'MEDIUM',
    description:
      'Prioritise essential equipment while managing a tighter weight limit.',
  },

  HARD: {
    time: 15,
    capacity: 4,
    itemCount: 8,
    title: 'HARD',
    description:
      'Make rapid decisions under restricted capacity and a short response window.',
  },
};

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled;
}

function getDifficultyConfig(difficulty) {
  return (
    DIFFICULTY_CONFIG[String(difficulty || 'EASY').toUpperCase()] ||
    DIFFICULTY_CONFIG.EASY
  );
}

/*
|--------------------------------------------------------------------------
| SCREEN
|--------------------------------------------------------------------------
*/

export default function GoBagScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const userContext = useUser();

  const updatePoints = userContext?.updatePoints;
  const addBadge = userContext?.addBadge;

  const { triggerConfetti } = useGame();

  /*
  |--------------------------------------------------------------------------
  | MISSION PARAMETERS
  |--------------------------------------------------------------------------
  |
  | MissionsScreen can navigate here with:
  |
  | navigation.navigate('GoBag', {
  |   level: mission.level,
  |   difficulty: mission.difficulty,
  |   reward: mission.reward,
  | });
  |
  */

  const missionLevel = Number(route?.params?.level || 3);

  const missionDifficulty = String(
    route?.params?.difficulty || 'EASY'
  ).toUpperCase();

  const missionReward = Number(
    route?.params?.reward || 40
  );

  const difficultyConfig =
    getDifficultyConfig(missionDifficulty);

  /*
  |--------------------------------------------------------------------------
  | GAME STATE
  |--------------------------------------------------------------------------
  */

  const [gameState, setGameState] =
    useState('onboarding');

  const [scenarioIndex, setScenarioIndex] =
    useState(0);

  const [currentScenario, setCurrentScenario] =
    useState(SCENARIOS[scenarioIndex]);

  const [items, setItems] = useState([]);

  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] =
    useState(difficultyConfig.time);

  const [currentWeight, setCurrentWeight] =
    useState(0);

  const [submitted, setSubmitted] =
    useState(false);

  const [resultSummary, setResultSummary] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | ANIMATION REFS
  |--------------------------------------------------------------------------
  */

  const pulseAnim =
    useRef(new Animated.Value(1)).current;

  const timerAnim =
    useRef(new Animated.Value(1)).current;

  /*
  |--------------------------------------------------------------------------
  | DERIVED VALUES
  |--------------------------------------------------------------------------
  */

  const progressPercentage = useMemo(() => {
    if (!difficultyConfig.capacity) {
      return 0;
    }

    return Math.min(
      100,
      (currentWeight /
        difficultyConfig.capacity) *
        100
    );
  }, [
    currentWeight,
    difficultyConfig.capacity,
  ]);

  const selectedItems = useMemo(
    () => items.filter((item) => item.selected),
    [items]
  );

  const selectedItemIds = useMemo(
    () =>
      selectedItems.map(
        (item) => item.id
      ),
    [selectedItems]
  );

  /*
  |--------------------------------------------------------------------------
  | INITIALISE SCENARIO
  |--------------------------------------------------------------------------
  */

  // const initialiseScenario = (
  //   index = scenarioIndex
  // ) => {
  //   const scenario =
  //     SCENARIOS[index];

  //   setCurrentScenario(scenario);

  //   const shuffled =
  //     shuffleArray(GO_BAG_ITEMS).map(
  //       (item) => ({
  //         ...item,
  //         selected: false,
  //       })
  //     );

  //   setItems(shuffled);

  //   setScore(0);

  //   setCurrentWeight(0);

  //   setTimeLeft(
  //     difficultyConfig.time
  //   );

  //   setSubmitted(false);

  //   setResultSummary(null);

  //   setGameState('playing');

  //   timerAnim.setValue(1);

  //   Animated.timing(timerAnim, {
  //     toValue: 0,
  //     duration:
  //       difficultyConfig.time *
  //       1000,
  //     useNativeDriver: false,
  //   }).start();

  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(
  //         pulseAnim,
  //         {
  //           toValue: 1.015,
  //           duration: 500,
  //           useNativeDriver: true,
  //         }
  //       ),
  //       Animated.timing(
  //         pulseAnim,
  //         {
  //           toValue: 1,
  //           duration: 500,
  //           useNativeDriver: true,
  //         }
  //       ),
  //     ])
  //   ).start();
  // };
  const initialiseScenario = () => {
    const scenario = SCENARIOS[scenarioIndex];

    setCurrentScenario(scenario);

    const shuffled = shuffleArray(GO_BAG_ITEMS).map(
      (item) => ({
        ...item,
        selected: false,
      })
    );

    setItems(shuffled);
    setScore(0);
    setCurrentWeight(0);
    setTimeLeft(difficultyConfig.time);
    setSubmitted(false);
    setResultSummary(null);
    setGameState('playing');

    timerAnim.setValue(1);

    Animated.timing(timerAnim, {
      toValue: 0,
      duration: difficultyConfig.time * 1000,
      useNativeDriver: false,
    }).start();
  };


  /*
  |--------------------------------------------------------------------------
  | START GAME
  |--------------------------------------------------------------------------
  */

  const startGame = () => {
    initialiseScenario();
  };

  /*
  |--------------------------------------------------------------------------
  | TIMER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let timerId = null;

    if (gameState === 'playing') {
      timerId = setInterval(() => {
        setTimeLeft((previous) => {
          if (previous <= 1) {
            clearInterval(timerId);

            setGameState(
              'review'
            );

            return 0;
          }

          return previous - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [gameState]);

  /*
  |--------------------------------------------------------------------------
  | STOP ANIMATIONS WHEN GAME LEAVES PLAYING STATE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (gameState !== 'playing') {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);

      timerAnim.stopAnimation();
    }
  }, [
    gameState,
    pulseAnim,
    timerAnim,
  ]);

  /*
  |--------------------------------------------------------------------------
  | PACK / UNPACK ITEM
  |--------------------------------------------------------------------------
  */

  const toggleItem = (id) => {
    if (gameState !== 'playing') {
      return;
    }

    const target =
      items.find(
        (item) => item.id === id
      );

    if (!target) {
      return;
    }

    const isSelecting =
      !target.selected;

    /*
    |--------------------------------------------------------------------------
    | CAPACITY CHECK
    |--------------------------------------------------------------------------
    */

    if (
      isSelecting &&
      currentWeight +
        target.weight >
        difficultyConfig.capacity
    ) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE ITEMS
    |--------------------------------------------------------------------------
    */

    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              selected:
                isSelecting,
            }
          : item
      )
    );

    /*
    |--------------------------------------------------------------------------
    | UPDATE WEIGHT
    |--------------------------------------------------------------------------
    */

    setCurrentWeight(
      (previous) =>
        Math.max(
          0,
          isSelecting
            ? previous +
                target.weight
            : previous -
                target.weight
        )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT LOADOUT
  |--------------------------------------------------------------------------
  */

  const submitLoadout = () => {
    if (
      gameState !== 'playing' ||
      submitted
    ) {
      return;
    }

    setSubmitted(true);

    const selectedIds =
      selectedItemIds;

    const criticalSelected =
      currentScenario.criticalItems.filter(
        (id) =>
          selectedIds.includes(id)
      );

    const criticalMissed =
      currentScenario.criticalItems.filter(
        (id) =>
          !selectedIds.includes(id)
      );

    const recommendedSelected =
      currentScenario.recommendedItems.filter(
        (id) =>
          selectedIds.includes(id)
      );

    const unnecessarySelected =
      currentScenario.avoidItems.filter(
        (id) =>
          selectedIds.includes(id)
      );

    /*
    |--------------------------------------------------------------------------
    | SCORE CALCULATION
    |--------------------------------------------------------------------------
    |
    | Critical item:
    | +20
    |
    | Recommended item:
    | +10
    |
    | Unnecessary item:
    | -5
    |
    | Missed critical:
    | no direct negative score
    |
    | This means the player is rewarded for
    | making good choices rather than merely
    | being punished for every mistake.
    */

    let calculatedScore = 0;

    calculatedScore +=
      criticalSelected.length * 20;

    calculatedScore +=
      recommendedSelected.length * 10;

    calculatedScore -=
      unnecessarySelected.length * 5;

    calculatedScore = Math.max(
      0,
      calculatedScore
    );

    /*
    |--------------------------------------------------------------------------
    | TIME BONUS
    |--------------------------------------------------------------------------
    */

    let timeBonus = 0;

    if (timeLeft >= 10) {
      timeBonus = 10;
    } else if (timeLeft >= 5) {
      timeBonus = 5;
    }

    calculatedScore += timeBonus;

    /*
    |--------------------------------------------------------------------------
    | PERFECT LOADOUT
    |--------------------------------------------------------------------------
    */

    const allCriticalPacked =
      criticalMissed.length === 0;

    const noUnnecessaryItems =
      unnecessarySelected.length === 0;

    const mastered =
      allCriticalPacked &&
      noUnnecessaryItems;

    const finalScore =
      Math.max(
        0,
        calculatedScore
      );

    setScore(finalScore);

    setResultSummary({
      criticalSelected,
      criticalMissed,
      recommendedSelected,
      unnecessarySelected,
      timeBonus,
      mastered,
    });

    setGameState('review');
  };

  /*
  |--------------------------------------------------------------------------
  | COMPLETE MISSION
  |--------------------------------------------------------------------------
  */

  const completeMission = () => {
    const finalScore =
      Number(score || 0);

    if (
      typeof updatePoints ===
      'function'
    ) {
      updatePoints(
        finalScore +
          missionReward
      );
    }

    if (
      resultSummary?.mastered &&
      typeof addBadge ===
        'function'
    ) {
      addBadge(
        'go_bag_master'
      );

      if (
        typeof triggerConfetti ===
        'function'
      ) {
        triggerConfetti();
      }
    }

    setGameState('finished');
  };

  /*
  |--------------------------------------------------------------------------
  | NEXT SCENARIO
  |--------------------------------------------------------------------------
  */

  // const nextScenario = () => {
  //   const nextIndex =
  //     (scenarioIndex + 1) %
  //     SCENARIOS.length;

  //   setScenarioIndex(
  //     nextIndex
  //   );

  //   initialiseScenario(
  //     nextIndex
  //   );
  // };

  /*
  |--------------------------------------------------------------------------
  | RETRY CURRENT SCENARIO
  |--------------------------------------------------------------------------
  */

  const retryScenario = () => {
    initialiseScenario(
      scenarioIndex
    );
  };

  /*
  |--------------------------------------------------------------------------
  | ITEM LOOKUP
  |--------------------------------------------------------------------------
  */

  const getItemName = (id) => {
    const item =
      GO_BAG_ITEMS.find(
        (entry) =>
          entry.id === id
      );

    return item
      ? item.name
      : id;
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <View style={styles.container}>
      {/* =====================================================
          HEADER
          ===================================================== */}

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
          activeOpacity={0.8}
        >
          <Ionicons
            name="close"
            size={23}
            color="#94A3B8"
          />
        </TouchableOpacity>

        <View style={styles.topBarCenter}>
          <Text
            style={
              styles.topBarTitle
            }
          >
            GO-BAG DRILL
          </Text>

          <Text
            style={
              styles.topBarSub
            }
          >
            LEVEL {missionLevel} ·{' '}
            {missionDifficulty}
          </Text>
        </View>

        <View
          style={styles.levelBadge}
        >
          <Text
            style={
              styles.levelBadgeText
            }
          >
            {missionLevel}
          </Text>
        </View>
      </View>

      {/* =====================================================
          ONBOARDING
          ===================================================== */}

      {gameState ===
        'onboarding' && (
        <ScrollView
          contentContainerStyle={
            styles.centerScroll
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          <View
            style={
              styles.briefingIcon
            }
          >
            <Ionicons
              name="briefcase-outline"
              size={48}
              color="#38BDF8"
            />
          </View>

          <Text
            style={
              styles.titleText
            }
          >
            Emergency Go-Bag
          </Text>

          <Text
            style={
              styles.subtitleText
            }
          >
            Preparedness Packing Drill
          </Text>

          <View
            style={
              styles.briefingCard
            }
          >
            <View
              style={
                styles.briefingHeader
              }
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#38BDF8"
              />

              <Text
                style={
                  styles.briefingHeaderText
                }
              >
                Mission Brief
              </Text>
            </View>

            <Text
              style={
                styles.briefingText
              }
            >
              Build an emergency
              loadout by selecting
              equipment for the
              scenario. Your bag has
              limited capacity, so
              prioritise items that
              support the immediate
              response.
            </Text>
          </View>

          <View
            style={
              styles.configGrid
            }
          >
            <View
              style={
                styles.configCard
              }
            >
              <Text
                style={
                  styles.configLabel
                }
              >
                DIFFICULTY
              </Text>

              <Text
                style={[
                  styles.configValue,
                  {
                    color:
                      missionDifficulty ===
                      'HARD'
                        ? '#EF4444'
                        : missionDifficulty ===
                          'MEDIUM'
                        ? '#38BDF8'
                        : '#34D399',
                  },
                ]}
              >
                {
                  difficultyConfig.title
                }
              </Text>
            </View>

            <View
              style={
                styles.configCard
              }
            >
              <Text
                style={
                  styles.configLabel
                }
              >
                TIME
              </Text>

              <Text
                style={
                  styles.configValue
                }
              >
                {
                  difficultyConfig.time
                }
                s
              </Text>
            </View>

            <View
              style={
                styles.configCard
              }
            >
              <Text
                style={
                  styles.configLabel
                }
              >
                CAPACITY
              </Text>

              <Text
                style={
                  styles.configValue
                }
              >
                {
                  difficultyConfig.capacity
                }{' '}
                KG
              </Text>
            </View>

            <View
              style={
                styles.configCard
              }
            >
              <Text
                style={
                  styles.configLabel
                }
              >
                REWARD
              </Text>

              <Text
                style={
                  styles.configValue
                }
              >
                +{missionReward} XP
              </Text>
            </View>
          </View>

          <View
            style={
              styles.rulesCard
            }
          >
            <Text
              style={
                styles.rulesTitle
              }
            >
              How to complete the
              drill
            </Text>

            <View
              style={
                styles.ruleRow
              }
            >
              <View
                style={
                  styles.ruleNumber
                }
              >
                <Text
                  style={
                    styles.ruleNumberText
                  }
                >
                  1
                </Text>
              </View>

              <Text
                style={
                  styles.ruleText
                }
              >
                Review the emergency
                scenario.
              </Text>
            </View>

            <View
              style={
                styles.ruleRow
              }
            >
              <View
                style={
                  styles.ruleNumber
                }
              >
                <Text
                  style={
                    styles.ruleNumberText
                  }
                >
                  2
                </Text>
              </View>

              <Text
                style={
                  styles.ruleText
                }
              >
                Tap equipment to place
                it into the go-bag.
              </Text>
            </View>

            <View
              style={
                styles.ruleRow
              }
            >
              <View
                style={
                  styles.ruleNumber
                }
              >
                <Text
                  style={
                    styles.ruleNumberText
                  }
                >
                  3
                </Text>
              </View>

              <Text
                style={
                  styles.ruleText
                }
              >
                Keep the loadout within
                the weight limit.
              </Text>
            </View>

            <View
              style={
                styles.ruleRow
              }
            >
              <View
                style={
                  styles.ruleNumber
                }
              >
                <Text
                  style={
                    styles.ruleNumberText
                  }
                >
                  4
                </Text>
              </View>

              <Text
                style={
                  styles.ruleText
                }
              >
                Submit the loadout before
                the timer expires.
              </Text>
            </View>
          </View>

          <Text
            style={
              styles.difficultyDescription
            }
          >
            {
              difficultyConfig.description
            }
          </Text>

          <TouchableOpacity
            style={
              styles.primaryButton
            }
            onPress={startGame}
            activeOpacity={0.85}
          >
            <Text
              style={
                styles.primaryButtonText
              }
            >
              Begin Packing Drill
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* =====================================================
          PLAYING
          ===================================================== */}

      {gameState ===
        'playing' && (
        <ScrollView
          contentContainerStyle={
            styles.playingContent
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* Dashboard */}

          <View
            style={
              styles.dashboard
            }
          >
            <View>
              <Text
                style={
                  styles.dashboardTitle
                }
              >
                PACK LOADOUT
              </Text>

              <Text
                style={
                  styles.dashboardSub
                }
              >
                {currentScenario.location}
              </Text>
            </View>

            <View
              style={
                styles.timerBox
              }
            >
              <Ionicons
                name="timer-outline"
                size={16}
                color={
                  timeLeft <= 5
                    ? '#EF4444'
                    : '#F59E0B'
                }
              />

              <Text
                style={[
                  styles.timerText,
                  timeLeft <= 5 &&
                    styles.timerDanger,
                ]}
              >
                {timeLeft}s
              </Text>
            </View>
          </View>

          {/* Timer */}

          <View
            style={
              styles.timerTrack
            }
          >
            <Animated.View
              style={[
                styles.timerFill,
                {
                  width:
                    timerAnim.interpolate(
                      {
                        inputRange: [
                          0,
                          1,
                        ],
                        outputRange: [
                          '0%',
                          '100%',
                        ],
                      }
                    ),
                },
                timeLeft <= 5 &&
                  styles.timerDangerFill,
              ]}
            />
          </View>

          {/* Scenario */}

          <Animated.View
            style={[
              styles.scenarioCard,
              {
                transform: [
                  {
                    scale:
                      pulseAnim,
                  },
                ],
              },
            ]}
          >
            <View
              style={
                styles.scenarioTop
              }
            >
              <View
                style={
                  styles.scenarioIcon
                }
              >
                <Ionicons
                  name="warning-outline"
                  size={22}
                  color="#F59E0B"
                />
              </View>

              <View
                style={
                  styles.scenarioMeta
                }
              >
                <Text
                  style={
                    styles.scenarioLabel
                  }
                >
                  ACTIVE SCENARIO
                </Text>

                <Text
                  style={
                    styles.scenarioName
                  }
                >
                  {
                    currentScenario.name
                  }
                </Text>
              </View>
            </View>

            <Text
              style={
                styles.scenarioDescription
              }
            >
              {
                currentScenario.desc
              }
            </Text>
          </Animated.View>

          {/* Capacity */}

          <View
            style={
              styles.capacityCard
            }
          >
            <View
              style={
                styles.capacityHeader
              }
            >
              <Text
                style={
                  styles.capacityTitle
                }
              >
                BAG CAPACITY
              </Text>

              <Text
                style={[
                  styles.capacityValue,
                  currentWeight >=
                    difficultyConfig.capacity &&
                    styles.capacityDanger,
                ]}
              >
                {currentWeight.toFixed(
                  1
                )}{' '}
                /{' '}
                {
                  difficultyConfig.capacity
                }{' '}
                KG
              </Text>
            </View>

            <View
              style={
                styles.capacityTrack
              }
            >
              <View
                style={[
                  styles.capacityFill,
                  {
                    width: `${progressPercentage}%`,
                  },
                  currentWeight >=
                    difficultyConfig.capacity &&
                    styles.capacityFillDanger,
                ]}
              />
            </View>
          </View>

          {/* Instruction */}

          <View
            style={
              styles.instructionStrip
            }
          >
            <Ionicons
              name="hand-left-outline"
              size={17}
              color="#38BDF8"
            />

            <Text
              style={
                styles.instructionStripText
              }
            >
              Tap an equipment card
              to pack it. Tap again to
              remove it.
            </Text>
          </View>

          {/* Equipment */}

          <View
            style={
              styles.sectionHeadingRow
            }
          >
            <View>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                AVAILABLE EQUIPMENT
              </Text>

              <Text
                style={
                  styles.sectionSub
                }
              >
                {selectedItems.length}{' '}
                items packed
              </Text>
            </View>

            <View
              style={
                styles.selectionCount
              }
            >
              <Text
                style={
                  styles.selectionCountText
                }
              >
                {selectedItems.length}
              </Text>
            </View>
          </View>

          <View
            style={
              styles.itemGrid
            }
          >
            {items.map((item) => {
              const selected =
                item.selected;

              const cannotFit =
                !selected &&
                currentWeight +
                  item.weight >
                  difficultyConfig.capacity;

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={
                    cannotFit
                      ? 1
                      : 0.8
                  }
                  disabled={
                    cannotFit
                  }
                  onPress={() =>
                    toggleItem(
                      item.id
                    )
                  }
                  style={[
                    styles.itemCard,
                    selected &&
                      styles.itemCardSelected,
                    cannotFit &&
                      styles.itemCardDisabled,
                  ]}
                >
                  {/* Checkbox */}

                  <View
                    style={[
                      styles.checkbox,
                      selected &&
                        styles.checkboxSelected,
                    ]}
                  >
                    {selected && (
                      <Ionicons
                        name="checkmark"
                        size={17}
                        color="#FFFFFF"
                      />
                    )}
                  </View>

                  <View
                    style={
                      styles.itemIcon
                    }
                  >
                    <Ionicons
                      name={
                        item.icon
                      }
                      size={25}
                      color={
                        selected
                          ? '#FFFFFF'
                          : '#64748B'
                      }
                    />
                  </View>

                  <Text
                    style={[
                      styles.itemName,
                      selected &&
                        styles.itemNameSelected,
                    ]}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={[
                      styles.itemGroup,
                      selected &&
                        styles.itemGroupSelected,
                    ]}
                  >
                    {item.group}
                  </Text>

                  <View
                    style={
                      styles.itemFooter
                    }
                  >
                    <Text
                      style={[
                        styles.itemWeight,
                        selected &&
                          styles.itemWeightSelected,
                      ]}
                    >
                      {item.weight}{' '}
                      KG
                    </Text>

                    {selected && (
                      <Text
                        style={
                          styles.packedLabel
                        }
                      >
                        PACKED
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Submit */}

          <TouchableOpacity
            style={
              styles.submitButton
            }
            onPress={
              submitLoadout
            }
            activeOpacity={0.85}
          >
            <View>
              <Text
                style={
                  styles.submitButtonText
                }
              >
                Submit Loadout
              </Text>

              <Text
                style={
                  styles.submitButtonSub
                }
              >
                Lock in your
                preparedness response
              </Text>
            </View>

            <Ionicons
              name="checkmark-circle-outline"
              size={27}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </ScrollView>
        )}
        /* =====================================================
            REVIEW
         ===================================================== */
          {gameState === 'review' && (
            <ScrollView
              contentContainerStyle={styles.reviewContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.reviewHero}>
                <View style={styles.reviewIconCircle}>
                  <Ionicons
                    name={
                      resultSummary?.mastered
                        ? 'checkmark-circle'
                        : 'school-outline'
                    }
                    size={42}
                    color={
                      resultSummary?.mastered
                        ? '#34D399'
                        : '#38BDF8'
                    }
                  />
                </View>

                <Text style={styles.reviewTitle}>
                  {resultSummary?.mastered
                    ? 'Loadout Complete'
                    : 'Loadout Review'}
                </Text>

                <Text style={styles.reviewSubtitle}>
                  Review the decisions you made for this
                  emergency scenario.
                </Text>
              </View>

              {/* SCORE CARD */}

              <View style={styles.scoreCard}>
                <View>
                  <Text style={styles.scoreLabel}>
                    DRILL SCORE
                  </Text>

                  <Text style={styles.scoreValue}>
                    {score}
                    <Text style={styles.scoreXP}>
                      {' '}XP
                    </Text>
                  </Text>
                </View>

                <View style={styles.scoreDivider} />

                <View>
                  <Text style={styles.scoreLabel}>
                    TIME BONUS
                  </Text>

                  <Text style={styles.scoreBonus}>
                    +{resultSummary?.timeBonus || 0}
                  </Text>
                </View>
              </View>

              {/* PACKED SUMMARY */}

              <View style={styles.reviewSection}>
                <View style={styles.reviewSectionHeader}>
                  <Text style={styles.reviewSectionTitle}>
                    YOUR PACK
                  </Text>

                  <Text style={styles.reviewSectionCount}>
                    {selectedItems.length} ITEMS
                  </Text>
                </View>

                <View style={styles.packedItemsContainer}>
                  {selectedItems.length === 0 ? (
                    <View style={styles.emptyPack}>
                      <Ionicons
                        name="briefcase-outline"
                        size={28}
                        color="#475569"
                      />

                      <Text style={styles.emptyPackText}>
                        No equipment was packed.
                      </Text>
                    </View>
                  ) : (
                    selectedItems.map((item) => {
                      const isCritical =
                        currentScenario.criticalItems.includes(
                          item.id
                        );

                      const isRecommended =
                        currentScenario.recommendedItems.includes(
                          item.id
                        );

                      const isUnnecessary =
                        currentScenario.avoidItems.includes(
                          item.id
                        );

                      return (
                        <View
                          key={item.id}
                          style={styles.reviewItem}
                        >
                          <View
                            style={[
                              styles.reviewItemIcon,
                              isUnnecessary &&
                                styles.reviewItemIconBad,
                              !isUnnecessary &&
                                styles.reviewItemIconGood,
                            ]}
                          >
                            <Ionicons
                              name={item.icon}
                              size={20}
                              color={
                                isUnnecessary
                                  ? '#F87171'
                                  : '#34D399'
                              }
                            />
                          </View>

                          <View style={styles.reviewItemInfo}>
                            <Text style={styles.reviewItemName}>
                              {item.name}
                            </Text>

                            <Text style={styles.reviewItemWeight}>
                              {item.weight} KG
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.reviewStatus,
                              isUnnecessary &&
                                styles.reviewStatusBad,
                              isCritical &&
                                styles.reviewStatusCritical,
                            ]}
                          >
                            <Text
                              style={[
                                styles.reviewStatusText,
                                isUnnecessary &&
                                  styles.reviewStatusTextBad,
                                isCritical &&
                                  styles.reviewStatusTextCritical,
                              ]}
                            >
                              {isCritical
                                ? 'ESSENTIAL'
                                : isRecommended
                                ? 'USEFUL'
                                : 'OPTIONAL'}
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>
              </View>

              {/* CRITICAL ITEMS */}

              <View style={styles.reviewSection}>
                <View style={styles.reviewSectionHeader}>
                  <Text style={styles.reviewSectionTitle}>
                    ESSENTIAL CHECK
                  </Text>
                </View>

                {resultSummary?.criticalSelected?.map(
                  (id) => (
                    <View
                      key={`selected-${id}`}
                      style={styles.feedbackRow}
                    >
                      <View style={styles.feedbackIconGood}>
                        <Ionicons
                          name="checkmark"
                          size={17}
                          color="#FFFFFF"
                        />
                      </View>

                      <View style={styles.feedbackTextBlock}>
                        <Text style={styles.feedbackTitle}>
                          {getItemName(id)}
                        </Text>

                        <Text style={styles.feedbackBody}>
                          Essential equipment correctly
                          included in your loadout.
                        </Text>
                      </View>
                    </View>
                  )
                )}

                {resultSummary?.criticalMissed?.map(
                  (id) => (
                    <View
                      key={`missed-${id}`}
                      style={styles.feedbackRow}
                    >
                      <View style={styles.feedbackIconBad}>
                        <Ionicons
                          name="close"
                          size={17}
                          color="#FFFFFF"
                        />
                      </View>

                      <View style={styles.feedbackTextBlock}>
                        <Text style={styles.feedbackTitle}>
                          {getItemName(id)}
                        </Text>

                        <Text style={styles.feedbackBody}>
                          This was an essential item for
                          this scenario and was not packed.
                        </Text>
                      </View>
                    </View>
                  )
                )}
              </View>

              {/* EDUCATIONAL BREAKDOWN */}

              <View style={styles.reviewSection}>
                <View style={styles.reviewSectionHeader}>
                  <Text style={styles.reviewSectionTitle}>
                    WHY IT MATTERS
                  </Text>
                </View>

                {currentScenario.steps.map(
                  (step, index) => {
                    const packed =
                      selectedItemIds.includes(step.id);

                    return (
                      <View
                        key={step.id}
                        style={styles.educationCard}
                      >
                        <View
                          style={[
                            styles.educationNumber,
                            packed
                              ? styles.educationNumberGood
                              : styles.educationNumberMissed,
                          ]}
                        >
                          <Text
                            style={styles.educationNumberText}
                          >
                            {index + 1}
                          </Text>
                        </View>

                        <View style={styles.educationContent}>
                          <View
                            style={
                              styles.educationTitleRow
                            }
                          >
                            <Text
                              style={
                                styles.educationTitle
                              }
                            >
                              {step.title}
                            </Text>

                            <Ionicons
                              name={
                                packed
                                  ? 'checkmark-circle'
                                  : 'alert-circle'
                              }
                              size={18}
                              color={
                                packed
                                  ? '#34D399'
                                  : '#F59E0B'
                              }
                            />
                          </View>

                          <Text
                            style={
                              styles.educationBody
                            }
                          >
                            {step.body}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                )}
              </View>

              {/* MISSED / UNNECESSARY */}

              {resultSummary?.unnecessarySelected?.length >
                0 && (
                <View style={styles.warningCard}>
                  <View style={styles.warningIcon}>
                    <Ionicons
                      name="information-circle-outline"
                      size={22}
                      color="#F59E0B"
                    />
                  </View>

                  <View style={styles.warningContent}>
                    <Text style={styles.warningTitle}>
                      Packing could be more efficient
                    </Text>

                    <Text style={styles.warningText}>
                      {resultSummary.unnecessarySelected
                        .map(getItemName)
                        .join(', ')}
                      {' '}was not a priority for this
                      scenario. Limited bag capacity means
                      unnecessary equipment can crowd out
                      more useful supplies.
                    </Text>
                  </View>
                </View>
              )}

              {/* REVIEW ACTIONS */}

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={completeMission}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>
                  Lock In Results
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryActionButton}
                onPress={retryScenario}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="refresh-outline"
                  size={18}
                  color="#94A3B8"
                />

                <Text style={styles.secondaryActionText}>
                  Try This Scenario Again
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* =====================================================
              FINISHED
              ===================================================== */}

          {gameState === 'finished' && (
            <ScrollView
              contentContainerStyle={styles.finishedContent}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={[
                  styles.finishedIcon,
                  resultSummary?.mastered &&
                    styles.finishedIconMastered,
                ]}
              >
                <Ionicons
                  name={
                    resultSummary?.mastered
                      ? 'trophy-outline'
                      : 'checkmark-outline'
                  }
                  size={52}
                  color={
                    resultSummary?.mastered
                      ? '#FBBF24'
                      : '#38BDF8'
                  }
                />
              </View>

              <Text style={styles.finishedTitle}>
                {resultSummary?.mastered
                  ? 'Go-Bag Mastered'
                  : 'Drill Complete'}
              </Text>

              <Text style={styles.finishedSubtitle}>
                {resultSummary?.mastered
                  ? 'You identified the essential equipment and built an efficient response loadout.'
                  : 'Your preparedness response has been recorded. Review the scenario and try again to improve your result.'}
              </Text>

              <View style={styles.finalScoreCard}>
                <Text style={styles.finalScoreLabel}>
                  LOADOUT SCORE
                </Text>

                <Text style={styles.finalScore}>
                  {score}
                  <Text style={styles.finalScoreXP}>
                    {' '}XP
                  </Text>
                </Text>

                <View style={styles.finalScoreDivider} />

                <Text style={styles.rewardLabel}>
                  MISSION REWARD
                </Text>

                <Text style={styles.rewardValue}>
                  +{missionReward} XP
                </Text>
              </View>

              {resultSummary?.mastered && (
                <View style={styles.badgeCard}>
                  <View style={styles.badgeIcon}>
                    <Ionicons
                      name="ribbon-outline"
                      size={28}
                      color="#FBBF24"
                    />
                  </View>

                  <View style={styles.badgeContent}>
                    <Text style={styles.badgeLabel}>
                      BADGE UNLOCKED
                    </Text>

                    <Text style={styles.badgeTitle}>
                      Go-Bag Master
                    </Text>

                    <Text style={styles.badgeDescription}>
                      Completed the scenario without
                      unnecessary equipment.
                    </Text>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>
                  Return to Missions
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      )};

/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

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

  topBar: {
    marginTop: 45,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  topBarCenter: {
    alignItems: 'center',
  },

  topBarTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  topBarSub: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 3,
  },

  levelBadge: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  levelBadgeText: {
    color: '#38BDF8',
    fontSize: 15,
    fontWeight: '900',
  },

  /*
  |--------------------------------------------------------------------------
  | ONBOARDING
  |--------------------------------------------------------------------------
  */

  centerScroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 35,
  },

  briefingIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: '#082F49',
    borderWidth: 1,
    borderColor: '#0E7490',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  titleText: {
    color: '#F8FAFC',
    fontSize: 27,
    fontWeight: '900',
    textAlign: 'center',
  },

  subtitleText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 24,
  },

  briefingCard: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 17,
    marginBottom: 14,
  },

  briefingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },

  briefingHeaderText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 8,
    letterSpacing: 0.5,
  },

  briefingText: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 20,
  },

  configGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  configCard: {
    width: '48.5%',
    backgroundColor: '#0B1220',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
    marginBottom: 9,
  },

  configLabel: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 5,
  },

  configValue: {
    color: '#E2E8F0',
    fontSize: 17,
    fontWeight: '900',
  },

  rulesCard: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 17,
    marginBottom: 14,
  },

  rulesTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 14,
  },

  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  ruleNumber: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: '#172554',
    borderWidth: 1,
    borderColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  ruleNumberText: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '900',
  },

  ruleText: {
    flex: 1,
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
  },

  difficultyDescription: {
    color: '#64748B',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: 8,
  },

  primaryButton: {
    width: '100%',
    minHeight: 54,
    borderRadius: 15,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginTop: 8,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginRight: 10,
  },

  /*
  |--------------------------------------------------------------------------
  | PLAYING
  |--------------------------------------------------------------------------
  */

  playingContent: {
    paddingTop: 18,
    paddingBottom: 40,
  },

  dashboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  dashboardTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  dashboardSub: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },

  timerBox: {
    minWidth: 70,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  timerText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 5,
  },

  timerDanger: {
    color: '#EF4444',
  },

  timerTrack: {
    width: '100%',
    height: 5,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 15,
  },

  timerFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },

  timerDangerFill: {
    backgroundColor: '#EF4444',
  },

  /*
  |--------------------------------------------------------------------------
  | SCENARIO
  |--------------------------------------------------------------------------
  */

  scenarioCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 17,
    marginBottom: 14,
  },

  scenarioTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  scenarioIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#451A03',
    borderWidth: 1,
    borderColor: '#78350F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  scenarioMeta: {
    flex: 1,
  },

  scenarioLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 3,
  },

  scenarioName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '900',
  },

  scenarioDescription: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
  },

  /*
  |--------------------------------------------------------------------------
  | CAPACITY
  |--------------------------------------------------------------------------
  */

  capacityCard: {
    backgroundColor: '#0B1220',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
    marginBottom: 12,
  },

  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  capacityTitle: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  capacityValue: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '900',
  },

  capacityDanger: {
    color: '#EF4444',
  },

  capacityTrack: {
    width: '100%',
    height: 7,
    borderRadius: 4,
    backgroundColor: '#1E293B',
    overflow: 'hidden',
  },

  capacityFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 4,
  },

  capacityFillDanger: {
    backgroundColor: '#EF4444',
  },

  /*
  |--------------------------------------------------------------------------
  | INSTRUCTION
  |--------------------------------------------------------------------------
  */

  instructionStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#082F49',
    borderWidth: 1,
    borderColor: '#164E63',
    borderRadius: 13,
    paddingVertical: 11,
    paddingHorizontal: 13,
    marginBottom: 18,
  },

  instructionStripText: {
    flex: 1,
    color: '#BAE6FD',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
    marginLeft: 8,
  },

  /*
  |--------------------------------------------------------------------------
  | EQUIPMENT HEADER
  |--------------------------------------------------------------------------
  */

  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  sectionSub: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },

  selectionCount: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#172554',
    borderWidth: 1,
    borderColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectionCountText: {
    color: '#60A5FA',
    fontSize: 13,
    fontWeight: '900',
  },

  /*
  |--------------------------------------------------------------------------
  | EQUIPMENT CARDS
  |--------------------------------------------------------------------------
  */

  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  itemCard: {
    width: '48.5%',
    minHeight: 171,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 18,
    padding: 13,
    marginBottom: 11,
    position: 'relative',
  },

  itemCardSelected: {
    backgroundColor: '#064E3B',
    borderColor: '#10B981',
  },

  itemCardDisabled: {
    opacity: 0.38,
  },

  /*
  |--------------------------------------------------------------------------
  | CHECKBOX
  |--------------------------------------------------------------------------
  */

  checkbox: {
    position: 'absolute',
    top: 11,
    right: 11,
    width: 25,
    height: 25,
    borderRadius: 8,
    backgroundColor: '#020617',
    borderWidth: 1.5,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  checkboxSelected: {
    backgroundColor: '#10B981',
    borderColor: '#34D399',
  },

  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  itemName: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 17,
    paddingRight: 20,
  },

  itemNameSelected: {
    color: '#FFFFFF',
  },

  itemGroup: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  itemGroupSelected: {
    color: '#A7F3D0',
  },

  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 10,
  },

  itemWeight: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '800',
  },

  itemWeightSelected: {
    color: '#D1FAE5',
  },

  packedLabel: {
    color: '#34D399',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  submitButton: {
    width: '100%',
    minHeight: 66,
    borderRadius: 17,
    backgroundColor: '#0F766E',
    borderWidth: 1,
    borderColor: '#14B8A6',
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  submitButtonSub: {
    color: '#99F6E4',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },

  /*
  |--------------------------------------------------------------------------
  | REVIEW
  |--------------------------------------------------------------------------
  */

  reviewContent: {
    paddingTop: 20,
    paddingBottom: 45,
  },

  reviewHero: {
    alignItems: 'center',
    marginBottom: 20,
  },

  reviewIconCircle: {
    width: 78,
    height: 78,
    borderRadius: 26,
    backgroundColor: '#082F49',
    borderWidth: 1,
    borderColor: '#164E63',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  reviewTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },

  reviewSubtitle: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },

  scoreCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 18,
  },

  scoreLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },

  scoreValue: {
    color: '#34D399',
    fontSize: 28,
    fontWeight: '900',
  },

  scoreXP: {
    color: '#64748B',
    fontSize: 12,
  },

  scoreBonus: {
    color: '#38BDF8',
    fontSize: 22,
    fontWeight: '900',
  },

  scoreDivider: {
    width: 1,
    height: 38,
    backgroundColor: '#1E293B',
  },

  reviewSection: {
    marginBottom: 17,
  },

  reviewSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  reviewSectionTitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  reviewSectionCount: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
  },

  packedItemsContainer: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 17,
    padding: 10,
  },

  emptyPack: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  emptyPackText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },

  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },

  reviewItemIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  reviewItemIconGood: {
    backgroundColor: '#064E3B',
  },

  reviewItemIconBad: {
    backgroundColor: '#450A0A',
  },

  reviewItemInfo: {
    flex: 1,
    marginLeft: 10,
  },

  reviewItemName: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '800',
  },

  reviewItemWeight: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },

  reviewStatus: {
    backgroundColor: '#172554',
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 7,
  },

  reviewStatusBad: {
    backgroundColor: '#450A0A',
  },

  reviewStatusCritical: {
    backgroundColor: '#064E3B',
  },

  reviewStatusText: {
    color: '#93C5FD',
    fontSize: 8,
    fontWeight: '900',
  },

  reviewStatusTextBad: {
    color: '#FCA5A5',
  },

  reviewStatusTextCritical: {
    color: '#6EE7B7',
  },

  /*
  |--------------------------------------------------------------------------
  | FEEDBACK
  |--------------------------------------------------------------------------
  */

  feedbackRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 15,
    padding: 12,
    marginBottom: 8,
  },

  feedbackIconGood: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  feedbackIconBad: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#991B1B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  feedbackTextBlock: {
    flex: 1,
  },

  feedbackTitle: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 3,
  },

  feedbackBody: {
    color: '#64748B',
    fontSize: 10,
    lineHeight: 15,
  },

  /*
  |--------------------------------------------------------------------------
  | EDUCATIONAL BREAKDOWN
  |--------------------------------------------------------------------------
  */

  educationCard: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 13,
    marginBottom: 9,
  },

  educationNumber: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  educationNumberGood: {
    backgroundColor: '#065F46',
  },

  educationNumberMissed: {
    backgroundColor: '#78350F',
  },

  educationNumberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  educationContent: {
    flex: 1,
  },

  educationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  educationTitle: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '800',
    paddingRight: 8,
  },

  educationBody: {
    color: '#64748B',
    fontSize: 10,
    lineHeight: 15,
  },

  /*
  |--------------------------------------------------------------------------
  | WARNING
  |--------------------------------------------------------------------------
  */

  warningCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },

  warningLabel: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 6,
  },

  warningTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },

  warningBody: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
  }
  // gameHeader: {
  //   marginBottom: 12,
  // },

  // gameHeaderTitle: {
  //   color: '#FFFFFF',
  //   fontSize: 20,
  //   fontWeight: '900',
  // },

  // gameHeaderSubtitle: {
  //   color: '#64748B',
  //   fontSize: 11,
  //   fontWeight: '700',
  //   marginTop: 3,
  // },

  // metricRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginTop: 16,
  // },

  // metricLabel: {
  //   color: '#64748B',
  //   fontSize: 10,
  //   fontWeight: '800',
  //   letterSpacing: 0.8,
  // },

  // metricValue: {
  //   color: '#E2E8F0',
  //   fontSize: 13,
  //   fontWeight: '900',
  // },
  // equipmentTile: {
  //   width: '48%',
  //   minHeight: 150,
  //   backgroundColor: '#0F172A',
  //   borderWidth: 1,
  //   borderColor: '#1E293B',
  //   borderRadius: 16,
  //   padding: 14,
  //   marginBottom: 12,
  // },

  // equipmentTileSelected: {
  //   backgroundColor: '#082F2C',
  //   borderColor: '#14B8A6',
  //   borderWidth: 2,
  // },

  // selectionBox: {
  //   width: 28,
  //   height: 28,
  //   borderRadius: 6,
  //   borderWidth: 2,
  //   borderColor: '#475569',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 14,
  // },

  // selectionBoxSelected: {
  //   backgroundColor: '#14B8A6',
  //   borderColor: '#14B8A6',
  // },
  // packedSection: {
  //   backgroundColor: '#0B1120',
  //   borderWidth: 1,
  //   borderColor: '#1E293B',
  //   borderRadius: 14,
  //   padding: 12,
  //   marginBottom: 16,
  // },

  // packedHeader: {
  //   color: '#64748B',
  //   fontSize: 10,
  //   fontWeight: '900',
  //   letterSpacing: 1,
  // },

  // packedCount: {
  //   color: '#FFFFFF',
  //   fontSize: 14,
  //   fontWeight: '900',
  //   marginTop: 4,
  // },

  // packedItems: {
  //   color: '#94A3B8',
  //   fontSize: 11,
  //   lineHeight: 17,
  //   marginTop: 6,
  // }
});

// /**
/**
 * const evaluateLoadout = () => {
  const selectedIds = items
    .filter((item) => item.selected)
    .map((item) => item.id);

  const criticalSelected =
    currentScenario.criticalItems.filter((id) =>
      selectedIds.includes(id)
    );

  const criticalMissed =
    currentScenario.criticalItems.filter(
      (id) => !selectedIds.includes(id)
    );

  const recommendedSelected =
    currentScenario.recommendedItems.filter((id) =>
      selectedIds.includes(id)
    );

  const unnecessarySelected =
    currentScenario.avoidItems.filter((id) =>
      selectedIds.includes(id)
    );

  let calculatedScore =
    criticalSelected.length * 20 +
    recommendedSelected.length * 10 -
    unnecessarySelected.length * 5;

  calculatedScore = Math.max(0, calculatedScore);

  let timeBonus = 0;

  if (timeLeft >= 10) {
    timeBonus = 10;
  } else if (timeLeft >= 5) {
    timeBonus = 5;
  }

  calculatedScore += timeBonus;

  const mastered =
    criticalMissed.length === 0 &&
    unnecessarySelected.length === 0;

  setScore(calculatedScore);

  setResultSummary({
    criticalSelected,
    criticalMissed,
    recommendedSelected,
    unnecessarySelected,
    timeBonus,
    mastered,
  });

  setGameState('review');
};

 */
//  * {/* WARNING */}

// {resultSummary?.unnecessarySelected?.length > 0 && (
//   <View style={styles.warningBanner}>
//     <Text style={styles.warningLabel}>
//       PACKING NOTE
//     </Text>

//     <Text style={styles.warningTitle}>
//       Packing could be more efficient
//     </Text>

//     <Text style={styles.warningBody}>
//       {resultSummary.unnecessarySelected
//         .map(getItemName)
//         .join(', ')}{' '}
//       was not a priority for this scenario. Limited
//       bag capacity means unnecessary equipment can
//       crowd out more useful supplies.
//     </Text>
//   </View>
// )}
/**
 * ## Games and Missions System: Complete Discussion Summary

 The Games and Missions system was discussed as a structured preparedness-learning component of the application, with the goal of turning emergency-preparedness knowledge into interactive, scenario-based activities rather than presenting information only through static screens. The overall concept is that users progress through a set of missions, each mission representing a practical preparedness task. Completing missions provides points or XP, and successful performance can unlock badges and progression. The system is intended to connect the educational content of the application with measurable user actions, while keeping the experience consistent with the application's existing dark, modern interface.

 The Games section is designed to function as the interactive layer of the preparedness application. Instead of simply telling users what to do during emergencies, the games allow users to make decisions under simulated constraints. A game can present an emergency scenario, give the user a limited amount of time or capacity, provide several possible actions or items, and then evaluate the user's decisions. This makes the game both educational and measurable. The intention is not simply to reward the fastest interaction, but to reinforce correct preparedness priorities and provide an explanation after the activity so that the user understands why a particular decision was useful or unnecessary.

 The Missions system sits above the individual games and provides the progression structure. A mission can specify a level, difficulty, and reward, and then navigate the user into the appropriate game. The `GoBagScreen` implementation reflects this architecture through route parameters such as `level`, `difficulty`, and `reward`. The expected navigation pattern is essentially `navigation.navigate('GoBag', { level: mission.level, difficulty: mission.difficulty, reward: mission.reward })`. This allows the Missions screen to determine the configuration of a particular mission without requiring every game screen to have a completely separate hard-coded version.

 The Firebase portion of the discussion concerns using Firebase as the persistent backend for the application's user and progression data. The intended architecture is that Firebase should store information that needs to survive beyond the current React Native session, such as user information, XP or points, completed missions, earned badges, progression state, and potentially other preparedness-learning activity records. React Context can manage the application's active state and expose convenient functions such as `updatePoints` and `addBadge`, while Firebase provides the persistence layer behind those operations. This separates the user interface from the database implementation and makes it possible for multiple screens to interact with the same progression data without duplicating Firebase logic throughout the application.

 The `UserContext` is particularly important in this design. The Go-Bag game retrieves the user context with `useUser()` and then obtains `updatePoints` and `addBadge`. The game therefore does not directly manipulate the user's global score state in the screen itself. Instead, after the mission is completed, it calls `updatePoints(finalScore + missionReward)`. This means there are two distinct sources of progression: the performance score generated by the game and the predefined mission reward. The game score represents how effectively the user performed the activity, while the mission reward represents the progression value associated with completing the mission.

 The badge system was also integrated into the mission-completion flow. In the Go-Bag implementation, a `go_bag_master` badge is awarded when the user satisfies the mastery conditions. The badge is not awarded simply because the user reaches a particular score. Instead, mastery is based on the actual loadout decisions. In the current implementation, `mastered` becomes true when all critical items have been packed and no unnecessary items have been selected. When that condition is met, `addBadge('go_bag_master')` is called. The application can then trigger the existing `triggerConfetti()` function to provide a completion effect. This creates a distinction between ordinary mission completion and mastery of the activity.

 The Games and Missions architecture therefore has several layers. The Missions screen is responsible for presenting available missions and their progression information. The individual game screen is responsible for running the interactive activity. The User Context is responsible for exposing shared progression functions. Firebase is responsible for persistent storage. The Game Context can provide global game-related effects such as confetti. This division keeps responsibilities relatively clear: missions determine what the user should do, games determine how the user performs the task, context manages application state, and Firebase stores the long-term result.

 The Go-Bag Drill was developed as one of the main examples of this system. It is a preparedness packing simulation in which the user must build an emergency go-bag for a particular emergency scenario. The player receives a limited capacity and a time limit and must select equipment from a collection of available items. The game then evaluates whether the selected equipment was appropriate for the scenario. This gives the game a practical decision-making component rather than making it simply a memory quiz.

 Three scenarios were established in the current implementation. The first is `FLASH FLOOD RESPONSE`, described as an urban evacuation scenario. The scenario explains that flooding is affecting access routes and asks the user to prepare a compact evacuation go-bag containing essential supplies, medical items, and communication equipment. Its critical items are water, medication, documents, flashlight, and phone or, in this implementation, a power bank represented by the `phone` identifier. Its recommended items are a whistle and food, while a mask is considered an avoid item for this particular scenario.

 The second scenario is `HAZE RESPONSE`, described as an air-quality emergency scenario. The user is asked to prepare a go-bag that supports communication, medication requirements, and protection from particulate exposure. The critical items are the respirator mask, water, medication, phone or power bank, and documents. Food is recommended, while the whistle and flashlight are classified as avoid items for the scenario. The educational explanation emphasizes respiratory protection, hydration, medication access, communications, and preservation of important information.

 The third scenario is `POWER OUTAGE RESPONSE`, described as an extended utility disruption. The user must build a practical go-bag while staying within the available weight limit. Its critical items are the flashlight, phone or power bank, water, medication, and food. Documents and a whistle are recommended, while the mask is treated as an avoid item. The educational breakdown explains the importance of independent lighting, maintaining communication, having water available, maintaining access to medication, and having ready-to-eat food when normal cooking or household systems may be unavailable.

 The equipment database was designed around eight items. Drinking Water has an identifier of `water`, weighs 3 kilograms, and belongs to the Essential group. Emergency Food has an identifier of `food`, weighs 1 kilogram, and is also classified as Essential. Essential Medication uses the `meds` identifier, weighs 0.5 kilograms, and belongs to the Medical group. Important Documents uses `docs`, weighs 0.2 kilograms, and belongs to Information. The Flashlight uses `flashlight`, weighs 0.5 kilograms, and belongs to Utility. The Respirator Mask uses `mask`, weighs 0.1 kilograms, and belongs to Protection. The Power Bank uses the `phone` identifier, weighs 0.4 kilograms, and belongs to Communication. The Emergency Whistle uses `whistle`, weighs 0.1 kilograms, and belongs to Signalling.

 The equipment identifiers are particularly important because the scenarios do not store entire equipment objects. Instead, they store item IDs. For example, `criticalItems: ['water', 'meds', 'docs', 'flashlight', 'phone']` refers back to the corresponding records in `GO_BAG_ITEMS`. This makes the scenario configuration easier to maintain because the same equipment definitions can be reused across multiple scenarios.

 Difficulty was also incorporated into the mission design. The application currently defines EASY, MEDIUM, and HARD configurations. EASY provides 30 seconds and a capacity of 6 kilograms. MEDIUM provides 22 seconds and a capacity of 5 kilograms. HARD provides 15 seconds and a capacity of 4 kilograms. All three currently use eight available equipment items. The difficulty therefore affects clearly. EASY is described as a basic emergency loadout with generous capacity and a forgiving time limit. MEDIUM requires the user to prioritize essential equipment while managing a tighter weight limit. HARD requires rapid decisions under restricted capacity and a short response window. This the pressure under which the user makes decisions rather than changing the underlying scenario content.

 The difficulty descriptions were written to communicate the gameplay purpose clearly. EASY is described as a basic emergency loadout with generous capacity and a forgiving time limit. MEDIUM requires the user to prioritize essential equipment while managing a tighter weight limit. HARD requires rapid decisions under restricted capacity and a short response window. This gives the Missions system a straightforward way of progressively increasing challenge without having to create completely different game mechanics for every difficulty level.

 The Go-Bag screen begins with an onboarding state. The onboarding screen introduces the Emergency Go-Bag Preparedness Packing Drill and provides a Mission Brief explaining that the user must build an emergency loadout by selecting equipment appropriate for the scenario. It explains that the bag has limited capacity and that the user should prioritize items supporting the immediate response. The onboarding screen also displays difficulty, time, capacity, and mission reward so that the user understands the mission configuration before starting.

 The onboarding screen then explains the four basic gameplay steps. The user first reviews the emergency scenario. The user then taps equipment to place it into the go-bag. The user must keep the loadout within the weight limit. Finally, the user submits the loadout before the timer expires. This structure was intended to make the game understandable before the timed component begins.

 Once the user starts the drill, the game enters the `playing` state. The screen displays a dashboard containing the current scenario location, the remaining time, a timer progress bar, the active scenario card, the bag-capacity meter, an instruction strip, the available equipment grid, and the Submit Loadout button. The scenario card visually identifies the active emergency and provides its description. The capacity section continuously displays the current weight against the difficulty-specific capacity.

 The equipment selection system works through `toggleItem`. When the user selects an item, the function first checks whether the item exists and whether the game is currently in the `playing` state. It then checks whether selecting the item would exceed the configured capacity. If the new item would cause the loadout to exceed capacity, the selection is prevented. Otherwise, the item is marked as selected and its weight is added to `currentWeight`. Tapping an already-selected item removes it and subtracts its weight.

 The interface visually distinguishes selected, unselected, and capacity-incompatible items. A selected card receives a green background and border, the checkbox changes to a green checked state, and the item text changes to a brighter color. An item that cannot fit because of the remaining capacity becomes visually disabled. This reinforces the capacity constraint directly within the equipment-selection interface rather than waiting until submission to tell the user that the loadout is too heavy.

 The timer is controlled through React state and an effect. When the game state is `playing`, an interval reduces `timeLeft` once per second. When the remaining time reaches zero, the game transitions into the review state. The screen also uses an animated timer bar that visually decreases over the configured duration. When five seconds or fewer remain, the timer changes to a danger color. The scenario card also uses a subtle pulse animation while the game is active, providing a visual indication that the scenario is live.

 The scoring model was deliberately designed to reward positive decisions rather than relying solely on penalties. Each critical item selected provides 20 points. Each recommended item selected provides 10 points. Each unnecessary item selected results in a five-point deduction. Missing a critical item does not directly subtract points. The calculated score is clamped to a minimum of zero. This means that a user is primarily rewarded for correctly identifying important equipment, while unnecessary selections reduce efficiency.

 A time bonus was also introduced. If the user submits with at least ten seconds remaining, they receive a ten-point time bonus. If they submit with at least five seconds remaining, they receive a five-point bonus. Otherwise, they receive no time bonus. The time bonus is intended to reward efficient decision-making without making speed the only important factor.

 The mastery condition is separate from the numerical score. The current implementation considers the scenario mastered when every critical item has been packed and no unnecessary item has been selected. In code, this is represented by `allCriticalPacked`, `noUnnecessaryItems`, and then `mastered = allCriticalPacked && noUnnecessaryItems`. This is useful because a high numerical score and complete mastery are not necessarily identical concepts. The application can therefore distinguish between completing an activity and demonstrating a fully appropriate loadout.

 The review stage was designed as an educational debrief rather than simply a score screen. It begins with a review hero section that changes depending on whether the scenario was mastered. A mastered scenario displays a completion-oriented icon and title, while a non-mastered result presents a learning-oriented review. The subtitle explains that the purpose of the screen is to review the decisions made during the emergency scenario.

 The score card displays the drill score and the time bonus. The packed summary then lists everything the user actually placed into the bag. Each packed item is classified according to its relationship with the current scenario. Critical items are shown as essential, recommended items as useful, and other selected items as optional unless they are explicitly classified as unnecessary. Unnecessary selections receive a distinct warning treatment.

 The Essential Check section provides direct feedback on critical items. Every critical item selected is shown with a positive indicator and an explanation that the essential equipment was correctly included. Every critical item missed is shown with a negative indicator and an explanation that it was essential for the scenario and was not packed. This makes the game educational even when the player performs poorly because the user can see exactly what was missing.

 The `WHY IT MATTERS` section is based on the scenario's `steps` array. Each scenario contains educational steps associated with its critical equipment. During review, each step is displayed with a numbered indicator, a title, an explanation, and an icon indicating whether the associated item was packed. This turns the result screen into a mini-learning module. The user can therefore understand not only whether an item was correct, but why it matters in the emergency scenario.

 The warning section was also being refined when the previous discussion stopped. The existing styles included `warningBanner`, `warningLabel`, `warningTitle`, and `warningBody`, while the JSX was still referencing `warningCard`, `warningIcon`, and `warningContent`. The recommendation was to make the JSX and styles consistent by using the existing warning-banner design. The warning should communicate that the loadout could be more efficient, identify the unnecessary equipment, and explain that limited capacity means unnecessary equipment can displace more useful supplies. The warning is informational rather than punitive.

 The finished state is displayed after the user selects `Lock In Results`. The completion screen shows the final loadout score, the mission reward, and, where applicable, the Go-Bag Master badge. A mastered scenario receives a trophy-style presentation and explains that the user identified the essential equipment and built an efficient response loadout. A non-mastered scenario still records completion and explains that the user can review the scenario and try again to improve the result.

 The reward architecture was designed so that the game score and mission reward remain separate. If the game produces a score of 80 and the mission reward is 40 XP, the progression update is conceptually 120 points. The mission reward is therefore guaranteed for completion, while the score reflects the user's performance. This distinction can later be expanded to support different reward structures, mission bonuses, streaks, completion percentages, or other progression mechanics without changing the underlying game evaluation system.

 The `completeMission` function handles this final progression step. It obtains the final score, calls `updatePoints` with the score plus the mission reward, awards the `go_bag_master` badge when appropriate, triggers confetti if available, and then changes the game state to `finished`. The defensive checks around `updatePoints`, `addBadge`, and `triggerConfetti` allow the screen to remain functional even if one of those context functions is unavailable.

 The next-scenario system was also included. `nextScenario` calculates the next scenario index using `(scenarioIndex + 1) % SCENARIOS.length`, updates the scenario index, and initializes the next scenario. This allows the three scenarios to cycle continuously. The retry function uses the current scenario index and calls `initialiseScenario` again, resetting the current activity without changing the mission's scenario.

 The scenario initialization process resets the game state, selects the requested scenario, shuffles the equipment list, resets every item's `selected` state, resets the score, resets the current weight, resets the timer, clears the previous result summary, and starts the game. The equipment is deliberately shuffled so that users cannot simply memorize the location of particular cards in the grid.

 The UI styling follows the established dark preparedness-dashboard visual language. The primary background is `#020617`, with cards using dark navy shades such as `#0F172A` and `#0B1220`. Blue is used for primary actions and information, green for successful or selected states, amber for warnings and scenario alerts, and red for danger states. Rounded cards, compact typography, border treatments, progress bars, icons, and small uppercase labels create a consistent operational-dashboard appearance.

 The earlier styling cleanup identified duplicate definitions that should be removed. In particular, `submitButton` and `submitButtonText` had been declared more than once. The later definitions would override the earlier ones within the JavaScript object, creating confusion about which visual design was actually active. There were also several older styles such as `gameHeader`, `gameHeaderTitle`, `gameHeaderSubtitle`, `metricRow`, `metricLabel`, `metricValue`, `equipmentTile`, `equipmentTileSelected`, `selectionBox`, `selectionBoxSelected`, `packedSection`, `packedHeader`, `packedCount`, and `packedItems` that appeared to belong to an earlier version of the UI and were not being used by the current JSX. Cleaning these up would make the stylesheet easier to maintain.

 There was also an important structural JSX issue in the pasted Go-Bag screen. The `playing` conditional was not properly closed before the `review` conditional began. The `ScrollView` for the playing state must close, followed by `)}`, before `{gameState === 'review' && (...)}` begins. Without that closure, the JSX structure is invalid and the file will not compile correctly.

 Another functional issue identified was the timeout behavior. The current timer changes the state to `review` when time reaches zero, but the scoring logic is located inside `submitLoadout`. Therefore, if the timer expires before the user manually submits, the screen can enter review without having generated a `resultSummary` or calculated score. The recommended architectural improvement was to extract the loadout evaluation into a reusable `evaluateLoadout` function. Both manual submission and timeout could then use the same evaluation pathway. For timeout, the time bonus should be explicitly treated as zero rather than accidentally using a stale `timeLeft` value.

 A further architectural improvement discussed implicitly by this structure is that the scoring rules should eventually be data-driven rather than embedded entirely inside the screen. At the moment, each scenario defines critical, recommended, and avoid item arrays, while the scoring values are global. This is sufficient for the current three scenarios, but a future Firebase-backed mission system could store mission definitions, scenario metadata, rewards, difficulty configurations, and completion state separately. The React Native game would then become a reusable engine that receives mission configuration rather than containing every mission directly in the component.

 The Firebase model can therefore eventually support a structure where each user has a progression record containing XP, completed missions, earned badges, and potentially individual game results. A mission record could contain the mission ID, completion state, score, mastery state, completion timestamp, and difficulty. This would allow the Missions screen to show which activities have been completed, which are currently available, which badges have been earned, and how much XP the user has accumulated. The exact Firebase schema should be finalized around the application's existing authentication and context architecture rather than duplicating user state independently in every game screen.

 The most important overall design principle from the Games and Missions discussion is that the game should not be isolated from the rest of the application. A mission should begin in the Missions interface, pass its configuration into the game, run an interactive preparedness challenge, produce a score and learning feedback, update the user's persistent progression, award badges where appropriate, and return the user to the broader mission structure. This creates a complete loop from mission selection to gameplay to education to progression.

 The Go-Bag Drill is consequently more than a standalone packing game. It serves as a template for the broader Games and Missions architecture. Other preparedness games can follow the same pattern: receive mission parameters, present an onboarding briefing, run a timed or constrained activity, evaluate decisions, provide an educational review, calculate a performance score, award the mission reward, update Firebase-backed progression, and optionally award a specialized badge. This makes the system extensible to other emergency-preparedness activities while preserving a consistent user experience.

 The current implementation is therefore at the point where the core game loop, scenario model, difficulty system, scoring model, review/debrief system, reward integration, badge integration, and visual language are established. The next technical stage is primarily cleanup and integration: correct the JSX state-block structure, consolidate duplicate styles, align the warning JSX with the warning styles, correct timeout evaluation, and then connect the `UserContext` progression functions to the Firebase persistence layer so that mission completion, XP, badges, and future mission status remain available across sessions.
 */
 //*/