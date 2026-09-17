import {
  doc,
  setDoc
} from 'firebase/firestore';

import { db } from '../firebase/config';

export const saveUserToFirestore = async (userId, userData) => {

  if (!userId) {
    console.warn('Cannot save user without an ID.');
    return;
  }

  try {

    await setDoc(
      doc(db, 'users', userId),
      {
        name: userData.name || 'New Responder',
        points: userData.points || 0,
        streak: userData.streak || 0,
        level: userData.level || 1
      },
      {
        merge: true
      }
    );

  } catch (error) {

    console.error(
      'Failed to save user to Firestore:',
      error
    );

  }
};