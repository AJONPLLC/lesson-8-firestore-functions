importScripts('https://www.gstatic.com/firebasejs/5.4.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.4.2/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '176372028272'
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Add an event listener to handle notification clicks
self.addEventListener('notificationclick', function(event) {
   if (event.action === 'like') {
       // Like button was clicked

       const topic = event.notification.data.topic;
       const id = event.notification.data.id;
       console.log(`${topic}/detail/${id}`);
   }
   else if (event.action === 'unsubscribe') {
       // Unsubscribe button was clicked

       const notificationType = event.notification.data.notificationType;
       unsubscribe(notificationType);
   }

   event.notification.close();
});
