import { MatSnackBar } from '@angular/material';
import { Observable, of } from 'rxjs';

import { take, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import * as firebase from 'firebase/app';

import { AjonpUser } from '@ajonp-models/ajonp-user';
import { FirestoreService } from '@ajonp-services/firestore.service';
import { AuthType } from '@ajonp-models/auth-type.enum';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<AjonpUser>;
  redirecting = false;
  constructor(
    public afAuth: AngularFireAuth,
    private db: FirestoreService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.doc<AjonpUser>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
      if (user) {
        const userRef: AngularFirestoreDocument<any> = this.db.doc(
          `users/${user.uid}`
        );
        userRef.ref.get().then(value => {
          if (value.exists) {
            const data: AjonpUser = {
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified,
              displayName: user.displayName || user.email || user.phoneNumber,
              phoneNumber: user.phoneNumber,
              photoURL: user.photoURL
            };
            const uid = user.uid;
            const updatedUser = { uid, ...value.data() };
            this.updateUserData(updatedUser).catch(error => {
              console.log(error);
              router.navigate(['/signin']);
            });
          } else {
            const data: AjonpUser = {
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified,
              displayName: user.displayName  || user.email || user.phoneNumber,
              phoneNumber: user.phoneNumber,
              photoURL: user.photoURL,
              roles: {
                subscriber: true
              }
            };
            this.setUserData(data).catch(error => {
              console.log(error);
              router.navigate(['/signin']);
            });
          }
        });
      }
    });
  }

  signin(provider: string) {
    switch (provider) {
      case AuthType.google: {
        return this.afAuthLogin(new firebase.auth.GoogleAuthProvider());
      }
      case AuthType.facebook: {
        return this.afAuthLogin(new firebase.auth.FacebookAuthProvider());
      }
      case AuthType.twitter: {
        return this.afAuthLogin(new firebase.auth.TwitterAuthProvider());
      }
      case AuthType.github: {
        return this.afAuthLogin(new firebase.auth.GithubAuthProvider());
      }
    }
  }
  private afAuthLogin(provider: firebase.auth.AuthProvider) {
    this.afAuth.auth
      .signInWithRedirect(provider)
      .then(value => console.log(value), reason => console.log(reason));
  }
  public setUserData(user: AjonpUser) {
    return this.db.set(`users/${user.uid}`, user);
  }
  linkGoogle() {
    return this.afAuth.auth.currentUser.linkWithRedirect(
      new firebase.auth.GoogleAuthProvider()
    );
  }
  linkFacebook() {
    return this.afAuth.auth.currentUser.linkWithRedirect(
      new firebase.auth.FacebookAuthProvider()
    );
  }
  linkTwitter() {
    return this.afAuth.auth.currentUser.linkWithRedirect(
      new firebase.auth.TwitterAuthProvider()
    );
  }
  linkGithub() {
    return this.afAuth.auth.currentUser.linkWithRedirect(
      new firebase.auth.GithubAuthProvider()
    );
  }
  unlinkGoogle() {
    return this.afAuth.auth.currentUser.unlink('google.com');
  }
  unlinkFacebook() {
    return this.afAuth.auth.currentUser.unlink('facebook.com');
  }
  unlinkTwitter() {
    return this.afAuth.auth.currentUser.unlink('twitter.com');
  }
  unlinkGithub() {
    return this.afAuth.auth.currentUser.unlink('github.com');
  }

  ///// Role-based Authorization //////

  canRead(user: AjonpUser): boolean {
    const allowed = ['admin', 'editor', 'subscriber'];
    return this.checkAuthorization(user, allowed);
  }

  canCreate(user: AjonpUser): boolean {
    const allowed = ['admin', 'editor', 'subscriber'];
    return this.checkAuthorization(user, allowed);
  }

  canEdit(user: AjonpUser): boolean {
    const allowed = ['admin', 'editor'];
    return this.checkAuthorization(user, allowed);
  }

  canDelete(user: AjonpUser): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }

  // determines if user has matching role
  private checkAuthorization(user: AjonpUser, allowedRoles: string[]): boolean {
    if (!user) {
      return false;
    }
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }
    return false;
  }

  //// Anonymous Auth ////

  anonymousLogin() {
    return this.afAuth.auth
      .signInAnonymously()
      .then(credential => {
        this.snackBar.open(`Welcome to Oliver's Books`, '', {
          panelClass: 'success'
        });
        return this.updateUserData(credential.user); // if using firestore
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  //// Email/Password Auth ////

  emailSignUp(email: string, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        this.snackBar.open(`Welcome to Oliver's Books`, '', {
          panelClass: 'success'
        });
        return this.updateUserData(credential.user); // if using firestore
      })
      .catch(error => this.handleError(error));
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        this.snackBar.open(`Welcome back`, '', { panelClass: 'success' });
        return this.updateUserData(credential.user);
      })
      .catch(error => this.handleError(error));
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth
      .sendPasswordResetEmail(email)
      .then(() =>
        this.snackBar.open('Password update email sent', '', {
          panelClass: 'info'
        })
      )
      .catch(error => this.handleError(error));
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      location.reload(true);
    });
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
    this.snackBar.open(error.message, 'Close', {
      duration: null,
      panelClass: 'error'
    });
  }

  // Sets user data to firestore after succesful signin
  private updateUserData(user: AjonpUser) {
    return this.db.update(`users/${user.uid}`, user);
  }
}
