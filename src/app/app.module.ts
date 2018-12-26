import {
  BrowserModule,
  BrowserTransferStateModule
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// AJONP App Modules
import { SharedModule } from './shared/shared.module';

// @angular/fire/ Modules
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule, FunctionsRegionToken } from '@angular/fire/functions';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

// @angular/material
import {
  MatToolbarModule,
  MatButtonModule,
  MatMenuModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatTabsModule,
  MatCardModule,
  MatExpansionModule,
  MatSliderModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';

// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTrophy,
  faWineGlass,
  faUser,
  faBuilding,
  faSignInAlt,
  faSignOutAlt,
  faBars,
  faCog,
  faHome,
  faWindowClose,
  faPlus,
  faArrowLeft,
  faCheck,
  faThumbsUp,
  faCommentAlt,
  faTrashAlt,
  faEdit,
  faGlassMartini,
  faUpload,
  faCamera,
  faBook,
  faEllipsisV,
  faCoffee,
  faSquare,
  faStar,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpReg, faHeart as faHeartReg } from '@fortawesome/free-regular-svg-icons';
import { faTwitter, faGoogle, faGithub, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { OverlayContainer } from '@angular/cdk/overlay';

// Add an icon to the library for convenient access in other components
library.add(
  faTrophy,
  faWineGlass,
  faUser,
  faBuilding,
  faSignInAlt,
  faSignOutAlt,
  faBars,
  faCog,
  faHome,
  faWindowClose,
  faPlus,
  faArrowLeft,
  faCheck,
  faThumbsUp,
  faThumbsUpReg,
  faCommentAlt,
  faTrashAlt,
  faEdit,
  faGlassMartini,
  faUpload,
  faCamera,
  faBook,
  faEllipsisV,
  faCoffee,
  faSquare,
  faStar,
  faTwitter,
  faGoogle,
  faGithub,
  faFacebook,
  faHeart,
  faHeartReg,
);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    BrowserTransferStateModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatCardModule,
    MatExpansionModule,
    MatSliderModule,
    MatSnackBarModule,
    FontAwesomeModule,
    SharedModule,
    AngularFireModule.initializeApp(
      environment.firebase,
      'ajonp-lesson-8-admin'
    ),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    AngularFireMessagingModule,
    ServiceWorkerModule.register('/combined-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    { provide: FunctionsRegionToken, useValue: 'us-central1' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('ajonp-lesson-8-admin-app-theme');
  }
}
