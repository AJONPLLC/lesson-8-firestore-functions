import { AjonpUser } from './../models/ajonp-user';
import { Router } from '@angular/router';
import { AuthService } from '@ajonp-services/auth.service';
import { Injectable, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFireFunctions } from '@angular/fire/functions';

import { MatSnackBar } from '@angular/material';
import { Observable, of } from 'rxjs';
import { tap, take, mergeMap, map, switchMap } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';
import { AjonpNotification } from '@ajonp-models/ajonp-notification';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  public token;
  public topics = [];
  public notifications$: Observable<AjonpNotification>;
  constructor(
    private afMessaging: AngularFireMessaging,
    private fun: AngularFireFunctions,
    private snackBar: MatSnackBar,
    private db: FirestoreService,
    private auth: AuthService,
    private router: Router
  ) {}
  setToken() {
    this.afMessaging.getToken.pipe(take(1)).subscribe(token => {
      this.token = token;
    });
    this.auth.user$.subscribe(user => {
      if (user) {
        this.afMessaging.getToken.pipe(take(1)).subscribe(token => {
          this.notifications$ = this.db
            .doc$<AjonpNotification>('config/notifications')
            .pipe(
              map((notification: any) => {
                // Setup Topics
                this.topics = notification.topics;
                const topics = [];
                notification.topics.forEach(topic => {
                  let checked = false;
                  if (
                    user.notifications &&
                    user.notifications[token] &&
                    user.notifications[token].topics
                  ) {
                    checked = user.notifications[token].topics[topic];
                  }
                  topics.push({ name: topic, checked: checked });
                });
                notification.topics = topics;
                return notification;
              })
            );
        });
      }
    });
  }
  getNotification(): Observable<string> {
    return this.afMessaging.getToken.pipe(
      switchMap(token =>
        this.auth.user$.pipe(
          switchMap(user =>
            this.db
              .doc<AjonpUser>(`users/${user.uid}`)
              .valueChanges()
              .pipe(
                switchMap(ajonpUser => {
                  if (
                    ajonpUser.notifications &&
                    ajonpUser.notifications[token]
                  ) {
                    return of(ajonpUser.notifications[token]);
                  } else {
                    return of(null);
                  }
                })
              )
          )
        )
      )
    );
  }
  getPermission() {
    const ref = this.afMessaging.requestToken;
    ref.pipe(take(1)).subscribe(
      token => {
        this.token = token;
        this.auth.user$.pipe(take(1)).subscribe(user => {
          const upd = `notifications.${token}`;
          this.db.update(`users/${user.uid}`, { [upd]: false }).then(() => {
            this.topics.forEach(topic => {
              this.sub(topic);
            });
          });
        });
        this.snackBar.open(`Permission Added`, '', {
          panelClass: 'success'
        });
      },
      error => {
        this.token = null;
        this.snackBar.open(error.message, '', {
          panelClass: 'error'
        });
      }
    );
    return ref;
  }
  removePermission() {
    const ref = this.auth.user$.pipe(take(1));
    ref.subscribe(user => {
      this.afMessaging.getToken
        .pipe(mergeMap(token => this.afMessaging.deleteToken(token)))
        .subscribe(
          () => {
            const upd = `notifications.${this.token}`;
            this.db
              .update(`users/${user.uid}`, {
                [upd]: firebase.firestore.FieldValue.delete()
              })
              .then(() => {
                this.token = null;
                this.snackBar.open(`Permission Removed`, '', {
                  panelClass: 'success'
                });
              });
          },
          error => {
            this.snackBar.open(error.message, '', {
              panelClass: 'error'
            });
          }
        );
    });
    return ref;
  }

  showMessages(): Observable<any> {
    return this.afMessaging.messages.pipe(
      tap(msg => {
        const title: any = (msg as any).notification.title;
        const body: any = (msg as any).notification.body;
        const data: any = (msg as any).data;
        const snack$ = this.snackBar.open(`${title} ${body}`, 'Open', {
          duration: 50000
        });
        snack$.onAction().subscribe(log => {
          this.router.navigate([`/${data.topic}/detail/${data.id}`]);
        });
      })
    );
  }
  sub(topic) {
    this.auth.user$.pipe(take(1)).subscribe(user => {
      this.fun
        .httpsCallable('subscribeToTopic')({ topic, token: this.token })
        .pipe(take(1))
        .subscribe(_ => {
          const upd = `notifications.${this.token}.topics.${topic}`;
          this.db.update(`users/${user.uid}`, { [upd]: true });
          this.snackBar.open(`subscribed to ${topic}`);
        });
    });
  }

  unsub(topic) {
    this.auth.user$.pipe(take(1)).subscribe(user => {
      this.fun
        .httpsCallable('unsubscribeFromTopic')({ topic, token: this.token })
        .pipe(take(1))
        .subscribe(_ => {
          const upd = `notifications.${this.token}.topics.${topic}`;
          this.db.update(`users/${user.uid}`, { [upd]: false });
          this.snackBar.open(`unsubscribed to ${topic}`);
        });
    });
  }
}
