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
import { useTranslation } from 'react-i18next';
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
 * All visible text is represented by translation keys.
 *
 * This keeps the game logic independent from language.
 * ========================================================= */

const QUESTION_BANK = [

  {
    id: 'flood-warning',
    categoryKey: 'climateDefence.categories.hazardIdentification',

    questionKey:
      'climateDefence.questions.floodWarning.question',

    options: [
      {
        id: 'a',
        textKey:
          'climateDefence.questions.floodWarning.options.a',
        correct: true,
      },
      {
        id: 'b',
        textKey:
          'climateDefence.questions.floodWarning.options.b',
        correct: false,
      },
      {
        id: 'c',
        textKey:
          'climateDefence.questions.floodWarning.options.c',
        correct: false,
      },
      {
        id: 'd',
        textKey:
          'climateDefence.questions.floodWarning.options.d',
        correct: false,
      },
    ],

    explanationKey:
      'climateDefence.questions.floodWarning.explanation',
  },


  {
    id: 'flood-water',
    categoryKey: 'climateDefence.categories.floodResponse',

    questionKey:
      'climateDefence.questions.floodWater.question',

    options: [
      {
        id: 'a',
        textKey:
          'climateDefence.questions.floodWater.options.a',
        correct: true,
      },
      {
        id: 'b',
        textKey:
          'climateDefence.questions.floodWater.options.b',
        correct: false,
      },
      {
        id: 'c',
        textKey:
          'climateDefence.questions.floodWater.options.c',
        correct: false,
      },
      {
        id: 'd',
        textKey:
          'climateDefence.questions.floodWater.options.d',
        correct: false,
      },
    ],

    explanationKey:
      'climateDefence.questions.floodWater.explanation',
  },


  {
    id: 'evacuation',
    categoryKey: 'climateDefence.categories.evacuationDecision',

    questionKey:
      'climateDefence.questions.evacuation.question',

    options: [
      {
        id: 'a',
        textKey:
          'climateDefence.questions.evacuation.options.a',
        correct: true,
      },
      {
        id: 'b',
        textKey:
          'climateDefence.questions.evacuation.options.b',
        correct: false,
      },
      {
        id: 'c',
        textKey:
          'climateDefence.questions.evacuation.options.c',
        correct: false,
      },
      {
        id: 'd',
        textKey:
          'climateDefence.questions.evacuation.options.d',
        correct: false,
      },
    ],

    explanationKey:
      'climateDefence.questions.evacuation.explanation',
  },


  {
    id: 'weather-alert',
    categoryKey: 'climateDefence.categories.earlyWarning',

    questionKey:
      'climateDefence.questions.weatherAlert.question',

    options: [
      {
        id: 'a',
        textKey:
          'climateDefence.questions.weatherAlert.options.a',
        correct: true,
      },
      {
        id: 'b',
        textKey:
          'climateDefence.questions.weatherAlert.options.b',
        correct: false,
      },
      {
        id: 'c',
        textKey:
          'climateDefence.questions.weatherAlert.options.c',
        correct: false,
      },
      {
        id: 'd',
        textKey:
          'climateDefence.questions.weatherAlert.options.d',
        correct: false,
      },
    ],

    explanationKey:
      'climateDefence.questions.weatherAlert.explanation',
  },


  {
    id: 'go-bag',
    categoryKey: 'climateDefence.categories.preparedness',

    questionKey:
      'climateDefence.questions.goBag.question',

    options: [
      {
        id: 'a',
        textKey:
          'climateDefence.questions.goBag.options.a',
        correct: true,
      },
      {
        id: 'b',
        textKey:
          'climateDefence.questions.goBag.options.b',
        correct: false,
      },
      {
        id: 'c',
        textKey:
          'climateDefence.questions.goBag.options.c',
        correct: false,
      },
      {
        id: 'd',
        textKey:
          'climateDefence.questions.goBag.options.d',
        correct: false,
      },
    ],

    explanationKey:
      'climateDefence.questions.goBag.explanation',
  },


  {
    id: 'communication',
    categoryKey: 'climateDefence.categories.communication',

    questionKey:
      'climateDefence.questions.communication.question',

    options: [
      {
        id: 'a',
        textKey:
          'climateDefence.questions.communication.options.a',
        correct: true,
      },
      {
        id: 'b',
        textKey:
          'climateDefence.questions.communication.options.b',
        correct: false,
      },
      {
        id: 'c',
        textKey:
          'climateDefence.questions.communication.options.c',
        correct: false,
      },
      {
        id: 'd',
        textKey:
          'climateDefence.questions.communication.options.d',
        correct: false,
      },
    ],

    explanationKey:
      'climateDefence.questions.communication.explanation',
  },


  {
    id: 'power',
    categoryKey: 'climateDefence.categories.powerInterruption',

    questionKey:
      'climateDefence.questions.power.question',

    options: [
      {
        id: 'a',
        textKey:
          'climateDefence.questions.power.options.a',
        correct: true,
      },
      {
        id: 'b',
        textKey:
          'climateDefence.questions.power.options.b',
        correct: false,
      },
      {
        id: 'c',
        textKey:
          'climateDefence.questions.power.options.c',
        correct: false,
      },
      {
        id: 'd',
        textKey:
          'climateDefence.questions.power.options.d',
        correct: false,
      },
    ],

    explanationKey:
      'climateDefence.questions.power.explanation',
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
  const { t } = useTranslation();

  const {
    completeMission,
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

  const difficultyKey = String(difficulty).toUpperCase();

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

    if (passed && typeof completeMission === 'function') {
      completeMission(
        route.params.mission,
        finalScore,
        reward
      );
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

    setGameState(GAME_STATES.FINISHED);
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
            {t('climateDefence.title')}
          </Text>

          <Text style={styles.headerTitle}>
            {t('climateDefence.level', { level })}
          </Text>

        </View>

        <View style={styles.difficultyBadge}>

          <Text style={styles.difficultyText}>
            {t(`climateDefence.difficulty_level.${difficultyKey}`)}
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
            {t('climateDefence.mission_onboarding.title')}
          </Text>

          <Text style={styles.heroSubtitle}>
            {t('climateDefence.mission_onboarding.subtitle')}
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
                {t('climateDefence.mission_onboarding.missionBriefing')}
              </Text>

            </View>

            <Text style={styles.briefingText}>
              {t('climateDefence.mission_onboarding.briefingText')}
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
                {t('climateDefence.mission_onboarding.decisions')}
              </Text>

            </View>


            <View style={styles.parameterCard}>

              <Ionicons
                name="timer-outline"
                size={22}
                color="#F59E0B"
              />

              <Text style={styles.parameterValue}>
                {t('climateDefence.seconds', {
                  count: difficultyConfig.timePerQuestion,
                })}
              </Text>

              <Text style={styles.parameterLabel}>
                {t('climateDefence.mission_onboarding.perDecision')}
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
                {t('climateDefence.mission_onboarding.missionReward')}
              </Text>

            </View>

          </View>


          {/* Objective */}

          <View style={styles.objectiveCard}>

            <Text style={styles.objectiveTitle}>
              {t('climateDefence.mission_onboarding.objective')}
            </Text>

            <Text style={styles.objectiveText}>
              {t('climateDefence.mission_onboarding.objectiveText')}
            </Text>

          </View>


          <TouchableOpacity
            style={styles.primaryButton}
            onPress={startMission}
            activeOpacity={0.85}
          >

            <Text style={styles.primaryButtonText}>
              {t('climateDefence.buttons.beginMission')}
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
                {t('climateDefence.play.decisionProgress', {
                  current: questionNumber,
                  total: totalQuestions,
                })}
              </Text>

              <Text style={styles.categoryText}>
                {t(currentQuestion.categoryKey)}
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
                {t('climateDefence.play.responseWindow')}
              </Text>

              <Text
                style={[
                  styles.timerValue,
                  timeLeft <= 5 &&
                    styles.timerCritical,
                ]}
              >
                {t('climateDefence.seconds', {
                  count: timeLeft,
                })}
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
                {t('climateDefence.play.emergencyDecision')}
              </Text>

              <Text style={styles.questionText}>
                {t(currentQuestion.questionKey)}
              </Text>

            </View>

          </View>


          {/* Answer options */}

          <Text style={styles.selectLabel}>
            {t('climateDefence.play.selectResponse')}
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
                      {t(option.textKey)}
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
                {t('climateDefence.play.timeoutMessage')}
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
              {t('climateDefence.review.title')}
            </Text>

            <Text style={styles.reviewSubtitle}>
              {t('climateDefence.review.subtitle')}
            </Text>

          </View>


          {/* Score */}

          <View style={styles.reviewScoreCard}>

            <Text style={styles.reviewScoreLabel}>
              {t('climateDefence.review.decisionAccuracy')}
            </Text>

            <Text style={styles.reviewScore}>
              {correctAnswers} / {totalQuestions}
            </Text>

            <Text style={styles.reviewPoints}>
              {t('climateDefence.xp', {
                count: finalScore,
              })}
            </Text>

          </View>


          {/* Walkthrough */}

          <Text style={styles.walkthroughHeading}>
            {t('climateDefence.review.stepByStep')}
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
                          {t(question.categoryKey)}
                        </Text>

                        {correct ? (

                          <Text
                            style={
                              styles.correctStatus
                            }
                          >
                            {t('climateDefence.review.correct')}
                          </Text>

                        ) : timedOut ? (

                          <Text
                            style={
                              styles.timeoutStatus
                            }
                          >
                            {t('climateDefence.review.timeout')}
                          </Text>

                        ) : (

                          <Text
                            style={
                              styles.incorrectStatus
                            }
                          >
                            {t('climateDefence.review.review')}
                          </Text>

                        )}

                      </View>


                      <Text
                        style={
                          styles.timelineQuestion
                        }
                      >
                        {t(question.questionKey)}
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
                          {t('climateDefence.review.recommendedResponse')}
                        </Text>

                        <Text
                          style={
                            styles.recommendedText
                          }
                        >
                          {t(correctOption?.textKey)}
                        </Text>

                      </View>


                      <Text
                        style={styles.explanationText}
                      >
                        {t(question.explanationKey)}
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
              {t('climateDefence.buttons.recordMissionResult')}
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
              ? t('climateDefence.finished.completedTitle')
              : t('climateDefence.finished.recordedTitle')}

          </Text>


          <Text style={styles.resultSubtitle}>

            {passed
              ? t('climateDefence.finished.completedSubtitle')
              : t('climateDefence.finished.recordedSubtitle')}

          </Text>


          <View style={styles.finalStats}>

            <View style={styles.finalStat}>

              <Text style={styles.finalStatValue}>
                {finalScore}
              </Text>

              <Text style={styles.finalStatLabel}>
                {t('climateDefence.finished.prepPoints')}
              </Text>

            </View>


            <View style={styles.finalStatDivider} />


            <View style={styles.finalStat}>

              <Text style={styles.finalStatValue}>
                {correctAnswers}/{totalQuestions}
              </Text>

              <Text style={styles.finalStatLabel}>
                {t('climateDefence.finished.decisions')}
              </Text>

            </View>


            <View style={styles.finalStatDivider} />


            <View style={styles.finalStat}>

              <Text style={styles.finalStatValue}>
                {t(`missions.difficulty.${difficultyKey}`)}
              </Text>

              <Text style={styles.finalStatLabel}>
                {t('climateDefence.finished.difficulty')}
              </Text>

            </View>

          </View>


          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >

            <Text style={styles.primaryButtonText}>
              {t('climateDefence.buttons.returnToMissions')}
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

  header: {
    marginTop: 42,
    marginBottom: 14,
    minHeight: 52,
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
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8
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
    textAlign: 'center'
  },

  difficultyBadge: {
    minWidth: 58,
    minHeight: 34,
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
