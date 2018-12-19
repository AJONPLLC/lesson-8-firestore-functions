import { FcmService } from './services/fcm.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';
import { AuthService } from '@ajonp-services/auth.service';
import { Breakpoints, BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('snav') public sidenav: MatSidenav;
  title = `Oliver's Books`;

  navPush = true;
  constructor(
    public breakpointObserver: BreakpointObserver,
    public auth: AuthService,
    private router: Router,
    private fcm: FcmService
  ) {
    breakpointObserver.observe([
      Breakpoints.Handset
    ])
    .subscribe(result => {
      this.navPush = result.matches;
    });
  }
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (
        this.sidenav &&
        event instanceof NavigationEnd &&
        this.navPush
      ) {
        this.sidenav.close();
      }
    });
    this.fcm.showMessages().subscribe();
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
  }
  onActivate(event) {
    // scroll up on every route change.
    window.scroll(0, 0);
  }
  snavToggle(snav) {
    snav.toggle();
  }
  signOut() {
    this.auth.signOut();
  }
}
