// // // // import React, { createContext, useContext, useState } from 'react';
// // // // import { useUser } from './UserContext';

// // // // const GameContext = createContext();

// // // // export const GameProvider = ({ children }) => {
// // // //   const { updatePoints, points: totalUserPoints } = useUser();
  
// // // //   const [budget, setBudget] = useState(1000);
// // // //   const [hp, setHp] = useState(100);
// // // //   const [isPlaying, setIsPlaying] = useState(false);
// // // //   const [activeQuestion, setActiveQuestion] = useState(null);
// // // //   const [currentScore, setCurrentScore] = useState(0);

// // // //   const startWave = () => {
// // // //     setIsPlaying(true);
// // // //     setHp(100);
// // // //     setBudget(1000);
// // // //     setCurrentScore(0);
// // // //   };

// // // //   const answerQuiz = (isCorrect, xpReward = 50) => {
// // // //     if (isCorrect) {
// // // //       setBudget((prev) => prev + 200);
// // // //       setCurrentScore((prev) => prev + xpReward);
      
// // // //       // Direct Hook to update your Global User Profile and persist data
// // // //       updatePoints(xpReward); 
// // // //     } else {
// // // //       setHp((prev) => Math.max(0, prev - 25));
// // // //     }
// // // //     setActiveQuestion(null);
// // // //   };

// // // //   const completeGameSession = (bonusXp = 100) => {
// // // //     setIsPlaying(false);
// // // //     if (hp > 0) {
// // // //       updatePoints(bonusXp);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <GameContext.Provider value={{ 
// // // //       budget, 
// // // //       hp, 
// // // //       isPlaying, 
// // // //       activeQuestion, 
// // // //       currentScore,
// // // //       startWave, 
// // // //       answerQuiz, 
// // // //       completeGameSession,
// // // //       setActiveQuestion,
// // // //       setBudget,
// // // //       setHp
// // // //     }}>
// // // //       {children}
// // // //     </GameContext.Provider>
// // // //   );
// // // // };

// // // // export const useGame = () => useContext(GameContext);
// // // import React, { createContext, useContext, useState } from 'react';
// // // import { useUser } from './UserContext';

// // // const GameContext = createContext();

// // // export const GameProvider = ({ children }) => {
// // //   const { updatePoints, points: totalUserPoints } = useUser();
  
// // //   const [budget, setBudget] = useState(1000);
// // //   const [hp, setHp] = useState(100);
// // //   const [isPlaying, setIsPlaying] = useState(false);
// // //   const [activeQuestion, setActiveQuestion] = useState(null);
// // //   const [currentScore, setCurrentScore] = useState(0);

// // //   // NEW: Global celebration trigger
// // //   const [showConfetti, setShowConfetti] = useState(false);

// // //   const triggerConfetti = () => {
// // //     setShowConfetti(true);

// // //     setTimeout(() => {
// // //       setShowConfetti(false);
// // //     }, 4000);
// // //   };


// // //   const startWave = () => {
// // //     setIsPlaying(true);
// // //     setHp(100);
// // //     setBudget(1000);
// // //     setCurrentScore(0);
// // //   };


// // //   const answerQuiz = (isCorrect, xpReward = 50) => {
// // //     if (isCorrect) {
// // //       setBudget((prev) => prev + 200);
// // //       setCurrentScore((prev) => prev + xpReward);
      
// // //       updatePoints(xpReward); 
// // //     } else {
// // //       setHp((prev) => Math.max(0, prev - 25));
// // //     }

// // //     setActiveQuestion(null);
// // //   };


// // //   const completeGameSession = (bonusXp = 100) => {
// // //     setIsPlaying(false);

// // //     if (hp > 0) {
// // //       updatePoints(bonusXp);
// // //       triggerConfetti(); // optional: celebrate any completed session
// // //     }
// // //   };


// // //   return (
// // //     <GameContext.Provider value={{ 
// // //       budget, 
// // //       hp, 
// // //       isPlaying, 
// // //       activeQuestion, 
// // //       currentScore,

// // //       // Existing functions
// // //       startWave, 
// // //       answerQuiz, 
// // //       completeGameSession,
// // //       setActiveQuestion,
// // //       setBudget,
// // //       setHp,

// // //       // NEW
// // //       showConfetti,
// // //       triggerConfetti
// // //     }}>
// // //       {children}
// // //     </GameContext.Provider>
// // //   );
// // // };


// // // export const useGame = () => useContext(GameContext);

// // import React, {
// //   createContext,
// //   useContext,
// //   useState,
// // } from 'react';

// // import { useUser } from './UserContext';

// // const GameContext = createContext();

// // export const GameProvider = ({ children }) => {
// //   const { completeMission } = useUser();

// //   const [budget, setBudget] = useState(1000);
// //   const [hp, setHp] = useState(100);

// //   const [isPlaying, setIsPlaying] = useState(false);
// //   const [activeQuestion, setActiveQuestion] = useState(null);

// //   // Temporary score for the current game
// //   const [currentScore, setCurrentScore] = useState(0);

// //   // Current campaign mission
// //   const [currentMission, setCurrentMission] = useState(null);

// //   const [showConfetti, setShowConfetti] = useState(false);

// //   const triggerConfetti = () => {
// //     setShowConfetti(true);

// //     setTimeout(() => {
// //       setShowConfetti(false);
// //     }, 4000);
// //   };

// //   const startMission = (mission) => {
// //     setCurrentMission(mission);

// //     setIsPlaying(true);
// //     setHp(100);
// //     setBudget(1000);
// //     setCurrentScore(0);
// //     setActiveQuestion(null);
// //   };

// //   const answerQuiz = (isCorrect, xpReward = 0) => {
// //     if (isCorrect) {
// //       setBudget((prev) => prev + 200);

// //       setCurrentScore((prev) => prev + xpReward);
// //     } else {
// //       setHp((prev) => Math.max(0, prev - 25));
// //     }

// //     setActiveQuestion(null);
// //   };

// //   const completeGameSession = () => {
// //     if (!currentMission) {
// //       console.warn('No active mission');
// //       return;
// //     }

// //     if (hp <= 0) {
// //       setIsPlaying(false);
// //       return;
// //     }

// //     /*
// //      * IMPORTANT:
// //      * This is the ONLY place where the completed
// //      * mission should award the user's permanent rewards.
// //      */

// //     completeMission(
// //       currentMission.level,
// //       currentMission.xpReward,
// //       currentMission.coinReward
// //     );

// //     setIsPlaying(false);

// //     triggerConfetti();
// //   };

// //   const failGameSession = () => {
// //     setIsPlaying(false);
// //     setCurrentScore(0);
// //   };

// //   return (
// //     <GameContext.Provider
// //       value={{
// //         budget,
// //         hp,
// //         isPlaying,
// //         activeQuestion,
// //         currentScore,
// //         currentMission,

// //         startMission,
// //         answerQuiz,
// //         completeGameSession,
// //         failGameSession,

// //         setActiveQuestion,
// //         setBudget,
// //         setHp,

// //         showConfetti,
// //         triggerConfetti,
// //       }}
// //     >
// //       {children}
// //     </GameContext.Provider>
// //   );
// // };

// // export const useGame = () => useContext(GameContext);

// import React, { createContext, useContext, useState } from 'react';
// import { useUser } from './UserContext';

// const GameContext = createContext(null);

// export const GameProvider = ({ children }) => {
//   const {
//     updatePoints,
//     addPrepCoins,
//   } = useUser();

//   const [budget, setBudget] = useState(1000);
//   const [hp, setHp] = useState(100);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [activeQuestion, setActiveQuestion] = useState(null);
//   const [currentScore, setCurrentScore] = useState(0);
//   const [showConfetti, setShowConfetti] = useState(false);

//   const triggerConfetti = () => {
//     setShowConfetti(true);

//     setTimeout(() => {
//       setShowConfetti(false);
//     }, 4000);
//   };

//   const startWave = () => {
//     setIsPlaying(true);
//     setHp(100);
//     setBudget(1000);
//     setCurrentScore(0);
//   };

//   /*
//    * Award XP + PrepCoins for a correct answer.
//    */
//   const answerQuiz = (
//     isCorrect,
//     xpReward = 50,
//     coinReward = 10
//   ) => {
//     if (isCorrect) {
//       setBudget((prev) => prev + 200);

//       setCurrentScore((prev) => prev + xpReward);

//       // REAL XP
//       updatePoints(xpReward);

//       // REAL PREPCOINS
//       addPrepCoins(coinReward);
//     } else {
//       setHp((prev) => Math.max(0, prev - 25));
//     }

//     setActiveQuestion(null);
//   };

//   /*
//    * Completion bonus should be optional.
//    *
//    * IMPORTANT:
//    * Do not automatically give another 100 XP here
//    * if XP was already awarded for each question.
//    */
//   const completeGameSession = ({
//     completionXp = 0,
//     completionCoins = 0,
//   } = {}) => {
//     setIsPlaying(false);

//     if (hp > 0) {
//       if (completionXp > 0) {
//         updatePoints(completionXp);
//       }

//       if (completionCoins > 0) {
//         addPrepCoins(completionCoins);
//       }

//       triggerConfetti();
//     }
//   };

//   return (
//     <GameContext.Provider
//       value={{
//         budget,
//         hp,
//         isPlaying,
//         activeQuestion,
//         currentScore,

//         startWave,
//         answerQuiz,
//         completeGameSession,

//         setActiveQuestion,
//         setBudget,
//         setHp,

//         showConfetti,
//         triggerConfetti,
//       }}
//     >
//       {children}
//     </GameContext.Provider>
//   );
// };

// export const useGame = () => {
//   const context = useContext(GameContext);

//   if (!context) {
//     throw new Error(
//       'useGame must be used within GameProvider'
//     );
//   }

//   return context;
// };

import React, { createContext, useContext, useState } from 'react';
import { useUser } from './UserContext';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const {
    completeMission,
  } = useUser();

  const [budget, setBudget] = useState(1000);
  const [hp, setHp] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentMission, setCurrentMission] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = () => {
    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };

  /*
   * Start a specific campaign mission.
   *
   * Example:
   * startMission({
   *   level: 1,
   *   xpReward: 20,
   *   coinReward: 20,
   * });
   */
  const startMission = (mission) => {
    setCurrentMission(mission);

    setIsPlaying(true);
    setHp(100);
    setBudget(1000);
    setCurrentScore(0);
    setActiveQuestion(null);
  };

  /*
   * Correct answers can contribute to the temporary
   * score, but permanent campaign rewards should be
   * awarded ONCE when the mission is completed.
   */
  const answerQuiz = (isCorrect, xpReward = 0) => {
    if (isCorrect) {
      setBudget((prev) => prev + 200);

      setCurrentScore((prev) => prev + xpReward);
    } else {
      setHp((prev) => Math.max(0, prev - 25));
    }

    setActiveQuestion(null);
  };

  /*
   * COMPLETE MISSION
   *
   * This is the important part.
   *
   * UserContext handles:
   * - XP
   * - PrepCoins
   * - completedLevels
   * - persistence
   */
  const completeGameSession = () => {
    if (!currentMission) {
      console.warn('No active mission');
      return;
    }

    if (hp <= 0) {
      setIsPlaying(false);
      return;
    }

    completeMission(
      currentMission.level,
      currentMission.xpReward,
      currentMission.coinReward
    );

    setIsPlaying(false);

    triggerConfetti();
  };

  const failGameSession = () => {
    setIsPlaying(false);
    setCurrentScore(0);
    setCurrentMission(null);
  };

  return (
    <GameContext.Provider
      value={{
        budget,
        hp,
        isPlaying,
        activeQuestion,
        currentScore,
        currentMission,

        startMission,
        answerQuiz,
        completeGameSession,
        failGameSession,

        setActiveQuestion,
        setBudget,
        setHp,

        showConfetti,
        triggerConfetti,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error(
      'useGame must be used within GameProvider'
    );
  }

  return context;
};
