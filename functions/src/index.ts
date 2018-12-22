import * as admin from "firebase-admin";
admin.initializeApp();

import * as notifications from './notifications';
import * as likes from './likes';
import * as gitcommit from './gitcommit';

// //Notifications
// export const sendOnBookCreate = notifications.sendOnBookCreate;
// export const subscribeToTopic = notifications.subscribeToTopic;
// export const unsubscribeFromTopic = notifications.unsubscribeFromTopic;

// //Books
// export const bookLikesChange = likes.bookLikesChange;
// export const bookLikesCountDelete = likes.bookLikesCountDelete;

//Git
export const gitReadCommit = gitcommit.gitReadCommit;
