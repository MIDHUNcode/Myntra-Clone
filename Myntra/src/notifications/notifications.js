import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync(options = {}) {
  const {
    backendRegisterUrl = null,
    userId = null,
    deviceName = null,
  } = options;

  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device");
    return null;
  }

  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Notification permission not granted");
      return null;
    }

    const tokenResponse = await Notifications.getExpoPushTokenAsync();
    const expoPushToken = tokenResponse?.data;

    console.log("Expo push token:", expoPushToken);

    if (backendRegisterUrl && expoPushToken) {
      try {
        await fetch(backendRegisterUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: expoPushToken,
            platform: Platform.OS,
            userId,
            deviceName,
          }),
        });
      } catch (err) {
        console.warn("Backend token registration failed (ignored)");
      }
    }

    return expoPushToken;
  } catch (error) {
    console.warn("Push notification setup failed:", error);
    return null;
  }
}

export async function scheduleLocalNotification({
  title,
  body,
  data = {},
  triggerOptions = { seconds: 1 },
}) {
  return Notifications.scheduleNotificationAsync({
    content: { title, body, data },
    trigger: triggerOptions,
  });
}

export async function cancelScheduledLocalNotification(identifier) {
  if (!identifier) return;
  return Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function cancelAllScheduledLocalNotifications() {
  return Notifications.cancelAllScheduledNotificationsAsync();
}
