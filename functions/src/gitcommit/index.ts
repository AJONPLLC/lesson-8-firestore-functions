import * as functions from 'firebase-functions';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as os from 'os';
import * as gitP from 'simple-git/promise';
import * as admin from "firebase-admin";
import * as slugify from 'slugify';

export const gitBookCreateHugoCommit = functions.firestore
  .document('books/{bookId}')
  .onCreate(async (snapshot, context) => {
    const BOOK = snapshot.data();
    const BOOKID = snapshot.id;
    const USER = 'ajonp';
    const TOKEN = functions.config().git.token; //Trying to keep this secret, run firebase functions:config:set git.token=<your_token>
    const REPOOWNER = 'AJONPLLC';
    const REPONAME = 'lesson-8-hugo';
    const REPOURL = 'github.com/' + REPOOWNER + '/' + REPONAME;
    const GITHUBURL = `https://${USER}:${TOKEN}@${REPOURL}`;
    const LOCALPATH = `${os.tmpdir()}/lesson-8-hugo/`;
    const BOOKPATH = `content/books/${BOOKID}-${BOOK.title}.md`;
    const BOOKSLUG = slugify.default(`${BOOKID}-${BOOK.title}`,{lower: true});
    const BOOKURL = `https://ajonp-lesson-8-hugo.firebaseapp.com/books/${BOOKSLUG}`;
    const CREATE_USER = await admin.auth().getUser(BOOK.user_id); //Still a bug, not very secure https://github.com/firebase/firebase-functions/issues/300

    console.log(BOOK);

    try {
      fse.emptyDirSync(os.tmpdir());
      console.log('Cloning', GITHUBURL, 'into', LOCALPATH);
      await gitP().clone(GITHUBURL, LOCALPATH);

      const filePath = path.join(
        LOCALPATH,
        BOOKPATH
      );
      console.log('Writing File', filePath);
      fse.writeFileSync(filePath,
`+++
title = "${BOOK.title}"
date = ${new Date().toISOString()}
images = ["https://res.cloudinary.com/ajonp/image/upload/v1545282630/ajonp-ajonp-com/8-lesson-firestore-functions/bookExample.png"]
+++

${BOOK.description}
`
);
    const git = gitP(LOCALPATH);
    console.log('Adding Config');
    await git.addConfig('user.email', CREATE_USER.email);
    await git.addConfig('user.name',CREATE_USER.displayName);
    await git.add(BOOKPATH);
    await git.commit('Added Book.');
    console.log('Pushing...');
    await git.push('origin','master');
    console.log('GitHub Updated!');
    } catch (err) {
      console.log(err);
      return false;
    }

    //UPDATE book to match uid of creating user, this will allow validation on delete.
    return snapshot.ref.set({
      uid: CREATE_USER.uid,
      url: BOOKURL,
      imageURL: `https://res.cloudinary.com/ajonp/image/upload/f_auto,fl_lossy,q_auto/v1545282098/ajonp-ajonp-com/8-lesson-firestore-functions/ajonp_books.png`
    }, {merge: true});
  });

  export const gitBookDeleteHugoCommit = functions.firestore
  .document('books/{bookId}')
  .onDelete(async (snapshot, context) => {
    const BOOK = snapshot.data();
    const BOOKID = snapshot.id;
    const USER = 'ajonp';
    const TOKEN = functions.config().git.token; //Trying to keep this secret, run firebase functions:config:set git.token=<your_token>
    const REPOOWNER = 'AJONPLLC';
    const REPONAME = 'lesson-8-hugo';
    const REPOURL = 'github.com/' + REPOOWNER + '/' + REPONAME;
    const GITHUBURL = `https://${USER}:${TOKEN}@${REPOURL}`;
    const LOCALPATH = `${os.tmpdir()}/lesson-8-hugo/`;
    const BOOKPATH = `content/books/${BOOKID}-${BOOK.title}.md`;
    const BOOKSLUG = slugify.default(`${BOOKID}-${BOOK.title}`,{lower: true});
    const BOOKURL = `https://ajonp-lesson-8-hugo.firebaseapp.com/books/${BOOKSLUG}`;
    const CREATE_USER = await admin.auth().getUser(BOOK.user_id); //Still a bug, not very secure https://github.com/firebase/firebase-functions/issues/300

    console.log(BOOK);

    try {
      fse.emptyDirSync(os.tmpdir());
      console.log('Cloning', GITHUBURL, 'into', LOCALPATH);
      await gitP().clone(GITHUBURL, LOCALPATH);
      const git = gitP(LOCALPATH);
      console.log('Adding Config');
      await git.addConfig('user.email', CREATE_USER.email);
      await git.addConfig('user.name',CREATE_USER.displayName);
      await git.rm(BOOKPATH);
      await git.commit('Removed Book.');
      console.log('Pushing...');
      await git.push('origin','master');
      console.log('GitHub Updated!');
      return true
    } catch (err) {
      console.log(err);
      return false;
    }
  });
