import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSigninComponent } from './user-signin.component';
import { Routes, RouterModule } from '@angular/router';
import { UserSigninRoutingModule } from './user-signin-routing.module';
import { UserFormModule } from '../user-form/user-form.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import { MatButtonModule, MatCardModule } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const routes: Routes = [
  { path: '', component: UserSigninComponent
}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UserSigninRoutingModule,
    UserFormModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    FontAwesomeModule
  ],
  declarations: [UserSigninComponent]
})
export class UserSigninModule { }
