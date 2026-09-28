import {
  collection,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

import { db } from '../firebase/config';

export const subscribeToLeaderboard = (currentUserId, callback) => {
  const leaderboardQuery = query(
    collection(db, 'users'),
    orderBy('points', 'desc')
  );

  const unsubscribe = onSnapshot(
    leaderboardQuery,
    (snapshot) => {
      const allUsers = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        ...doc.data(),
        rank: index + 1
      }));

      // Top 5 users
      const topUsers = allUsers.slice(0, 5);

      // Find current user
      const currentUser = allUsers.find(
        (item) => item.id === currentUserId
      );

      // If current user is already in top 5,
      // don't add them a second time.
      const isCurrentUserInTopFive = topUsers.some(
        (item) => item.id === currentUserId
      );

      const displayUsers = isCurrentUserInTopFive
        ? topUsers
        : [
            ...topUsers,
            ...(currentUser ? [currentUser] : [])
          ];

      callback(displayUsers);
    },
    (error) => {
      console.error(
        'Leaderboard Firestore error:',
        error
      );
    }
  );

  return unsubscribe;
};
