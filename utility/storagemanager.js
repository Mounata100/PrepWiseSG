// // // // utils/StorageManager.js
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import * as FileSystem from 'expo-file-system';

// // // const KEYS = {
// // //   USER_DATA: '@PrepWiseSG:user_profile',
// // //   GAME_PROGRESS: '@PrepWiseSG:game_progress'
// // // };

// // // export const StorageManager = {
// // //   /**
// // //    * Saves or updates the user profile dataset
// // //    */
// // //   saveUserProfile: async (profileData) => {
// // //     try {
// // //       await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(profileData));
// // //     } catch (e) {
// // //       console.error('Failed to persist user profile data:', e);
// // //     }
// // //   },

// // //   /**
// // //    * Retrieves the user profile dataset
// // //    */
// // //   getUserProfile: async () => {
// // //     try {
// // //       const data = await AsyncStorage.getItem(KEYS.USER_DATA);
// // //       return data ? JSON.parse(data) : { xp: 0, badges: [], profileImageUri: null, name: 'Civilian Responder' };
// // //     } catch (e) {
// // //       console.error('Failed to load user profile data:', e);
// // //       return null;
// // //     }
// // //   },

// // //   /**
// // //    * Copies a temporary camera cache image to a permanent local app directory
// // //    */
// // //   persistProfilePhoto: async (tempUri) => {
// // //     try {
// // //       const filename = `profile_${Date.now()}.jpg`;
// // //       const permanentUri = `${FileSystem.documentDirectory}${filename}`;
      
// // //       // Move from temp cache to persistent app storage
// // //       await FileSystem.copyAsync({
// // //         from: tempUri,
// // //         to: permanentUri
// // //       });
      
// // //       return permanentUri;
// // //     } catch (e) {
// // //       console.error('File system photo persistence failed:', e);
// // //       return tempUri; // Fallback to original temp URI if copy fails
// // //     }
// // //   }
// // // };




// utils/StorageManager.js
import AsyncStorage from '@react-native-async-storage/async-storage';
// Imported from /legacy to support copyAsync safely without deprecation errors in SDK 54+
import * as FileSystem from 'expo-file-system/legacy';

const KEYS = {
  USER_DATA: '@PrepWiseSG:user_profile',
  GAME_PROGRESS: '@PrepWiseSG:game_progress'
};

export const StorageManager = {
  /**
   * Saves or updates the user profile dataset
   */
  saveUserProfile: async (profileData) => {
    try {
      await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(profileData));
    } catch (e) {
      console.error('Failed to persist user profile data:', e);
    }
  },

  /**
   * Retrieves the user profile dataset
   */
  getUserProfile: async () => {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_DATA);
      return data ? JSON.parse(data) : { xp: 0, badges: [], profileImageUri: null, name: 'Civilian Responder' };
    } catch (e) {
      console.error('Failed to load user profile data:', e);
      return null;
    }
  },

  /**
   * Copies a temporary camera cache image to a permanent local app directory
   */
  persistProfilePhoto: async (tempUri) => {
    try {
      const filename = `profile_${Date.now()}.jpg`;
      const permanentUri = `${FileSystem.documentDirectory}${filename}`;
      
      // Move from temp cache to persistent app storage safely using the legacy namespace
      await FileSystem.copyAsync({
        from: tempUri,
        to: permanentUri
      });
      
      return permanentUri;
    } catch (e) {
      console.error('File system photo persistence failed:', e);
      return tempUri; // Fallback to original temp URI if copy fails
    }
  }
};




// // utils/StorageManager.js
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as FileSystem from 'expo-file-system/legacy';

// export const StorageManager = {
//   /**
//    * Saves or updates the user profile dataset scoped by user email
//    */
//   saveUserProfile: async (email, profileData) => {
//     try {
//       if (!email) return;
//       const key = `@PrepWiseSG:profile:${email.toLowerCase().trim()}`;
//       await AsyncStorage.setItem(key, JSON.stringify(profileData));
//     } catch (e) {
//       console.error('Failed to persist user profile data:', e);
//     }
//   },

//   /**
//    * Retrieves the user profile dataset scoped by user email
//    */
//   getUserProfile: async (email) => {
//     try {
//       if (!email) return { xp: 0, badges: [], profileImageUri: null, profileEmoji: null };
//       const key = `@PrepWiseSG:profile:${email.toLowerCase().trim()}`;
//       const data = await AsyncStorage.getItem(key);
//       return data ? JSON.parse(data) : { xp: 0, badges: [], profileImageUri: null, profileEmoji: null };
//     } catch (e) {
//       console.error('Failed to load user profile data:', e);
//       return null;
//     }
//   },

//   /**
//    * Copies a temporary camera cache image to a permanent local app directory per user
//    */
//   persistProfilePhoto: async (email, tempUri) => {
//     try {
//         if (!tempUri) throw new Error("FileSystem copy rejected: target uriString is missing.");
//         const sanitizedEmail = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
//         const filename = `profile_${sanitizedEmail}_${Date.now()}.jpg`;
//         const permanentUri = `${FileSystem.documentDirectory}${filename}`;
        
//         await FileSystem.copyAsync({
//             from: tempUri,
//             to: permanentUri
//         });
        
//         return permanentUri;
//         } catch (e) {
//         console.error('File system photo persistence failed:', e);
//         return tempUri;
//         }
//   }
// };