import { BooksService } from '@ajonp-services/books.service';
import { AjonpUser } from './../models/ajonp-user';
import { AuthService } from '@ajonp-services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '@ajonp-models/book';
import { MatDialog, MatSnackBar } from '@angular/material';
import {
  DeleteConfirmComponent,
  DialogData
} from '@ajonp-shared/delete-confirm/delete-confirm.component';
import { QueryFn } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  public books$: Observable<Book[]>;
  public dialogData: DialogData;
  constructor(
    public auth: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private booksService: BooksService,
  ) {}

  ngOnInit() {
    this.books$ = this.booksService.getBooks();
  }
  edit(book: Book) {
    this.router.navigate(['/books/edit/', book.id]);
  }
  detail(book: Book) {
    this.router.navigate(['/books/detail/', book.id]);
  }
  like(book: Book, user: AjonpUser) {
    this.booksService.like(book, user);
  }
  delete(book: Book) {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '250px',
      data: { deleteConfirmed: false }
    });

    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (result.deleteConfirmed) {
        this.booksService.deleteBook(book)
        .then(
          value => this.snackBar.open('Deleted', '', { panelClass: 'success' }),
          reason =>
            this.snackBar.open(reason.message, '', { panelClass: 'error' })
        );
      }
    });
  }
}
