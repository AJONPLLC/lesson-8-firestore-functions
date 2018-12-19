import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

export const subscribeToTopic = functions.https.onCall(
  async (data, context) => {
    await admin.messaging().subscribeToTopic(data.token, data.topic);

    return `subscribed to ${data.topic}`;
  }
);

export const unsubscribeFromTopic = functions.https.onCall(
  async (data, context) => {
    await admin.messaging().unsubscribeFromTopic(data.token, data.topic);

    return `unsubscribed from ${data.topic}`;
  }
);

export const sendOnBookCreate = functions.firestore
  .document('books/{bookId}')
  .onCreate(async snapshot => {
    const book = snapshot.data();

    const notification: admin.messaging.Notification = {
      title: 'New Book!',
      body: book.title
    };

    const android: admin.messaging.AndroidConfig = {

    }
    const webpushNotificaiton: admin.messaging.WebpushNotification = {
      title: notification.title,
      actions: [
        {
          action: 'like',
          icon: "icons/heart.png",
          title: 'Like'
        }
      ],
      // badge?: string;
      body: notification.body,
      // data?: any;
      // dir?: 'auto' | 'ltr' | 'rtl';
      icon: 'https://oliversbooks.com/assets/icons/android-icon-192x192.png',
      image: book.imageURL,
      // lang?: string;
      // renotify?: boolean;
      // requireInteraction?: boolean;
      // silent?: boolean;
      // tag?: string;
      // timestamp?: number;
      vibrate: [200, 100, 200],
      // [key: string]: any;
    }

    const webpush: admin.messaging.WebpushConfig = {
      notification: webpushNotificaiton
    }
    const apns: admin.messaging.ApnsConfig = {

    }

    const dataMessagePayload: admin.messaging.DataMessagePayload = {
      topic: 'books',
      id : snapshot.id
    }

    const notificationMessagePayload: admin.messaging.NotificationMessagePayload = {
      // tag?: string;
      body: webpushNotificaiton.body,
      icon: webpushNotificaiton.icon,
      // badge?: string;
      // color?: string;
      // sound?: string;
      title: notification.title,
      // bodyLocKey?: string;
      // bodyLocArgs?: string;
      clickAction: `https://oliversbooks.com/books/detail/${snapshot.id}`,
      // titleLocKey?: string;
      // titleLocArgs?: string;
      // [key: string]: string | undefined;
    }
    const messagingPayload: admin.messaging.MessagingPayload = {
      data: dataMessagePayload,
      notification: notificationMessagePayload
    };

    return admin.messaging().sendToTopic('books', messagingPayload);
  });
