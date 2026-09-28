import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  useWindowDimensions,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Accelerometer } from 'expo-sensors';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUser } from '../contexts/UserContext';

/* ============================================================
   FLOOD RUNNER

   CAMPAIGN MAPPING

   MissionsScreen contains:

   level-2 -> FloodRunnerGameModal
   level-5 -> FloodRunnerGameModal
   level-8 -> FloodRunnerGameModal

   These map to:

   level-2 -> Flood Runner Easy
   level-5 -> Flood Runner Moderate
   level-8 -> Flood Runner Advanced

   Flood Runner reports the CAMPAIGN MISSION ID back to
   UserContext, NOT "floodRunner".

   This is what allows MissionsScreen to unlock the next
   campaign mission.
============================================================ */

const CAMPAIGN_TO_GAME_LEVEL = {
  2: 1,
  5: 2,
  8: 3,
};

const GAME_LEVELS = {
  1: {
    nameKey: 'games.floodRunner.levels.easy',

    targetScore: 50,

    debrisSpeed: 150,
    spawnInterval: 1200,
    spawnCount: 1,

    playerSpeed: 285,

    reward: {
      xp: 100,
      coins: 25,
    },
  },

  2: {
    nameKey: 'games.floodRunner.levels.moderate',

    targetScore: 75,

    debrisSpeed: 205,
    spawnInterval: 900,
    spawnCount: 2,

    playerSpeed: 325,

    reward: {
      xp: 150,
      coins: 40,
    },
  },

  3: {
    nameKey: 'games.floodRunner.levels.advanced',

    targetScore: 100,

    debrisSpeed: 255,
    spawnInterval: 720,
    spawnCount: 3,

    playerSpeed: 370,

    reward: {
      xp: 200,
      coins: 60,
    },
  },
};

/* ============================================================
   GAME CONSTANTS
============================================================ */

const PLAYER_SIZE = 36;
const DEBRIS_SIZE = 28;

const FLOOD_HEIGHT = 62;
const PLAYER_BOTTOM_OFFSET = 14;

const COLLISION_PADDING = 5;

const TOUCH_MOVE_MULTIPLIER = 0.22;
const SENSOR_DEAD_ZONE = 0.05;

/* ============================================================
   ADAPTIVE DIFFICULTY

   riskScore:

   0   = player coping well
   50  = balanced
   100 = player struggling

   When player performs well:
   risk decreases
   difficulty increases

   When player struggles:
   risk increases
   difficulty decreases
============================================================ */

const MIN_DIFFICULTY_FACTOR = 0.76;
const MAX_DIFFICULTY_FACTOR = 1.18;

const NEAR_MISS_DISTANCE = 34;

const RISK_INCREASE_COLLISION = 28;
const RISK_INCREASE_NEAR_MISS = 5;

const RISK_DECREASE_SUCCESS = 1.5;
const RISK_DECREASE_CORRECT_RESCUE = 12;

const RISK_UPDATE_INTERVAL = 1000;

/* ============================================================
   RESCUE
============================================================ */

const MAX_RESCUE_LIVES = 1;
const RESCUE_POINTS = 15;

/* ============================================================
   RESCUE QUESTIONS
============================================================ */

const RESCUE_QUESTIONS = [
  {
    id: 'q1',
    questionKey:
      'games.floodRunner.questions.q1.question',

    options: [
      {
        id: 'a',
        textKey:
          'games.floodRunner.questions.q1.a',
      },
      {
        id: 'b',
        textKey:
          'games.floodRunner.questions.q1.b',
      },
      {
        id: 'c',
        textKey:
          'games.floodRunner.questions.q1.c',
      },
    ],

    correct: 'b',
  },

  {
    id: 'q2',
    questionKey:
      'games.floodRunner.questions.q2.question',

    options: [
      {
        id: 'a',
        textKey:
          'games.floodRunner.questions.q2.a',
      },
      {
        id: 'b',
        textKey:
          'games.floodRunner.questions.q2.b',
      },
      {
        id: 'c',
        textKey:
          'games.floodRunner.questions.q2.c',
      },
    ],

    correct: 'a',
  },

  {
    id: 'q3',
    questionKey:
      'games.floodRunner.questions.q3.question',

    options: [
      {
        id: 'a',
        textKey:
          'games.floodRunner.questions.q3.a',
      },
      {
        id: 'b',
        textKey:
          'games.floodRunner.questions.q3.b',
      },
      {
        id: 'c',
        textKey:
          'games.floodRunner.questions.q3.c',
      },
    ],

    correct: 'c',
  },

  {
    id: 'q4',
    questionKey:
      'games.floodRunner.questions.q4.question',

    options: [
      {
        id: 'a',
        textKey:
          'games.floodRunner.questions.q4.a',
      },
      {
        id: 'b',
        textKey:
          'games.floodRunner.questions.q4.b',
      },
      {
        id: 'c',
        textKey:
          'games.floodRunner.questions.q4.c',
      },
    ],

    correct: 'a',
  },

  {
    id: 'q5',
    questionKey:
      'games.floodRunner.questions.q5.question',

    options: [
      {
        id: 'a',
        textKey:
          'games.floodRunner.questions.q5.a',
      },
      {
        id: 'b',
        textKey:
          'games.floodRunner.questions.q5.b',
      },
      {
        id: 'c',
        textKey:
          'games.floodRunner.questions.q5.c',
      },
    ],

    correct: 'b',
  },
];

/* ============================================================
   HELPERS
============================================================ */

function clamp(value, min, max) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

function getRandomQuestion() {
  const index = Math.floor(
    Math.random() *
      RESCUE_QUESTIONS.length
  );

  return RESCUE_QUESTIONS[index];
}

/* ============================================================
   COMPONENT
============================================================ */

export default function FloodRunnerGameModal() {
  const { t } = useTranslation();

  const navigation = useNavigation();
  const route = useRoute();

  const insets = useSafeAreaInsets();

  const {
    width: windowWidth,
    height: windowHeight,
  } = useWindowDimensions();

  /*
   * IMPORTANT:
   *
   * This is the SAME UserContext completion mechanism
   * already used by the Flood Runner code you supplied.
   *
   * UserContext remains the source of truth.
   */
  const {
    user,
    completeMission,
  } = useUser();

  /* ==========================================================
     CAMPAIGN LEVEL
  ========================================================== */

  const campaignLevel = Number(
    route?.params?.level ?? 2
  );

  /*
   * If MissionsScreen opened Flood Runner:
   *
   * 2 -> internal game level 1
   * 5 -> internal game level 2
   * 8 -> internal game level 3
   *
   * We also support directly opening Flood Runner with
   * level 1/2/3 for testing.
   */
  const gameLevel = useMemo(() => {
    if (
      CAMPAIGN_TO_GAME_LEVEL[
        campaignLevel
      ]
    ) {
      return CAMPAIGN_TO_GAME_LEVEL[
        campaignLevel
      ];
    }

    return clamp(
      Number(campaignLevel) || 1,
      1,
      3
    );
  }, [campaignLevel]);

  const config =
    GAME_LEVELS[gameLevel];

  /*
   * THIS is the ID MissionsScreen actually checks.
   *
   * For example:
   *
   * mission = "level-2"
   *
   * MissionsScreen checks:
   *
   * completedMissions["level-2"]
   */
  const campaignMissionId =
    route?.params?.mission ||
    `level-${campaignLevel}`;

  /*
   * Rewards passed by MissionsScreen are authoritative
   * for the campaign mission.
   *
   * Example:
   *
   * Mission 2:
   * xpreward = 180
   * coinreward = 40
   */
  const missionXpReward =
    Number(route?.params?.xpreward) ||
    config.reward.xp;

  const missionCoinReward =
    Number(route?.params?.coinreward) ||
    config.reward.coins;

  /* ==========================================================
     RESPONSIVE GAME DIMENSIONS
  ========================================================== */

  const GAME_WIDTH = Math.min(
    Math.max(windowWidth - 28, 280),
    420
  );

  /*
   * Keep the game area comfortably inside the visible
   * window. The entire screen itself is scrollable, so
   * very short devices can still reach the controls.
   */
  const GAME_HEIGHT = clamp(
    windowHeight * 0.46,
    300,
    430
  );

  const INITIAL_PLAYER_X =
    GAME_WIDTH / 2 -
    PLAYER_SIZE / 2;

  /* ==========================================================
     STATE
  ========================================================== */

  const [
    gameStarted,
    setGameStarted,
  ] = useState(false);

  const [
    countdown,
    setCountdown,
  ] = useState(null);

  const [
    playerPositionX,
    setPlayerPositionX,
  ] = useState(INITIAL_PLAYER_X);

  const [
    debris,
    setDebris,
  ] = useState([]);

  const [
    score,
    setScore,
  ] = useState(0);

  const [
    gameOver,
    setGameOver,
  ] = useState(false);

  const [
    hasWon,
    setHasWon,
  ] = useState(false);

  const [
    sensorAvailable,
    setSensorAvailable,
  ] = useState(false);

  const [
    rescueVisible,
    setRescueVisible,
  ] = useState(false);

  const [
    rescueQuestion,
    setRescueQuestion,
  ] = useState(null);

  const [
    rescueLives,
    setRescueLives,
  ] = useState(MAX_RESCUE_LIVES);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState(null);

  const [
    answerFeedback,
    setAnswerFeedback,
  ] = useState(null);

  const [
    riskScore,
    setRiskScore,
  ] = useState(50);

  const [
    difficultyFactor,
    setDifficultyFactor,
  ] = useState(1);

  const [
    rewardClaimed,
    setRewardClaimed,
  ] = useState(false);

  /* ==========================================================
     REFS
  ========================================================== */

  const playerXRef =
    useRef(INITIAL_PLAYER_X);

  const debrisRef =
    useRef([]);

  const scoreRef =
    useRef(0);

  const gameRunningRef =
    useRef(false);

  const gameOverRef =
    useRef(false);

  const hasWonRef =
    useRef(false);

  const rewardClaimedRef =
    useRef(false);

  const movementRef =
    useRef(0);

  const animationFrameRef =
    useRef(null);

  const lastFrameTimeRef =
    useRef(null);

  const lastSpawnTimeRef =
    useRef(0);

  const countdownTimerRef =
    useRef(null);

  const sensorSubscriptionRef =
    useRef(null);

  /*
   * Every game/restart/rescue gets a unique session.
   */
  const gameSessionRef =
    useRef(0);

  /*
   * Prevents completion while the reward action is
   * being processed.
   */
  const completionInProgressRef =
    useRef(false);

  /*
   * Adaptive difficulty state.
   */
  const adaptiveRef =
    useRef({
      riskScore: 50,
      nearMisses: 0,
      successfulDodges: 0,
      collisions: 0,
      correctRescues: 0,
      lastRiskUpdate: 0,
    });

  /* ==========================================================
     HAPTICS
  ========================================================== */

  const safeImpact =
    useCallback(async (style) => {
      try {
        await Haptics.impactAsync(style);
      } catch (error) {
        // Haptics may be unavailable.
      }
    }, []);

  const safeNotification =
    useCallback(async (type) => {
      try {
        await Haptics.notificationAsync(
          type
        );
      } catch (error) {
        // Haptics may be unavailable.
      }
    }, []);

  /* ==========================================================
     ADAPTIVE DIFFICULTY
  ========================================================== */

  const calculateAdaptiveDifficulty =
    useCallback((timestamp) => {
      const adaptive =
        adaptiveRef.current;

      if (
        timestamp -
          adaptive.lastRiskUpdate <
        RISK_UPDATE_INTERVAL
      ) {
        return;
      }

      adaptive.lastRiskUpdate =
        timestamp;

      /*
       * Successful play makes the game gradually harder.
       */
      adaptive.riskScore -=
        adaptive.successfulDodges *
        RISK_DECREASE_SUCCESS;

      adaptive.successfulDodges = 0;

      /*
       * Correct rescue answers provide evidence that
       * the player can handle the situation, but we
       * still give a small temporary adjustment.
       */
      adaptive.riskScore +=
        adaptive.correctRescues * 2;

      adaptive.correctRescues = 0;

      adaptive.riskScore = clamp(
        adaptive.riskScore,
        0,
        100
      );

      const nextFactor =
        MAX_DIFFICULTY_FACTOR -
        (adaptive.riskScore / 100) *
          (
            MAX_DIFFICULTY_FACTOR -
            MIN_DIFFICULTY_FACTOR
          );

      const safeFactor = clamp(
        nextFactor,
        MIN_DIFFICULTY_FACTOR,
        MAX_DIFFICULTY_FACTOR
      );

      setRiskScore(
        Math.round(
          adaptive.riskScore
        )
      );

      setDifficultyFactor(
        safeFactor
      );
    }, []);

  /* ==========================================================
     PLAYER CLAMP
  ========================================================== */

  const clampPlayerX =
    useCallback(
      (x) => {
        return Math.max(
          0,
          Math.min(
            GAME_WIDTH - PLAYER_SIZE,
            x
          )
        );
      },
      [GAME_WIDTH]
    );

  /* ==========================================================
     DEBRIS
  ========================================================== */

  const createDebrisObject =
    useCallback(
      (y = -DEBRIS_SIZE) => ({
        id:
          `${Date.now()}-${Math.random()}`,

        x:
          Math.random() *
          Math.max(
            1,
            GAME_WIDTH - DEBRIS_SIZE
          ),

        y,

        nearMissed: false,
      }),
      [GAME_WIDTH]
    );

  const createInitialDebris =
    useCallback(() => {
      const objects = [];

      for (
        let index = 0;
        index < config.spawnCount;
        index += 1
      ) {
        objects.push({
          id:
            `${Date.now()}-${index}-${Math.random()}`,

          x:
            Math.random() *
            Math.max(
              1,
              GAME_WIDTH - DEBRIS_SIZE
            ),

          y:
            -DEBRIS_SIZE -
            index * 120 -
            Math.random() * 90,

          nearMissed: false,
        });
      }

      return objects;
    }, [
      GAME_WIDTH,
      config.spawnCount,
    ]);

  /* ==========================================================
     SENSOR
  ========================================================== */

  const stopSensor =
    useCallback(() => {
      if (
        sensorSubscriptionRef.current
      ) {
        try {
          sensorSubscriptionRef.current.remove();
        } catch (error) {
          // Ignore sensor cleanup errors.
        }

        sensorSubscriptionRef.current =
          null;
      }

      movementRef.current = 0;
    }, []);

  /* ==========================================================
     GAME LOOP STOP
  ========================================================== */

  const stopGameLoop =
    useCallback(() => {
      gameRunningRef.current = false;

      gameSessionRef.current += 1;

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }

      lastFrameTimeRef.current = null;
    }, []);

  /* ==========================================================
     RESET
  ========================================================== */

  const resetGame =
    useCallback(() => {
      if (
        countdownTimerRef.current
      ) {
        clearInterval(
          countdownTimerRef.current
        );

        countdownTimerRef.current =
          null;
      }

      stopGameLoop();
      stopSensor();

      playerXRef.current =
        INITIAL_PLAYER_X;

      debrisRef.current = [];

      scoreRef.current = 0;

      gameRunningRef.current = false;
      gameOverRef.current = false;
      hasWonRef.current = false;

      rewardClaimedRef.current =
        false;

      completionInProgressRef.current =
        false;

      movementRef.current = 0;

      adaptiveRef.current = {
        riskScore: 50,
        nearMisses: 0,
        successfulDodges: 0,
        collisions: 0,
        correctRescues: 0,
        lastRiskUpdate: 0,
      };

      setGameStarted(false);
      setCountdown(null);

      setPlayerPositionX(
        INITIAL_PLAYER_X
      );

      setDebris([]);
      setScore(0);

      setGameOver(false);
      setHasWon(false);

      setRescueVisible(false);
      setRescueQuestion(null);

      setSelectedAnswer(null);
      setAnswerFeedback(null);

      setRescueLives(
        MAX_RESCUE_LIVES
      );

      setRiskScore(50);
      setDifficultyFactor(1);

      setRewardClaimed(false);
    }, [
      INITIAL_PLAYER_X,
      stopGameLoop,
      stopSensor,
    ]);

  /* ==========================================================
     GAME OVER
  ========================================================== */

  const finishGame =
    useCallback(() => {
      if (
        gameOverRef.current ||
        hasWonRef.current
      ) {
        return;
      }

      gameRunningRef.current = false;
      gameOverRef.current = true;

      stopSensor();

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }

      lastFrameTimeRef.current = null;

      setGameOver(true);

      safeNotification(
        Haptics.NotificationFeedbackType.Error
      );
    }, [
      safeNotification,
      stopSensor,
    ]);

  /* ==========================================================
     WIN
  ========================================================== */

  const winGame =
    useCallback(() => {
      if (
        hasWonRef.current ||
        gameOverRef.current
      ) {
        return;
      }

      gameRunningRef.current = false;
      hasWonRef.current = true;

      stopSensor();

      scoreRef.current =
        config.targetScore;

      setScore(
        config.targetScore
      );

      setHasWon(true);

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }

      lastFrameTimeRef.current = null;

      safeNotification(
        Haptics.NotificationFeedbackType.Success
      );
    }, [
      config.targetScore,
      safeNotification,
      stopSensor,
    ]);

  /* ==========================================================
     COLLISION
  ========================================================== */

  const checkCollision =
    useCallback(
      (playerX, debrisItem) => {
        const playerTop =
          GAME_HEIGHT -
          PLAYER_SIZE -
          PLAYER_BOTTOM_OFFSET -
          FLOOD_HEIGHT;

        const playerLeft =
          playerX +
          COLLISION_PADDING;

        const playerRight =
          playerX +
          PLAYER_SIZE -
          COLLISION_PADDING;

        const playerCollisionTop =
          playerTop +
          COLLISION_PADDING;

        const playerCollisionBottom =
          playerTop +
          PLAYER_SIZE -
          COLLISION_PADDING;

        const debrisLeft =
          debrisItem.x +
          COLLISION_PADDING;

        const debrisRight =
          debrisItem.x +
          DEBRIS_SIZE -
          COLLISION_PADDING;

        const debrisTop =
          debrisItem.y +
          COLLISION_PADDING;

        const debrisBottom =
          debrisItem.y +
          DEBRIS_SIZE -
          COLLISION_PADDING;

        return (
          playerLeft <
            debrisRight &&
          playerRight >
            debrisLeft &&
          playerCollisionTop <
            debrisBottom &&
          playerCollisionBottom >
            debrisTop
        );
      },
      [GAME_HEIGHT]
    );

  /* ==========================================================
     RESCUE
  ========================================================== */

  const triggerRescueQuestion =
    useCallback(() => {
      if (rescueLives <= 0) {
        finishGame();
        return;
      }

      gameRunningRef.current =
        false;

      stopSensor();

      /*
       * Kill the current animation session.
       */
      gameSessionRef.current += 1;

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }

      lastFrameTimeRef.current = null;

      adaptiveRef.current.collisions +=
        1;

      adaptiveRef.current.riskScore +=
        RISK_INCREASE_COLLISION;

      adaptiveRef.current.riskScore =
        clamp(
          adaptiveRef.current.riskScore,
          0,
          100
        );

      setRiskScore(
        Math.round(
          adaptiveRef.current.riskScore
        )
      );

      const question =
        getRandomQuestion();

      setRescueQuestion(question);
      setSelectedAnswer(null);
      setAnswerFeedback(null);
      setRescueVisible(true);

      safeNotification(
        Haptics.NotificationFeedbackType.Warning
      );
    }, [
      finishGame,
      rescueLives,
      safeNotification,
      stopSensor,
    ]);

  /* ==========================================================
     GAME LOOP
  ========================================================== */

  const runGameLoop =
    useCallback(
      (timestamp, sessionId) => {
        if (
          sessionId !==
          gameSessionRef.current
        ) {
          return;
        }

        if (
          !gameRunningRef.current ||
          gameOverRef.current ||
          hasWonRef.current ||
          rescueVisible
        ) {
          return;
        }

        if (
          lastFrameTimeRef.current ===
          null
        ) {
          lastFrameTimeRef.current =
            timestamp;
        }

        const delta =
          Math.min(
            timestamp -
              lastFrameTimeRef.current,
            50
          ) / 1000;

        lastFrameTimeRef.current =
          timestamp;

        calculateAdaptiveDifficulty(
          timestamp
        );

        const adaptive =
          adaptiveRef.current;

        const factor = clamp(
          MAX_DIFFICULTY_FACTOR -
            (
              adaptive.riskScore /
              100
            ) *
            (
              MAX_DIFFICULTY_FACTOR -
              MIN_DIFFICULTY_FACTOR
            ),
          MIN_DIFFICULTY_FACTOR,
          MAX_DIFFICULTY_FACTOR
        );

        /* ------------------------------------------------------
           PLAYER
        ------------------------------------------------------ */

        let nextPlayerX =
          playerXRef.current;

        const tilt =
          movementRef.current;

        if (
          Math.abs(tilt) >=
          SENSOR_DEAD_ZONE
        ) {
          nextPlayerX +=
            tilt *
            config.playerSpeed *
            delta;
        }

        nextPlayerX =
          clampPlayerX(
            nextPlayerX
          );

        playerXRef.current =
          nextPlayerX;

        setPlayerPositionX(
          nextPlayerX
        );

        /* ------------------------------------------------------
           DEBRIS MOVEMENT
        ------------------------------------------------------ */

        const effectiveDebrisSpeed =
          config.debrisSpeed *
          factor;

        const movedDebris =
          debrisRef.current.map(
            (item) => ({
              ...item,

              y:
                item.y +
                effectiveDebrisSpeed *
                delta,
            })
          );

        /* ------------------------------------------------------
           COLLISION / NEAR MISS
        ------------------------------------------------------ */

        let collision = false;

        const checkedDebris =
          movedDebris.map(
            (item) => {
              if (
                checkCollision(
                  nextPlayerX,
                  item
                )
              ) {
                collision = true;
                return item;
              }

              /*
               * Near miss gives the adaptive algorithm
               * evidence that the player is operating
               * close to danger.
               */
              if (
                !item.nearMissed &&
                item.y >
                  GAME_HEIGHT -
                  PLAYER_SIZE -
                  PLAYER_BOTTOM_OFFSET -
                  FLOOD_HEIGHT -
                  45 &&
                item.y <
                  GAME_HEIGHT -
                  PLAYER_SIZE -
                  PLAYER_BOTTOM_OFFSET -
                  FLOOD_HEIGHT +
                  55
              ) {
                const horizontalGap =
                  Math.abs(
                    (
                      item.x +
                      DEBRIS_SIZE / 2
                    ) -
                    (
                      nextPlayerX +
                      PLAYER_SIZE / 2
                    )
                  );

                if (
                  horizontalGap <=
                  NEAR_MISS_DISTANCE
                ) {
                  adaptive.nearMisses +=
                    1;

                  adaptive.riskScore +=
                    RISK_INCREASE_NEAR_MISS;

                  adaptive.riskScore =
                    clamp(
                      adaptive.riskScore,
                      0,
                      100
                    );

                  return {
                    ...item,
                    nearMissed: true,
                  };
                }
              }

              return item;
            }
          );

        if (collision) {
          debrisRef.current =
            checkedDebris;

          setDebris(
            checkedDebris
          );

          triggerRescueQuestion();

          return;
        }

        /* ------------------------------------------------------
           PASSED OBSTACLES
        ------------------------------------------------------ */

        let passedCount = 0;

        const survivingDebris =
          checkedDebris.filter(
            (item) => {
              if (
                item.y >
                GAME_HEIGHT
              ) {
                passedCount += 1;

                adaptive.successfulDodges +=
                  1;

                return false;
              }

              return true;
            }
          );

        /* ------------------------------------------------------
           SCORE
        ------------------------------------------------------ */

        if (passedCount > 0) {
          const nextScore =
            Math.min(
              config.targetScore,
              scoreRef.current +
                passedCount * 10
            );

          scoreRef.current =
            nextScore;

          setScore(nextScore);

          if (
            nextScore >=
            config.targetScore
          ) {
            debrisRef.current =
              survivingDebris;

            setDebris(
              survivingDebris
            );

            winGame();

            return;
          }
        }

        /* ------------------------------------------------------
           ADAPTIVE SPAWN
        ------------------------------------------------------ */

        const effectiveSpawnInterval =
          config.spawnInterval /
          factor;

        if (
          timestamp -
            lastSpawnTimeRef.current >=
          effectiveSpawnInterval
        ) {
          lastSpawnTimeRef.current =
            timestamp;

          if (
            survivingDebris.length <
            config.spawnCount
          ) {
            survivingDebris.push(
              createDebrisObject()
            );
          }
        }

        /*
         * Prevent runaway obstacle count.
         */
        while (
          survivingDebris.length >
          config.spawnCount
        ) {
          survivingDebris.shift();
        }

        debrisRef.current =
          survivingDebris;

        setDebris(
          survivingDebris
        );

        animationFrameRef.current =
          requestAnimationFrame(
            (nextTimestamp) =>
              runGameLoop(
                nextTimestamp,
                sessionId
              )
          );
      },
      [
        calculateAdaptiveDifficulty,
        checkCollision,
        clampPlayerX,
        config.debrisSpeed,
        config.playerSpeed,
        config.spawnCount,
        config.spawnInterval,
        config.targetScore,
        createDebrisObject,
        GAME_HEIGHT,
        rescueVisible,
        triggerRescueQuestion,
        winGame,
      ]
    );

  /* ==========================================================
     RESCUE ANSWER
  ========================================================== */

  const handleRescueAnswer =
    useCallback(
      (answerId) => {
        if (
          !rescueQuestion ||
          selectedAnswer
        ) {
          return;
        }

        setSelectedAnswer(
          answerId
        );

        const correct =
          answerId ===
          rescueQuestion.correct;

        if (!correct) {
          setAnswerFeedback(
            'wrong'
          );

          safeNotification(
            Haptics.NotificationFeedbackType.Error
          );

          setTimeout(() => {
            setRescueVisible(false);
            setRescueQuestion(null);

            finishGame();
          }, 850);

          return;
        }

        setAnswerFeedback(
          'correct'
        );

        safeNotification(
          Haptics.NotificationFeedbackType.Success
        );

        adaptiveRef.current.correctRescues +=
          1;

        adaptiveRef.current.riskScore -=
          RISK_DECREASE_CORRECT_RESCUE;

        adaptiveRef.current.riskScore =
          clamp(
            adaptiveRef.current.riskScore,
            0,
            100
          );

        const nextScore =
          Math.min(
            config.targetScore,
            scoreRef.current +
              RESCUE_POINTS
          );

        scoreRef.current =
          nextScore;

        setScore(nextScore);

        setRiskScore(
          Math.round(
            adaptiveRef.current.riskScore
          )
        );

        const nextFactor =
          MAX_DIFFICULTY_FACTOR -
          (
            adaptiveRef.current
              .riskScore / 100
          ) *
          (
            MAX_DIFFICULTY_FACTOR -
            MIN_DIFFICULTY_FACTOR
          );

        setDifficultyFactor(
          clamp(
            nextFactor,
            MIN_DIFFICULTY_FACTOR,
            MAX_DIFFICULTY_FACTOR
          )
        );

        setRescueLives(
          (value) =>
            Math.max(
              0,
              value - 1
            )
        );

        /*
         * Clear nearby obstacles.
         */
        debrisRef.current =
          debrisRef.current.filter(
            (item) =>
              item.y <
              GAME_HEIGHT * 0.35
          );

        setDebris(
          debrisRef.current
        );

        /*
         * Kill old session.
         */
        const newSession =
          gameSessionRef.current +
          1;

        gameSessionRef.current =
          newSession;

        setTimeout(() => {
          setRescueVisible(false);
          setRescueQuestion(null);
          setSelectedAnswer(null);
          setAnswerFeedback(null);

          if (
            nextScore >=
            config.targetScore
          ) {
            winGame();
            return;
          }

          gameOverRef.current = false;
          hasWonRef.current = false;
          gameRunningRef.current = true;

          lastFrameTimeRef.current =
            null;

          lastSpawnTimeRef.current =
            performance.now();

          animationFrameRef.current =
            requestAnimationFrame(
              (timestamp) =>
                runGameLoop(
                  timestamp,
                  newSession
                )
            );
        }, 700);
      },
      [
        config.targetScore,
        finishGame,
        GAME_HEIGHT,
        rescueQuestion,
        runGameLoop,
        safeNotification,
        selectedAnswer,
        winGame,
      ]
    );

  /* ==========================================================
     BEGIN GAME
  ========================================================== */

  const beginGame =
    useCallback(() => {
      const sessionId =
        gameSessionRef.current +
        1;

      gameSessionRef.current =
        sessionId;

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }

      playerXRef.current =
        INITIAL_PLAYER_X;

      const initialDebris =
        createInitialDebris();

      debrisRef.current =
        initialDebris;

      scoreRef.current = 0;

      gameRunningRef.current = true;
      gameOverRef.current = false;
      hasWonRef.current = false;

      rewardClaimedRef.current =
        false;

      completionInProgressRef.current =
        false;

      movementRef.current = 0;

      lastFrameTimeRef.current =
        null;

      lastSpawnTimeRef.current =
        performance.now();

      adaptiveRef.current = {
        riskScore: 50,
        nearMisses: 0,
        successfulDodges: 0,
        collisions: 0,
        correctRescues: 0,
        lastRiskUpdate:
          performance.now(),
      };

      setRiskScore(50);
      setDifficultyFactor(1);

      setPlayerPositionX(
        INITIAL_PLAYER_X
      );

      setDebris(initialDebris);
      setScore(0);

      setGameOver(false);
      setHasWon(false);

      setRewardClaimed(false);

      setRescueLives(
        MAX_RESCUE_LIVES
      );

      setGameStarted(true);

      safeNotification(
        Haptics.NotificationFeedbackType.Success
      );

      animationFrameRef.current =
        requestAnimationFrame(
          (timestamp) =>
            runGameLoop(
              timestamp,
              sessionId
            )
        );
    }, [
      INITIAL_PLAYER_X,
      createInitialDebris,
      runGameLoop,
      safeNotification,
    ]);

  /* ==========================================================
     START GAME
  ========================================================== */

  const startGame =
    useCallback(() => {
      if (
        gameRunningRef.current ||
        countdown !== null
      ) {
        return;
      }

      if (
        countdownTimerRef.current
      ) {
        clearInterval(
          countdownTimerRef.current
        );

        countdownTimerRef.current =
          null;
      }

      stopGameLoop();
      stopSensor();

      playerXRef.current =
        INITIAL_PLAYER_X;

      debrisRef.current = [];

      scoreRef.current = 0;

      gameOverRef.current = false;
      hasWonRef.current = false;
      gameRunningRef.current = false;

      rewardClaimedRef.current =
        false;

      completionInProgressRef.current =
        false;

      setPlayerPositionX(
        INITIAL_PLAYER_X
      );

      setDebris([]);
      setScore(0);

      setGameOver(false);
      setHasWon(false);

      setRescueVisible(false);
      setRescueQuestion(null);

      setRescueLives(
        MAX_RESCUE_LIVES
      );

      setRewardClaimed(false);

      setGameStarted(false);

      let count = 3;

      setCountdown(count);

      safeImpact(
        Haptics.ImpactFeedbackStyle.Light
      );

      countdownTimerRef.current =
        setInterval(() => {
          count -= 1;

          if (count <= 0) {
            clearInterval(
              countdownTimerRef.current
            );

            countdownTimerRef.current =
              null;

            setCountdown(null);

            beginGame();

            return;
          }

          setCountdown(count);

          safeImpact(
            Haptics.ImpactFeedbackStyle.Light
          );
        }, 700);
    }, [
      beginGame,
      countdown,
      INITIAL_PLAYER_X,
      safeImpact,
      stopGameLoop,
      stopSensor,
    ]);

  /* ==========================================================
     TOUCH CONTROLS
  ========================================================== */

  const movePlayer =
    useCallback(
      (direction) => {
        if (
          !gameRunningRef.current ||
          gameOverRef.current ||
          hasWonRef.current
        ) {
          return;
        }

        const amount =
          config.playerSpeed *
          TOUCH_MOVE_MULTIPLIER;

        let nextX =
          playerXRef.current;

        if (
          direction === 'left'
        ) {
          nextX -= amount;
        }

        if (
          direction === 'right'
        ) {
          nextX += amount;
        }

        nextX =
          clampPlayerX(nextX);

        playerXRef.current =
          nextX;

        setPlayerPositionX(
          nextX
        );

        safeImpact(
          Haptics.ImpactFeedbackStyle.Light
        );
      },
      [
        clampPlayerX,
        config.playerSpeed,
        safeImpact,
      ]
    );

  /* ==========================================================
     ACCELEROMETER
  ========================================================== */

  useEffect(() => {
    let mounted = true;

    const setupAccelerometer =
      async () => {
        if (
          !gameStarted ||
          gameOver ||
          hasWon ||
          rescueVisible
        ) {
          stopSensor();
          return;
        }

        try {
          const available =
            await Accelerometer.isAvailableAsync();

          if (!mounted) {
            return;
          }

          if (!available) {
            setSensorAvailable(
              false
            );

            return;
          }

          setSensorAvailable(
            true
          );

          Accelerometer.setUpdateInterval(
            50
          );

          stopSensor();

          sensorSubscriptionRef.current =
            Accelerometer.addListener(
              (data) => {
                if (
                  !gameRunningRef.current
                ) {
                  return;
                }

                const value =
                  Number(data?.x) ||
                  0;

                movementRef.current =
                  clamp(
                    value,
                    -1,
                    1
                  );
              }
            );
        } catch (error) {
          console.log(
            'FloodRunner accelerometer error:',
            error
          );

          if (mounted) {
            setSensorAvailable(
              false
            );
          }
        }
      };

    setupAccelerometer();

    return () => {
      mounted = false;
      stopSensor();
    };
  }, [
    gameStarted,
    gameOver,
    hasWon,
    rescueVisible,
    stopSensor,
  ]);

  /* ==========================================================
     BACK BUTTON
  ========================================================== */

  const handleBack =
    useCallback(() => {
      /*
       * Stop every active game resource before leaving.
       */
      stopGameLoop();
      stopSensor();

      if (
        countdownTimerRef.current
      ) {
        clearInterval(
          countdownTimerRef.current
        );

        countdownTimerRef.current =
          null;
      }

      navigation.goBack();
    }, [
      navigation,
      stopGameLoop,
      stopSensor,
    ]);

  /* ==========================================================
     ANDROID HARDWARE BACK
  ========================================================== */

  useEffect(() => {
    const subscription =
      BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          handleBack();
          return true;
        }
      );

    return () => {
      subscription.remove();
    };
  }, [handleBack]);

  /* ==========================================================
     CLEANUP
  ========================================================== */

  useEffect(() => {
    return () => {
      if (
        countdownTimerRef.current
      ) {
        clearInterval(
          countdownTimerRef.current
        );
      }

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      if (
        sensorSubscriptionRef.current
      ) {
        try {
          sensorSubscriptionRef.current.remove();
        } catch (error) {
          // Ignore.
        }
      }

      gameRunningRef.current =
        false;
    };
  }, []);

  /* ==========================================================
     COMPLETE MISSION
  ========================================================== */

//   const handleClaimReward = useCallback(() => {
//   if (rewardClaimed) {
//     return;
//   }

//   if (!missionId) {
//     console.warn('FloodRunner: missing missionId');
//     return;
//   }

//   completeMission(
//     missionId,
//     missionXpReward,
//     missionCoinReward
//   );

//   setRewardClaimed(true);
// }, [
//   rewardClaimed,
//   missionId,
//   missionXpReward,
//   missionCoinReward,
//   completeMission,
// ]);
  const handleClaimReward = useCallback(async () => {
    /*
    * The game must genuinely be won.
    */
    if (!hasWonRef.current) {
      return;
    }

    /*
    * Prevent double tapping.
    */
    if (
      rewardClaimedRef.current ||
      completionInProgressRef.current
    ) {
      return;
    }

    completionInProgressRef.current = true;
    rewardClaimedRef.current = true;
    setRewardClaimed(true);

    try {
      await Promise.resolve(
        completeMission(
          campaignMissionId,
          missionXpReward,
          missionCoinReward
        )
      );
    } catch (error) {
      console.error(
        'FloodRunner mission completion error:',
        error
      );

      rewardClaimedRef.current = false;
      completionInProgressRef.current = false;
      setRewardClaimed(false);

      return;
    }

    setTimeout(() => {
      resetGame();
      navigation.goBack();
    }, 250);
  }, [
    campaignMissionId,
    completeMission,
    missionXpReward,
    missionCoinReward,
    navigation,
    resetGame,
  ]);


  // const handleClaimReward = useCallback(async() => {
  //     /*
  //      * The game must genuinely be won.
  //      */
  //     if (!hasWonRef.current) {
  //       return;
  //     }

  //     /*
  //      * Prevent double tapping.
  //      */
  //     if (
  //       rewardClaimedRef.current ||
  //       completionInProgressRef.current
  //     ) {
  //       return;
  //     }

  //     completionInProgressRef.current =
  //       true;

  //     rewardClaimedRef.current =
  //       true;

  //     setRewardClaimed(true);

  //     /*
  //      * ======================================================
  //      * IMPORTANT MISSION CONNECTION
  //      * ======================================================
  //      *
  //      * DO NOT use:
  //      *
  //      * missionId: 'floodRunner'
  //      *
  //      * because MissionsScreen does NOT look for that key.
  //      *
  //      * MissionsScreen looks for:
  //      *
  //      * completedMissions['level-2']
  //      * completedMissions['level-5']
  //      * completedMissions['level-8']
  //      *
  //      * Therefore we send the actual mission ID.
  //      */
  //     try {
  //       await Promise.resolve(
  //         completeMission({
  //           // missionId: campaignMissionId,
  //           // /*
  //           //  * Campaign level:
  //           //  * 2 / 5 / 8
  //           //  */
  //           // level: campaignLevel,
  //           // /*
  //           //  * Internal Flood Runner level:
  //           //  * 1 / 2 / 3
  //           //  */
  //           // gameLevel,
  //           // score: scoreRef.current,

  //           // /*
  //           //  * Rewards supplied by MissionsScreen.
  //           //  */
  //           // xp:
  //           //   missionXpReward,

  //           // coins:
  //           //   missionCoinReward,

  //           // /*
  //           //  * Extra aliases are harmless for contexts
  //           //  * that use them and make the completion
  //           //  * payload explicit.
  //           //  */
  //           // xpreward:
  //           //   missionXpReward,

  //           // coinreward:
  //           //   missionCoinReward,

  //           // game:
  //           //   'FloodRunnerGameModal',
  //           campaignMissionId,
  //           missionXpReward,
  //           missionCoinReward
  //         })
  //       );
  //     } catch (error) {
  //       console.error(
  //         'FloodRunner mission completion error:',
  //         error
  //       );

  //       /*
  //        * Allow the player to retry claiming if the
  //        * UserContext operation failed.
  //        */
  //       rewardClaimedRef.current =
  //         false;

  //       completionInProgressRef.current =
  //         false;

  //       setRewardClaimed(false);

  //       return;
  //     }

  //     /*
  //      * UserContext is now the source of truth.
  //      *
  //      * MissionsScreen will see:
  //      *
  //      * completedMissions[level-X] === true
  //      *
  //      * and unlock the next campaign mission.
  //      */
  //     setTimeout(() => {
  //       resetGame();

  //       navigation.goBack();
  //     }, 250);
  //   }, [
  //     campaignLevel,
  //     campaignMissionId,
  //     completeMission,
  //     gameLevel,
  //     missionCoinReward,
  //     missionXpReward,
  //     navigation,
  //     resetGame,
  //   ]);

  /* ==========================================================
     PROGRESS
  ========================================================== */

  const progressPercentage =
    Math.min(
      100,
      (
        score /
        config.targetScore
      ) * 100
    );

  /* ==========================================================
     DIFFICULTY LABEL
  ========================================================== */

  const difficultyLabel =
    useMemo(() => {
      if (
        difficultyFactor < 0.88
      ) {
        return t(
          'games.floodRunner.adaptive.easier'
        );
      }

      if (
        difficultyFactor > 1.05
      ) {
        return t(
          'games.floodRunner.adaptive.harder'
        );
      }

      return t(
        'games.floodRunner.adaptive.balanced'
      );
    }, [
      difficultyFactor,
      t,
    ]);

  /* ==========================================================
     RENDER HELPERS
  ========================================================== */

  const isCompact =
    windowHeight < 700;

  const isVerySmall =
    windowHeight < 620;

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop:
            Math.max(
              insets.top,
              6
            ),
          paddingBottom:
            Math.max(
              insets.bottom,
              6
            ),
        },
      ]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              Math.max(
                insets.bottom + 20,
                24
              ),
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces
      >
        <View
          style={[
            styles.modalContentCard,
            {
              width: Math.min(
                GAME_WIDTH + 24,
                windowWidth - 12
              ),
            },
          ]}
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <View
            style={[
              styles.modalHeader,
              isCompact &&
                styles.modalHeaderCompact,
            ]}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View
              style={styles.headerIcon}
            >
              <Ionicons
                name="water"
                size={20}
                color="#38BDF8"
              />
            </View>

            <View
              style={styles.headerTextArea}
            >
              <Text
                style={styles.modalTitle}
                numberOfLines={1}
              >
                {t(
                  'games.floodRunner.title'
                )}
              </Text>

              <Text
                style={styles.levelLabel}
              >
                {t(
                  'games.floodRunner.level',
                  {
                    level:
                      gameLevel,
                  }
                )}{' '}
                •{' '}
                {t(config.nameKey)}
              </Text>
            </View>
          </View>

          {/* =================================================
              CAMPAIGN CONNECTION
          ================================================= */}

          <View
            style={styles.campaignConnection}
          >
            <Ionicons
              name="map"
              size={14}
              color="#A855F7"
            />

            <Text
              style={
                styles.campaignConnectionText
              }
            >
              {t(
                'games.floodRunner.level',
                {
                  level:
                    campaignLevel,
                }
              )}
            </Text>

            <View
              style={
                styles.connectionDot
              }
            />

            <Text
              style={
                styles.campaignConnectionText
              }
            >
              {t(
                config.nameKey
              )}
            </Text>
          </View>

          {/* =================================================
              OBJECTIVE
          ================================================= */}

          <View
            style={styles.objectiveCard}
          >
            <View
              style={styles.objectiveIcon}
            >
              <Ionicons
                name="flag"
                size={18}
                color="#34D399"
              />
            </View>

            <View
              style={styles.objectiveTextArea}
            >
              <Text
                style={
                  styles.objectiveTitle
                }
              >
                {t(
                  'games.floodRunner.objective'
                )}
              </Text>

              <Text
                style={
                  styles.objectiveText
                }
              >
                {t(
                  'games.floodRunner.objectiveDescription'
                )}
              </Text>
            </View>
          </View>

          {/* =================================================
              INSTRUCTIONS
          ================================================= */}

          {!gameStarted &&
            !gameOver &&
            !hasWon &&
            countdown === null && (
              <View
                style={
                  styles.instructionsCard
                }
              >
                <View
                  style={
                    styles.instructionsHeader
                  }
                >
                  <Ionicons
                    name="help-circle"
                    size={20}
                    color="#FBBF24"
                  />

                  <Text
                    style={
                      styles.instructionsTitle
                    }
                  >
                    {t(
                      'games.floodRunner.howToPlay'
                    )}
                  </Text>
                </View>

                <InstructionRow
                  icon="swap-horizontal"
                  text={t(
                    'games.floodRunner.instructions.move'
                  )}
                />

                <InstructionRow
                  icon="warning"
                  text={t(
                    'games.floodRunner.instructions.avoid'
                  )}
                />

                <InstructionRow
                  icon="water"
                  text={t(
                    'games.floodRunner.instructions.flood'
                  )}
                />

                <InstructionRow
                  icon="flag"
                  text={t(
                    'games.floodRunner.instructions.finish',
                    {
                      score:
                        config.targetScore,
                    }
                  )}
                />

                <InstructionRow
                  icon="help-circle"
                  text={t(
                    'games.floodRunner.instructions.rescue'
                  )}
                />
              </View>
            )}

          {/* =================================================
              SENSOR STATUS
          ================================================= */}

          {gameStarted &&
            !gameOver &&
            !hasWon &&
            !rescueVisible && (
              <View
                style={
                  styles.sensorStatus
                }
              >
                <Ionicons
                  name={
                    sensorAvailable
                      ? 'phone-portrait-outline'
                      : 'hand-left-outline'
                  }
                  size={15}
                  color={
                    sensorAvailable
                      ? '#34D399'
                      : '#FBBF24'
                  }
                />

                <Text
                  style={[
                    styles.sensorText,
                    {
                      color:
                        sensorAvailable
                          ? '#34D399'
                          : '#FBBF24',
                    },
                  ]}
                >
                  {sensorAvailable
                    ? t(
                        'games.floodRunner.tiltActive'
                      )
                    : t(
                        'games.floodRunner.touchActive'
                      )}
                </Text>

                <View
                  style={
                    styles.lifeBadge
                  }
                >
                  <Ionicons
                    name="heart"
                    size={12}
                    color="#FB7185"
                  />

                  <Text
                    style={styles.lifeText}
                  >
                    {rescueLives}
                  </Text>
                </View>
              </View>
            )}

          {/* =================================================
              GAME CANVAS
          ================================================= */}

          <View
            style={[
              styles.gameCanvas,
              {
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
              },
            ]}
          >
            {/* SAFE ZONE */}

            <View
              style={styles.safeZone}
            >
              <View
                style={
                  styles.safeZoneIcon
                }
              >
                <Ionicons
                  name="shield-checkmark"
                  size={18}
                  color="#34D399"
                />
              </View>

              <View>
                <Text
                  style={
                    styles.safeZoneTitle
                  }
                >
                  {t(
                    'games.floodRunner.safeShelter'
                  )}
                </Text>

                <Text
                  style={
                    styles.safeZoneSub
                  }
                >
                  {t(
                    'games.floodRunner.highGround'
                  )}
                </Text>
              </View>
            </View>

            {/* DANGER FIELD */}

            <View
              style={styles.dangerField}
            >
              <View
                style={styles.routeLine}
              />

              <Text
                style={styles.dangerText}
              >
                {t(
                  'games.floodRunner.evacuationRoute'
                )}
              </Text>
            </View>

            {/* DEBRIS */}

            {gameStarted &&
              !gameOver &&
              !hasWon &&
              debris.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.debrisNode,
                    {
                      left:
                        item.x,
                      top:
                        item.y,
                    },
                  ]}
                >
                  <Ionicons
                    name="warning"
                    size={20}
                    color="#FCA5A5"
                  />
                </View>
              ))}

            {/* PLAYER */}

            {gameStarted &&
              !gameOver &&
              !hasWon &&
              !rescueVisible && (
                <View
                  style={[
                    styles.playerNode,
                    {
                      left:
                        playerPositionX,

                      bottom:
                        PLAYER_BOTTOM_OFFSET +
                        FLOOD_HEIGHT,
                    },
                  ]}
                >
                  <Ionicons
                    name="person"
                    size={25}
                    color="#FFFFFF"
                  />
                </View>
              )}

            {/* FLOOD */}

            <View
              style={styles.floodLayer}
            >
              <View
                style={
                  styles.waveContainer
                }
              >
                {Array.from({
                  length: 12,
                }).map(
                  (_, index) => (
                    <Text
                      key={index}
                      style={
                        styles.wave
                      }
                    >
                      ~
                    </Text>
                  )
                )}
              </View>

              <Text
                style={
                  styles.floodLabel
                }
              >
                {t(
                  'games.floodRunner.floodZone'
                )}
              </Text>
            </View>

            {/* ADAPTIVE BADGE */}

            {gameStarted &&
              !gameOver &&
              !hasWon &&
              !rescueVisible && (
                <View
                  style={
                    styles.adaptiveBadge
                  }
                >
                  <Ionicons
                    name="pulse"
                    size={11}
                    color="#38BDF8"
                  />

                  <Text
                    style={
                      styles.adaptiveText
                    }
                  >
                    {difficultyLabel}
                  </Text>
                </View>
              )}

            {/* COUNTDOWN */}

            {countdown !== null && (
              <View
                style={
                  styles.countdownOverlay
                }
              >
                <Text
                  style={
                    styles.countdownNumber
                  }
                >
                  {countdown}
                </Text>

                <Text
                  style={
                    styles.countdownText
                  }
                >
                  {t(
                    'games.floodRunner.getReady'
                  )}
                </Text>
              </View>
            )}

            {/* START */}

            {!gameStarted &&
              countdown === null &&
              !gameOver &&
              !hasWon && (
                <View
                  style={
                    styles.startOverlay
                  }
                >
                  <View
                    style={
                      styles.startIcon
                    }
                  >
                    <Ionicons
                      name="walk"
                      size={34}
                      color="#38BDF8"
                    />
                  </View>

                  <Text
                    style={
                      styles.startTitle
                    }
                  >
                    {t(
                      'games.floodRunner.ready'
                    )}
                  </Text>

                  <Text
                    style={
                      styles.startDescription
                    }
                  >
                    {t(
                      'games.floodRunner.startDescription'
                    )}
                  </Text>

                  <TouchableOpacity
                    style={
                      styles.startButton
                    }
                    onPress={
                      startGame
                    }
                    activeOpacity={
                      0.8
                    }
                  >
                    <Ionicons
                      name="play"
                      size={18}
                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.startButtonText
                      }
                    >
                      {t(
                        'games.floodRunner.start'
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

            {/* =================================================
                RESCUE
            ================================================= */}

            {rescueVisible &&
              rescueQuestion && (
                <View
                  style={
                    styles.rescueOverlay
                  }
                >
                  <View
                    style={
                      styles.rescueIcon
                    }
                  >
                    <Ionicons
                      name="medkit"
                      size={26}
                      color="#FBBF24"
                    />
                  </View>

                  <Text
                    style={
                      styles.rescueTitle
                    }
                  >
                    {t(
                      'games.floodRunner.rescueTitle'
                    )}
                  </Text>

                  <Text
                    style={
                      styles.rescueDescription
                    }
                  >
                    {t(
                      'games.floodRunner.rescueDescription'
                    )}
                  </Text>

                  <Text
                    style={
                      styles.rescueQuestion
                    }
                  >
                    {t(
                      rescueQuestion.questionKey
                    )}
                  </Text>

                  <View
                    style={
                      styles.answerList
                    }
                  >
                    {rescueQuestion.options.map(
                      (option) => {
                        const isSelected =
                          selectedAnswer ===
                          option.id;

                        const isCorrect =
                          rescueQuestion.correct ===
                          option.id;

                        let backgroundColor =
                          '#172033';

                        let borderColor =
                          '#334155';

                        if (
                          isSelected &&
                          answerFeedback ===
                            'correct'
                        ) {
                          backgroundColor =
                            '#064E3B';

                          borderColor =
                            '#10B981';
                        }

                        if (
                          isSelected &&
                          answerFeedback ===
                            'wrong'
                        ) {
                          backgroundColor =
                            '#450A0A';

                          borderColor =
                            '#EF4444';
                        }

                        if (
                          selectedAnswer &&
                          isCorrect &&
                          answerFeedback ===
                            'correct'
                        ) {
                          backgroundColor =
                            '#064E3B';

                          borderColor =
                            '#10B981';
                        }

                        return (
                          <TouchableOpacity
                            key={
                              option.id
                            }
                            disabled={
                              !!selectedAnswer
                            }
                            style={[
                              styles.answerButton,
                              {
                                backgroundColor,
                                borderColor,
                              },
                            ]}
                            onPress={() =>
                              handleRescueAnswer(
                                option.id
                              )
                            }
                            activeOpacity={
                              0.8
                            }
                          >
                            <View
                              style={
                                styles.answerLetter
                              }
                            >
                              <Text
                                style={
                                  styles.answerLetterText
                                }
                              >
                                {option.id.toUpperCase()}
                              </Text>
                            </View>

                            <Text
                              style={
                                styles.answerText
                              }
                            >
                              {t(
                                option.textKey
                              )}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>

                  <View
                    style={
                      styles.rescueLifeNotice
                    }
                  >
                    <Ionicons
                      name="heart"
                      size={13}
                      color="#FB7185"
                    />

                    <Text
                      style={
                        styles.rescueLifeText
                      }
                    >
                      {t(
                        'games.floodRunner.rescueLifeNotice'
                      )}
                    </Text>
                  </View>
                </View>
              )}

            {/* =================================================
                GAME OVER
            ================================================= */}

            {gameOver && (
              <View
                style={
                  styles.endGameOverlay
                }
              >
                <View
                  style={[
                    styles.resultIcon,
                    {
                      backgroundColor:
                        '#450A0A',
                    },
                  ]}
                >
                  <Ionicons
                    name="warning"
                    size={34}
                    color="#EF4444"
                  />
                </View>

                <Text
                  style={
                    styles.gameOverTitle
                  }
                >
                  {t(
                    'games.floodRunner.failed'
                  )}
                </Text>

                <Text
                  style={
                    styles.gameOverText
                  }
                >
                  {t(
                    'games.floodRunner.failedDescription'
                  )}
                </Text>

                <Text
                  style={
                    styles.finalScore
                  }
                >
                  {score} /{' '}
                  {
                    config.targetScore
                  }
                </Text>

                <TouchableOpacity
                  style={
                    styles.retryButton
                  }
                  onPress={
                    startGame
                  }
                  activeOpacity={
                    0.8
                  }
                >
                  <Ionicons
                    name="refresh"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    {t(
                      'games.floodRunner.retry'
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* =================================================
                WIN
            ================================================= */}

            {hasWon && (
              <View
                style={
                  styles.endGameOverlay
                }
              >
                <View
                  style={[
                    styles.resultIcon,
                    {
                      backgroundColor:
                        '#064E3B',
                    },
                  ]}
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={36}
                    color="#10B981"
                  />
                </View>

                <Text
                  style={
                    styles.successTitle
                  }
                >
                  {t(
                    'games.floodRunner.success'
                  )}
                </Text>

                <Text
                  style={
                    styles.gameOverText
                  }
                >
                  {t(
                    'games.floodRunner.successDescription'
                  )}
                </Text>

                <View
                  style={
                    styles.rewardRow
                  }
                >
                  <Reward
                    icon="flash"
                    value={`+${missionXpReward}`}
                    label={t(
                      'games.floodRunner.xp'
                    )}
                  />

                  <Reward
                    icon="cash"
                    value={`+${missionCoinReward}`}
                    label={t(
                      'games.floodRunner.coins'
                    )}
                  />
                </View>

                <View
                  style={
                    styles.unlockNotice
                  }
                >
                  <Ionicons
                    name="lock-open"
                    size={14}
                    color="#34D399"
                  />

                  <Text
                    style={
                      styles.unlockNoticeText
                    }
                  >
                    {t(
                      'games.floodRunner.successDescription'
                    )}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.claimRewardButton,
                    rewardClaimed &&
                      styles.claimDisabled,
                  ]}
                  disabled={
                    rewardClaimed
                  }
                  onPress={
                    handleClaimReward
                  }
                  activeOpacity={
                    0.8
                  }
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    {rewardClaimed
                      ? t(
                          'games.floodRunner.rewardClaimed'
                        )
                      : t(
                          'games.floodRunner.claimReward'
                        )}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* =================================================
              SCORE HUD
          ================================================= */}

          <View
            style={styles.gameHud}
          >
            <View
              style={
                styles.scoreHeader
              }
            >
              <Text
                style={styles.scoreLabel}
              >
                {t(
                  'games.floodRunner.score'
                )}
              </Text>

              <Text
                style={styles.scoreValue}
              >
                {score} /{' '}
                {
                  config.targetScore
                }
              </Text>
            </View>

            <View
              style={
                styles.progressBackground
              }
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      `${progressPercentage}%`,
                  },
                ]}
              />
            </View>

            {gameStarted &&
              !gameOver &&
              !hasWon && (
                <View
                  style={
                    styles.algorithmPanel
                  }
                >
                  <View>
                    <Text
                      style={
                        styles.algorithmLabel
                      }
                    >
                      ADAPTIVE SAFETY
                    </Text>

                    <Text
                      style={
                        styles.algorithmSub
                      }
                    >
                      {difficultyLabel}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.algorithmScoreBox
                    }
                  >
                    <Ionicons
                      name="pulse"
                      size={12}
                      color="#38BDF8"
                    />

                    <Text
                      style={
                        styles.algorithmValue
                      }
                    >
                      {riskScore}
                    </Text>
                  </View>
                </View>
              )}
          </View>

          {/* =================================================
              CONTROLS
          ================================================= */}

          {gameStarted &&
            !gameOver &&
            !hasWon &&
            !rescueVisible && (
              <View
                style={[
                  styles.controls,
                  isVerySmall &&
                    styles.controlsCompact,
                ]}
              >
                <TouchableOpacity
                  style={
                    styles.controlButton
                  }
                  onPress={() =>
                    movePlayer(
                      'left'
                    )
                  }
                  activeOpacity={
                    0.7
                  }
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.controlText
                    }
                  >
                    {t(
                      'games.floodRunner.left'
                    )}
                  </Text>
                </TouchableOpacity>

                <View
                  style={
                    styles.controlHint
                  }
                >
                  <Ionicons
                    name={
                      sensorAvailable
                        ? 'phone-portrait-outline'
                        : 'hand-left-outline'
                    }
                    size={21}
                    color="#38BDF8"
                  />

                  <Text
                    style={
                      styles.controlHintText
                    }
                  >
                    {sensorAvailable
                      ? t(
                          'games.floodRunner.tilt'
                        )
                      : t(
                          'games.floodRunner.touch'
                        )}
                  </Text>
                </View>

                <TouchableOpacity
                  style={
                    styles.controlButton
                  }
                  onPress={() =>
                    movePlayer(
                      'right'
                    )
                  }
                  activeOpacity={
                    0.7
                  }
                >
                  <Ionicons
                    name="arrow-forward"
                    size={24}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.controlText
                    }
                  >
                    {t(
                      'games.floodRunner.right'
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

          {/* =================================================
              EXIT BUTTON
          ================================================= */}

          {!gameStarted &&
            !countdown && (
              <TouchableOpacity
                style={
                  styles.bottomBackButton
                }
                onPress={
                  handleBack
                }
                activeOpacity={
                  0.8
                }
              >
                <Ionicons
                  name="arrow-back"
                  size={17}
                  color="#CBD5E1"
                />

                <Text
                  style={
                    styles.bottomBackText
                  }
                >
                  {t(
                    'common.back'
                  ) || 'Back'}
                </Text>
              </TouchableOpacity>
            )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ============================================================
   INSTRUCTION ROW
============================================================ */

function InstructionRow({
  icon,
  text,
}) {
  return (
    <View
      style={styles.instructionRow}
    >
      <View
        style={styles.instructionIcon}
      >
        <Ionicons
          name={icon}
          size={16}
          color="#38BDF8"
        />
      </View>

      <Text
        style={styles.instructionText}
      >
        {text}
      </Text>
    </View>
  );
}

/* ============================================================
   REWARD
============================================================ */

function Reward({
  icon,
  value,
  label,
}) {
  return (
    <View style={styles.reward}>
      <Ionicons
        name={icon}
        size={18}
        color="#FBBF24"
      />

      <Text
        style={styles.rewardValue}
      >
        {value}
      </Text>

      <Text
        style={styles.rewardLabel}
      >
        {label}
      </Text>
    </View>
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
  },

  scroll: {
    flex: 1,
    width: '100%',
  },

  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingTop: 6,
  },

  modalContentCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  /* ==========================================================
     HEADER
  ========================================================== */

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  modalHeaderCompact: {
    marginBottom: 7,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#172033',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#082F49',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  headerTextArea: {
    flex: 1,
  },

  modalTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },

  levelLabel: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },

  /* ==========================================================
     CAMPAIGN CONNECTION
  ========================================================== */

  campaignConnection: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#1E1B4B',
    borderWidth: 1,
    borderColor: '#4C1D95',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginBottom: 9,
  },

  campaignConnectionText: {
    color: '#C4B5FD',
    fontSize: 9,
    fontWeight: '800',
  },

  connectionDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#A855F7',
    marginHorizontal: 6,
  },

  /* ==========================================================
     OBJECTIVE
  ========================================================== */

  objectiveCard: {
    flexDirection: 'row',
    backgroundColor: '#0B1F1A',
    borderWidth: 1,
    borderColor: '#064E3B',
    borderRadius: 14,
    padding: 9,
    marginBottom: 9,
  },

  objectiveIcon: {
    width: 33,
    height: 33,
    borderRadius: 10,
    backgroundColor: '#052E25',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  objectiveTextArea: {
    flex: 1,
  },

  objectiveTitle: {
    color: '#34D399',
    fontWeight: '800',
    fontSize: 12,
  },

  objectiveText: {
    color: '#A7F3D0',
    fontSize: 10,
    marginTop: 2,
    lineHeight: 15,
  },

  /* ==========================================================
     INSTRUCTIONS
  ========================================================== */

  instructionsCard: {
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 9,
    marginBottom: 9,
  },

  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },

  instructionsTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginLeft: 7,
    fontSize: 12,
  },

  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },

  instructionIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#082F49',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },

  instructionText: {
    color: '#CBD5E1',
    fontSize: 10,
    flex: 1,
    lineHeight: 14,
  },

  /* ==========================================================
     SENSOR
  ========================================================== */

  sensorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 4,
  },

  sensorText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 5,
    flex: 1,
  },

  lifeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3F1722',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  lifeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginLeft: 4,
    fontSize: 10,
  },

  /* ==========================================================
     GAME
  ========================================================== */

  gameCanvas: {
    backgroundColor: '#07111F',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E3A5F',
    position: 'relative',
  },

  safeZone: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 55,
    backgroundColor: '#052E25',
    borderBottomWidth: 1,
    borderBottomColor: '#065F46',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    zIndex: 2,
  },

  safeZoneIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  safeZoneTitle: {
    color: '#6EE7B7',
    fontSize: 11,
    fontWeight: '800',
  },

  safeZoneSub: {
    color: '#A7F3D0',
    fontSize: 8,
    marginTop: 1,
  },

  dangerField: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    bottom: FLOOD_HEIGHT,
    backgroundColor: '#0B1626',
  },

  routeLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#1E3A5F',
    opacity: 0.7,
  },

  dangerText: {
    color: '#334155',
    fontSize: 8,
    position: 'absolute',
    top: 10,
    left: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  debrisNode: {
    position: 'absolute',
    width: DEBRIS_SIZE,
    height: DEBRIS_SIZE,
    borderRadius: 9,
    backgroundColor: '#451A1A',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },

  playerNode: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    borderRadius: 12,
    backgroundColor: '#0284C7',
    borderWidth: 2,
    borderColor: '#7DD3FC',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },

  floodLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: FLOOD_HEIGHT,
    backgroundColor: '#075985',
    borderTopWidth: 2,
    borderTopColor: '#38BDF8',
    zIndex: 3,
  },

  waveContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    top: -11,
    left: 0,
    right: 0,
  },

  wave: {
    color: '#7DD3FC',
    fontSize: 18,
    fontWeight: '900',
  },

  floodLabel: {
    color: '#BAE6FD',
    fontSize: 8,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 25,
    letterSpacing: 1,
  },

  adaptiveBadge: {
    position: 'absolute',
    top: 65,
    right: 8,
    backgroundColor: '#082F49',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 8,
  },

  adaptiveText: {
    color: '#7DD3FC',
    fontSize: 8,
    fontWeight: '700',
    marginLeft: 4,
  },

  /* ==========================================================
     COUNTDOWN
  ========================================================== */

  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(2,6,23,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },

  countdownNumber: {
    color: '#FFFFFF',
    fontSize: 68,
    fontWeight: '900',
  },

  countdownText: {
    color: '#7DD3FC',
    fontSize: 12,
    marginTop: 4,
  },

  /* ==========================================================
     START
  ========================================================== */

  startOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(2,6,23,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 15,
  },

  startIcon: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: '#082F49',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  startTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },

  startDescription: {
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 16,
    marginTop: 5,
    maxWidth: 270,
  },

  startButton: {
    marginTop: 15,
    backgroundColor: '#0284C7',
    borderRadius: 13,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginLeft: 7,
    fontSize: 12,
  },

  /* ==========================================================
     RESCUE
  ========================================================== */

  rescueOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(2,6,23,0.98)',
    alignItems: 'center',
    padding: 14,
    zIndex: 30,
  },

  rescueIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: '#422006',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },

  rescueTitle: {
    color: '#FBBF24',
    fontSize: 18,
    fontWeight: '900',
  },

  rescueDescription: {
    color: '#CBD5E1',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 8,
  },

  rescueQuestion: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 9,
  },

  answerList: {
    width: '100%',
  },

  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 11,
    padding: 7,
    marginBottom: 6,
  },

  answerLetter: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  answerLetterText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  answerText: {
    color: '#E2E8F0',
    fontSize: 9,
    lineHeight: 14,
    flex: 1,
  },

  rescueLifeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  rescueLifeText: {
    color: '#94A3B8',
    fontSize: 8,
    marginLeft: 4,
  },

  /* ==========================================================
     END GAME
  ========================================================== */

  endGameOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(2,6,23,0.97)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    zIndex: 25,
  },

  resultIcon: {
    width: 65,
    height: 65,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  gameOverTitle: {
    color: '#F87171',
    fontSize: 21,
    fontWeight: '900',
  },

  successTitle: {
    color: '#34D399',
    fontSize: 21,
    fontWeight: '900',
  },

  gameOverText: {
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 5,
    maxWidth: 270,
  },

  finalScore: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 10,
  },

  retryButton: {
    marginTop: 13,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  claimRewardButton: {
    marginTop: 12,
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  claimDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginLeft: 7,
    fontSize: 11,
  },

  rewardRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 24,
  },

  reward: {
    alignItems: 'center',
  },

  rewardValue: {
    color: '#FBBF24',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
  },

  rewardLabel: {
    color: '#94A3B8',
    fontSize: 8,
    marginTop: 1,
  },

  unlockNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#052E25',
    borderWidth: 1,
    borderColor: '#065F46',
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 9,
  },

  unlockNoticeText: {
    color: '#A7F3D0',
    fontSize: 8,
    marginLeft: 5,
    maxWidth: 190,
    textAlign: 'center',
  },

  /* ==========================================================
     HUD
  ========================================================== */

  gameHud: {
    marginTop: 9,
  },

  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  scoreLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  scoreValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  progressBackground: {
    height: 7,
    backgroundColor: '#1E293B',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 5,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 5,
  },

  algorithmPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    backgroundColor: '#081522',
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#12324A',
  },

  algorithmLabel: {
    color: '#64748B',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.6,
  },

  algorithmSub: {
    color: '#38BDF8',
    fontSize: 8,
    marginTop: 1,
    fontWeight: '700',
  },

  algorithmScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  algorithmValue: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '900',
  },

  /* ==========================================================
     CONTROLS
  ========================================================== */

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
  },

  controlsCompact: {
    marginTop: 7,
  },

  controlButton: {
    width: 78,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#172033',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },

  controlText: {
    color: '#CBD5E1',
    fontSize: 8,
    marginTop: 1,
    fontWeight: '700',
  },

  controlHint: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  controlHintText: {
    color: '#64748B',
    fontSize: 8,
    marginTop: 2,
  },

  /* ==========================================================
     BOTTOM BACK
  ========================================================== */

  bottomBackButton: {
    marginTop: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 11,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },

  bottomBackText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 6,
  },
});
