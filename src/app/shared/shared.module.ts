import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { DeleteConfirmComponent } from './delete-confirm/delete-confirm.component';

@NgModule({
  declarations: [ImageUploadComponent, DeleteConfirmComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    FontAwesomeModule
  ],
  exports: [ImageUploadComponent, DeleteConfirmComponent]
})
export class SharedModule { }
