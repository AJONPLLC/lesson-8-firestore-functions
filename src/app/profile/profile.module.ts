import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { MatSlideToggleModule, MatSnackBarModule, MatCardModule, MatButtonModule, MatListModule } from '@angular/material';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    FlexLayoutModule
  ]
})
export class ProfileModule { }
