import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@ajonp-shared/shared.module';
import { BooksRoutingModule } from './books-routing.module';
import {
  MatCardModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatSliderModule,
  MatProgressBarModule,
  MatBadgeModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BooksComponent } from './books.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { DeleteConfirmComponent } from '@ajonp-shared/delete-confirm/delete-confirm.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BooksRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSliderModule,
    MatProgressBarModule,
    MatBadgeModule,
    FontAwesomeModule,
  ],
  entryComponents: [DeleteConfirmComponent],
  declarations: [BooksComponent, BookEditComponent, BookDetailComponent],
})
export class BooksModule {}
