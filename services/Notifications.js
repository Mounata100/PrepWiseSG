// // import * as Notifications from "expo-notifications";


// // export async function requestNotificationPermission(){

// // const permission =
// // await Notifications.requestPermissionsAsync();


// // return permission.status==="granted";

// // }



// // export async function scheduleReadinessReminder(days){


// // await Notifications.cancelAllScheduledNotificationsAsync();



// // await Notifications.scheduleNotificationAsync({

// // content:{

// // title:"PrepWise Readiness Check",

// // body:"Complete today's emergency preparedness task and maintain your streak."

// // },


// // trigger:{

// // seconds:
// // days * 24 * 60 * 60,

// // repeats:true

// // }


// // });


// // }


// // }

// import * as Notifications from "expo-notifications";


// // Request notification permission
// export async function requestNotificationPermission() {

//   const permission = await Notifications.requestPermissionsAsync();

//   return permission.status === "granted";
// }


// // Create Android notification channel
// export async function setupNotificationChannel() {

//   await Notifications.setNotificationChannelAsync("default", {
//     name: "PrepWise Notifications",
//     importance: Notifications.AndroidImportance.MAX,
//     sound: "default",
//   });

// }


// // Daily readiness reminder
// export async function scheduleReadinessReminder(days) {

//   await Notifications.cancelAllScheduledNotificationsAsync();

//   await Notifications.scheduleNotificationAsync({

//     content: {
//       title: "PrepWise Readiness Check",
//       body: "Complete today's emergency preparedness task and maintain your streak.",
//     },

//     trigger: {
//       seconds: days * 24 * 60 * 60,
//       repeats: true,
//     },

//   });

// }


// // Mission completion notification
// export async function sendMissionCompletedNotification(
//   missionTitle,
//   points,
//   coins
// ) {

//   await Notifications.scheduleNotificationAsync({

//     content: {
//       title: "🎉 Mission Completed!",
//       body: `${missionTitle} completed. +${points} XP and +${coins} PrepCoins earned.`,
//       data: {
//         type: "mission_complete",
//         mission: missionTitle,
//         points,
//         coins,
//       },
//     },

//     trigger: null,

//   });

// }


// services/Notifications.js

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ============================================================
// CONFIGURATION
// ============================================================

const READINESS_NOTIFICATION_ID = 'prepwise-readiness-reminder';
const ANDROID_CHANNEL_ID = 'prepwise-default';

// ============================================================
// REQUEST NOTIFICATION PERMISSION
// ============================================================

export async function requestNotificationPermission() {
  try {
    const existingPermission =
      await Notifications.getPermissionsAsync();

    if (existingPermission.status === 'granted') {
      return true;
    }

    const requestedPermission =
      await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: false,
        },
      });

    return requestedPermission.status === 'granted';
  } catch (error) {
    console.error(
      'Unable to request notification permission:',
      error
    );

    return false;
  }
}

// ============================================================
// CHECK CURRENT NOTIFICATION PERMISSION
// ============================================================

export async function hasNotificationPermission() {
  try {
    const permission =
      await Notifications.getPermissionsAsync();

    return permission.status === 'granted';
  } catch (error) {
    console.error(
      'Unable to check notification permission:',
      error
    );

    return false;
  }
}

// ============================================================
// ANDROID NOTIFICATION CHANNEL
// ============================================================

export async function setupNotificationChannel() {
  // iOS does not use Android notification channels.
  if (Platform.OS !== 'android') {
    return;
  }

  try {
    await Notifications.setNotificationChannelAsync(
      ANDROID_CHANNEL_ID,
      {
        name: 'PrepWise Notifications',

        importance:
          Notifications.AndroidImportance.MAX,

        sound: 'default',

        vibrationPattern: [
          0,
          250,
          250,
          250,
        ],

        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      }
    );
  } catch (error) {
    console.error(
      'Unable to create Android notification channel:',
      error
    );

    throw error;
  }
}

// ============================================================
// INITIALISE NOTIFICATIONS
// ============================================================

export async function initialiseNotifications() {
  try {
    const permissionGranted =
      await requestNotificationPermission();

    if (!permissionGranted) {
      console.warn(
        'PrepWise notification permission was not granted.'
      );

      return false;
    }

    await setupNotificationChannel();

    return true;
  } catch (error) {
    console.error(
      'Unable to initialise notifications:',
      error
    );

    return false;
  }
}

// ============================================================
// SCHEDULE READINESS REMINDER
// ============================================================

export async function scheduleReadinessReminder(days) {
  try {
    const intervalDays = Number(days);

    // Validate interval.
    if (
      !Number.isFinite(intervalDays) ||
      intervalDays <= 0
    ) {
      throw new Error(
        'Invalid readiness reminder interval.'
      );
    }

    // Make sure permission and notification
    // configuration are ready.
    const notificationReady =
      await initialiseNotifications();

    if (!notificationReady) {
      return false;
    }

    // Cancel the previous PrepWise readiness reminder.
    await cancelReadinessReminder();

    const seconds =
      intervalDays * 24 * 60 * 60;

    const notificationId =
      await Notifications.scheduleNotificationAsync({
        identifier: READINESS_NOTIFICATION_ID,

        content: {
          title: 'PrepWise Readiness Check',

          body:
            "Complete today's emergency preparedness task and maintain your streak.",

          sound: 'default',

          data: {
            type: 'readiness_reminder',
            intervalDays,
          },
        },

        trigger: {
          type:
            Notifications.SchedulableTriggerInputTypes
              .TIME_INTERVAL,

          seconds,

          repeats: true,
        },
      });

    console.log(
      'Readiness reminder scheduled:',
      notificationId
    );

    return true;
  } catch (error) {
    console.error(
      'Unable to schedule readiness reminder:',
      error
    );

    return false;
  }
}

// ============================================================
// CANCEL READINESS REMINDER
// ============================================================

export async function cancelReadinessReminder() {
  try {
    await Notifications.cancelScheduledNotificationAsync(
      READINESS_NOTIFICATION_ID
    );

    console.log(
      'PrepWise readiness reminder cancelled.'
    );

    return true;
  } catch (error) {
    /*
     * If there is no existing notification with this
     * identifier, Expo may report an error depending
     * on the platform/version.
     *
     * We don't want that to break onboarding/settings.
     */
    console.warn(
      'Unable to cancel readiness reminder:',
      error
    );

    return false;
  }
}

// ============================================================
// GET SCHEDULED NOTIFICATIONS
// ============================================================

export async function getScheduledNotifications() {
  try {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();

    return notifications;
  } catch (error) {
    console.error(
      'Unable to get scheduled notifications:',
      error
    );

    return [];
  }
}

// ============================================================
// CHECK WHETHER READINESS REMINDER IS SCHEDULED
// ============================================================

export async function isReadinessReminderScheduled() {
  try {
    const notifications =
      await getScheduledNotifications();

    return notifications.some(
      (notification) =>
        notification.identifier ===
        READINESS_NOTIFICATION_ID
    );
  } catch (error) {
    console.error(
      'Unable to check readiness reminder:',
      error
    );

    return false;
  }
}

// ============================================================
// CANCEL ALL SCHEDULED NOTIFICATIONS
// ============================================================
//
// Use this only when you intentionally want to remove
// ALL scheduled notifications from PrepWise.
//
// For turning off the readiness setting, prefer:
// cancelReadinessReminder()
//

export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    console.log(
      'All scheduled PrepWise notifications cancelled.'
    );

    return true;
  } catch (error) {
    console.error(
      'Unable to cancel all notifications:',
      error
    );

    return false;
  }
}

// ============================================================
// MISSION COMPLETION NOTIFICATION
// ============================================================

export async function sendMissionCompletedNotification(
  missionTitle,
  points,
  coins
) {
  try {
    const notificationReady =
      await initialiseNotifications();

    if (!notificationReady) {
      return false;
    }

    const notificationId =
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎉 Mission Completed!',

          body:
            `${missionTitle} completed. ` +
            `+${points} XP and +${coins} PrepCoins earned.`,

          sound: 'default',

          data: {
            type: 'mission_complete',
            mission: missionTitle,
            points,
            coins,
          },
        },

        // null = display immediately
        trigger: null,
      });

    console.log(
      'Mission completion notification sent:',
      notificationId
    );

    return true;
  } catch (error) {
    console.error(
      'Unable to send mission completion notification:',
      error
    );

    return false;
  }
}

// ============================================================
// CLEAR NOTIFICATION BADGE
// ============================================================

export async function clearNotificationBadge() {
  try {
    await Notifications.setBadgeCountAsync(0);

    return true;
  } catch (error) {
    console.error(
      'Unable to clear notification badge:',
      error
    );

    return false;
  }
}

// ============================================================
// GET NOTIFICATION PERMISSION DETAILS
// ============================================================

export async function getNotificationPermissionStatus() {
  try {
    return await Notifications.getPermissionsAsync();
  } catch (error) {
    console.error(
      'Unable to get notification permission status:',
      error
    );

    return null;
  }
}
