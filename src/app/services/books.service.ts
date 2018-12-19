import { Injectable } from '@angular/core';
import { BooksModule } from '../books/books.module';
import { FirestoreService } from '@ajonp-services/firestore.service';
import { Observable, empty, of } from 'rxjs';
import { Book } from '@ajonp-models/book';
import { map, take, tap, switchMap } from 'rxjs/operators';
import { Review } from '@ajonp-models/review';
import { AuthService } from '@ajonp-services/auth.service';
import { AjonpUser } from '@ajonp-models/ajonp-user';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  constructor(private db: FirestoreService, public auth: AuthService) {}
  getBooks(): Observable<any> {
    return this.db
      .colWithIds$<Book>('books', ref => ref.orderBy('updatedAt', 'desc'))
      .pipe(map((books: Book[]) => books.map(book => this.setupBook(book))));
  }
  getBook(id: string) {
    return this.db
      .doc$<Book>(`books/${id}`)
      .pipe(map((book: Book) => this.setupBook(book)));
  }
  private setupBook(book: Book) {
    let topReview$: Observable<Review>;
    if (book.topReview !== undefined) {
      topReview$ = this.db.doc$<Review>(
        `books/${book.id}/${book.topReview.path}`
      );
    } else {
      topReview$ = empty();
    }
    const ratings = [
      { active: false },
      { active: false },
      { active: false },
      { active: false },
      { active: false }
    ];
    if (book.rating) {
      for (let i = 0; i < book.rating; i++) {
        ratings[i].active = true;
      }
    }
    const bookLike$ = this.auth.user$.pipe(
      switchMap(user => this.db.doc$(`/books/${book.id}/likes/${user.uid}`))
    );

    const bookCounts$ = this.db.doc$(`/books/${book.id}/likes/counts`);

    return { topReview$, ...book, ratings, bookLike$, bookCounts$ };
  }
  like(book: Book, user: AjonpUser) {
    this.db.aFirestore.firestore.runTransaction(transaction => {
      return transaction
        .get(this.db.doc(`/books/${book.id}/likes/${user.uid}`).ref)
        .then(sfDoc => {
          if (!sfDoc.exists) {
            transaction.set(sfDoc.ref, { [user.uid]: true });
          } else {
            transaction.delete(sfDoc.ref);
          }
        });
    });
  }
  deleteBook(book: Book) {
    return this.db.delete(`books/${book.id}`);
  }
}
