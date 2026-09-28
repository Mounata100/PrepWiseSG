// services/localUserService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserCacheKey = (uid) =>
  `@prepwisesg_user_${uid}`;

const getSyncKey = (uid) =>
  `@prepwisesg_sync_${uid}`;

const GUEST_KEY =
  '@prepwisesg_guest';

export const saveCachedUser = async (user) => {
  if (!user?.uid) return;

  await AsyncStorage.setItem(
    getUserCacheKey(user.uid),
    JSON.stringify(user)
  );

  await AsyncStorage.setItem(
    getSyncKey(user.uid),
    JSON.stringify({
      status: 'pending',
      updatedAt: new Date().toISOString(),
    })
  );
};

export const getCachedUser = async (uid) => {
  if (!uid) return null;

  const data =
    await AsyncStorage.getItem(
      getUserCacheKey(uid)
    );

  return data
    ? JSON.parse(data)
    : null;
};

export const clearCachedUser = async (uid) => {
  if (!uid) return;

  await AsyncStorage.removeItem(
    getUserCacheKey(uid)
  );

  await AsyncStorage.removeItem(
    getSyncKey(uid)
  );
};

export const markUserSynced = async (uid) => {
  if (!uid) return;

  await AsyncStorage.setItem(
    getSyncKey(uid),
    JSON.stringify({
      status: 'synced',
      syncedAt: new Date().toISOString(),
    })
  );
};

export const getUserSyncStatus = async (uid) => {
  if (!uid) return null;

  const data =
    await AsyncStorage.getItem(
      getSyncKey(uid)
    );

  return data
    ? JSON.parse(data)
    : null;
};

export const saveGuestUser = async (user) => {
  await AsyncStorage.setItem(
    GUEST_KEY,
    JSON.stringify(user)
  );
};

export const getGuestUser = async () => {
  const data =
    await AsyncStorage.getItem(GUEST_KEY);

  return data
    ? JSON.parse(data)
    : null;
};

export const clearGuestUser = async () => {
  await AsyncStorage.removeItem(
    GUEST_KEY
  );
};
