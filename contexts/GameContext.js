// import React, { createContext, useContext, useState } from 'react';
// import { useUser } from './UserContext';

// const GameContext = createContext();

// export const GameProvider = ({ children }) => {
//   const { updatePoints, points: totalUserPoints } = useUser();
  
//   const [budget, setBudget] = useState(1000);
//   const [hp, setHp] = useState(100);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [activeQuestion, setActiveQuestion] = useState(null);
//   const [currentScore, setCurrentScore] = useState(0);

//   const startWave = () => {
//     setIsPlaying(true);
//     setHp(100);
//     setBudget(1000);
//     setCurrentScore(0);
//   };

//   const answerQuiz = (isCorrect, xpReward = 50) => {
//     if (isCorrect) {
//       setBudget((prev) => prev + 200);
//       setCurrentScore((prev) => prev + xpReward);
      
//       // Direct Hook to update your Global User Profile and persist data
//       updatePoints(xpReward); 
//     } else {
//       setHp((prev) => Math.max(0, prev - 25));
//     }
//     setActiveQuestion(null);
//   };

//   const completeGameSession = (bonusXp = 100) => {
//     setIsPlaying(false);
//     if (hp > 0) {
//       updatePoints(bonusXp);
//     }
//   };

//   return (
//     <GameContext.Provider value={{ 
//       budget, 
//       hp, 
//       isPlaying, 
//       activeQuestion, 
//       currentScore,
//       startWave, 
//       answerQuiz, 
//       completeGameSession,
//       setActiveQuestion,
//       setBudget,
//       setHp
//     }}>
//       {children}
//     </GameContext.Provider>
//   );
// };

// export const useGame = () => useContext(GameContext);
import React, { createContext, useContext, useState } from 'react';
import { useUser } from './UserContext';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { updatePoints, points: totalUserPoints } = useUser();
  
  const [budget, setBudget] = useState(1000);
  const [hp, setHp] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [currentScore, setCurrentScore] = useState(0);

  // NEW: Global celebration trigger
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = () => {
    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };


  const startWave = () => {
    setIsPlaying(true);
    setHp(100);
    setBudget(1000);
    setCurrentScore(0);
  };


  const answerQuiz = (isCorrect, xpReward = 50) => {
    if (isCorrect) {
      setBudget((prev) => prev + 200);
      setCurrentScore((prev) => prev + xpReward);
      
      updatePoints(xpReward); 
    } else {
      setHp((prev) => Math.max(0, prev - 25));
    }

    setActiveQuestion(null);
  };


  const completeGameSession = (bonusXp = 100) => {
    setIsPlaying(false);

    if (hp > 0) {
      updatePoints(bonusXp);
      triggerConfetti(); // optional: celebrate any completed session
    }
  };


  return (
    <GameContext.Provider value={{ 
      budget, 
      hp, 
      isPlaying, 
      activeQuestion, 
      currentScore,

      // Existing functions
      startWave, 
      answerQuiz, 
      completeGameSession,
      setActiveQuestion,
      setBudget,
      setHp,

      // NEW
      showConfetti,
      triggerConfetti
    }}>
      {children}
    </GameContext.Provider>
  );
};


export const useGame = () => useContext(GameContext);
