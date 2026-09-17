import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';

import { db } from '../firebase/config';

export const subscribeToLeaderboard = (callback) => {
  const leaderboardQuery = query(
    collection(db, 'users'),
    orderBy('points', 'desc'),
    limit(10)
  );

  const unsubscribe = onSnapshot(
    leaderboardQuery,
    (snapshot) => {
      const leaderboard = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      callback(leaderboard);
    },
    (error) => {
      console.error('Leaderboard Firestore error:', error);
    }
  );

  return unsubscribe;
};