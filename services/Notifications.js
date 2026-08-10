// import * as Notifications from "expo-notifications";


// export async function requestNotificationPermission(){

// const permission =
// await Notifications.requestPermissionsAsync();


// return permission.status==="granted";

// }



// export async function scheduleReadinessReminder(days){


// await Notifications.cancelAllScheduledNotificationsAsync();



// await Notifications.scheduleNotificationAsync({

// content:{

// title:"PrepWise Readiness Check",

// body:"Complete today's emergency preparedness task and maintain your streak."

// },


// trigger:{

// seconds:
// days * 24 * 60 * 60,

// repeats:true

// }


// });


// }


// }

import * as Notifications from "expo-notifications";


// Request notification permission
export async function requestNotificationPermission() {

  const permission = await Notifications.requestPermissionsAsync();

  return permission.status === "granted";
}


// Create Android notification channel
export async function setupNotificationChannel() {

  await Notifications.setNotificationChannelAsync("default", {
    name: "PrepWise Notifications",
    importance: Notifications.AndroidImportance.MAX,
    sound: "default",
  });

}


// Daily readiness reminder
export async function scheduleReadinessReminder(days) {

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({

    content: {
      title: "PrepWise Readiness Check",
      body: "Complete today's emergency preparedness task and maintain your streak.",
    },

    trigger: {
      seconds: days * 24 * 60 * 60,
      repeats: true,
    },

  });

}


// Mission completion notification
export async function sendMissionCompletedNotification(
  missionTitle,
  points,
  coins
) {

  await Notifications.scheduleNotificationAsync({

    content: {
      title: "🎉 Mission Completed!",
      body: `${missionTitle} completed. +${points} XP and +${coins} PrepCoins earned.`,
      data: {
        type: "mission_complete",
        mission: missionTitle,
        points,
        coins,
      },
    },

    trigger: null,

  });

}
