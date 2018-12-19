import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from './user-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FlexLayoutModule],
  declarations: [UserFormComponent],
  exports: [UserFormComponent]
})
export class UserFormModule {}
