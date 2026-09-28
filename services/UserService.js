// services/userService.js
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../firebase/config';

const createDefaultProfile = ({
  uid,
  email,
  username,
  displayName,
}) => ({
  uid,
  email,
  username,
  displayName,

  profilePictureUrl: null,

  xp: 0,
  coins: 0,
  points: 0,
  level: 1,
  stars: 0,
  streak: 0,

  campaign: {
    completedLevels: [],
    stars: {},
  },

  badges: [],

  completedQuizzes: [],

  completedMissions: {},

  goBagItems: [],

  inventory: [],

  familyMembers: [],

  familyEmergencyPlanRegistered: false,

  healthData: {
    bloodType: '',
    allergies: '',
    qrCodeGenerated: false,
  },

  onboardingCompleted: false,

  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

export const createUserProfile = async ({
  uid,
  email,
  username,
  displayName,
}) => {
  const userRef = doc(db, 'users', uid);

  const profile = createDefaultProfile({
    uid,
    email,
    username,
    displayName,
  });

  await setDoc(userRef, profile);

  return profile;
};

export const getUserProfile = async (uid) => {
  if (!uid) {
    throw new Error('Firebase UID is required.');
  }

  const userRef = doc(db, 'users', uid);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const updateUserProfile = async (uid, updates) => {
  if (!uid) {
    throw new Error('Firebase UID is required.');
  }

  const userRef = doc(db, 'users', uid);

  await setDoc(
    userRef,
    {
      ...updates,
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
};
