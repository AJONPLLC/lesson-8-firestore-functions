import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import {
  MatCardModule,
  MatButtonModule,
} from '@angular/material';

@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule,
    WelcomeRoutingModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule
  ]
})
export class WelcomeModule { }
