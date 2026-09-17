import {
  collection,
  doc,
  setDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';

import { db } from './../firebase/config';

// Save/update a user's leaderboard data
export const updateLeaderboardUser = async (user) => {
  if (!user?.id) {
    throw new Error('User ID is required');
  }

  const userRef = doc(db, 'users', user.id);

  await setDoc(
    userRef,
    {
      name: user.name || 'New Responder',
      points: user.points || 0,
      streak: user.streak || 0,
      level: user.level || 1,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

// Listen for leaderboard changes
export const subscribeToLeaderboard = (callback) => {
  const leaderboardQuery = query(
    collection(db, 'users'),
    orderBy('points', 'desc'),
    limit(10)
  );

  const unsubscribe = onSnapshot(
    leaderboardQuery,
    (snapshot) => {
      const leaderboard = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      callback(leaderboard);
    },
    (error) => {
      console.error('Leaderboard listener error:', error);
    }
  );

  return unsubscribe;
};