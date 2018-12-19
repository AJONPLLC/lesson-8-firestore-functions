import { Component, OnInit } from '@angular/core';
import { AuthService } from '@ajonp-services/auth.service';
import { FcmService } from '@ajonp-services/fcm.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  notification$;
  constructor(public auth: AuthService, private fcm: FcmService) {}

  ngOnInit() {
    this.notification$ = this.fcm.getNotification();
  }
}
