import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SsrPageRoutingModule } from './ssr-page-routing.module';

import { SsrPageComponent } from './ssr-page.component';

@NgModule({
  declarations: [SsrPageComponent],
  imports: [
    CommonModule,
    SsrPageRoutingModule
  ]
})
export class SsrPageModule { }
