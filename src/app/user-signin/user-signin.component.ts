import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as firebaseui from 'firebaseui';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'user-signin',
  templateUrl: './user-signin.component.html',
  styleUrls: ['./user-signin.component.scss']
})
export class UserSigninComponent implements OnInit, OnDestroy {
  ui: firebaseui.auth.AuthUI;
  constructor(public afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit(): void {
    // FirebaseUI config.
    const uiConfig = {
      signInSuccessUrl: '/welcome',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          authMethod: 'https://accounts.google.com',
          // Required to enable ID token credentials for this provider.
          // This can be obtained from the Credentials page of the Google APIs
          // console.
          clientId:
            '176372028272-t48gj4hujl6kjr6398pa7pfdf2pblh9c.apps.googleusercontent.com'
        },
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.PhoneAuthProvider.PROVIDER_ID
        // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ],
      // Required to enable one-tap sign-up credential helper.
      // credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
      // tosUrl and privacyPolicyUrl accept either url string or a callback
      // function.
      // Terms of service url/callback.
      tosUrl:
        'https://app.termly.io/document/privacy-policy/7ca8ecd9-151e-4db1-a5de-0f532b5f69ed',
      // Privacy policy url/callback.
      privacyPolicyUrl: function() {
        window.location.assign(
          'https://app.termly.io/document/privacy-policy/7ca8ecd9-151e-4db1-a5de-0f532b5f69ed'
        );
      }
    };

    this.ui = new firebaseui.auth.AuthUI(this.afAuth.auth);
    this.ui.start('#firebaseui-auth-container', uiConfig);
  }
  ngOnDestroy(): void {
    this.ui.delete();
  }
}
