import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  registerForPushNotificationsAsync,
  scheduleLocalNotification,
  cancelScheduledLocalNotification,
} from "./notifications";

export default function useNotifications(options = {}) {
  const [expoToken, setExpoToken] = useState<string | null>(null);
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  const enablePushNotifications = async () => {
    if (__DEV__ && Platform.OS === "android") {
      console.warn("Push notifications disabled in Expo Go (Android)");
      return null;
    }

    const token = await registerForPushNotificationsAsync({
      backendRegisterUrl: options.backendRegisterUrl,
      userId: options.userId,
      deviceName: options.deviceName,
    });

    setExpoToken(token);
    return token;
  };

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        try {
          options.onNotificationReceived?.(notification);
        } catch (e) {
          console.warn("onNotificationReceived error:", e);
        }
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        try {
          options.onNotificationResponse?.(response);
        } catch (e) {
          console.warn("onNotificationResponse error:", e);
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return {
    expoToken,
    enablePushNotifications, 
    scheduleLocalNotification,
    cancelScheduledLocalNotification,
    cancelAllScheduledLocalNotifications:
      Notifications.cancelAllScheduledNotificationsAsync,
  };
}