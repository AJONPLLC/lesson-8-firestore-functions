import { QueryFn, CollectionReference } from '@angular/fire/firestore';
import { AjonpUser } from './../models/ajonp-user';
import { AuthService } from './../services/auth.service';
import { MatSnackBar, MatSlideToggleChange } from '@angular/material';
import { FcmService } from './../services/fcm.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '@ajonp-services/firestore.service';
import { tap, take, switchMap, map, mergeMap } from 'rxjs/operators';
import { AjonpNotification } from '@ajonp-models/ajonp-notification';
import { Observable } from 'rxjs';
import { AjonpConfig } from '@ajonp-models/ajonp-config';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  token;
  user: AjonpUser;
  notificationError = false;
  constructor(
    public fcm: FcmService,
    public snackBar: MatSnackBar,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.fcm.setToken();
  }
  sub(event) {
    if (event.option.selected) {
      this.fcm.sub(event.option.value);
    } else {
      this.fcm.unsub(event.option.value);
    }
  }
  toggleNotification(slideToggle: MatSlideToggleChange) {
    if (slideToggle.checked) {
      this.getPermission(slideToggle);
    } else {
      this.removePermission(slideToggle);
    }
  }
  getPermission(slideToggle: MatSlideToggleChange) {
    this.fcm.getPermission().pipe(take(1)).subscribe(() => {}, error => {
      this.fcm.token = false;
      this.notificationError = true;
    });
  }
  removePermission(slideToggle: MatSlideToggleChange) {
    this.fcm.removePermission();
  }
}
