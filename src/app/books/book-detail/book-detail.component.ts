import { BooksService } from '@ajonp-services/books.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '@ajonp-services/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Book } from '@ajonp-models/book';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  book$: Observable<Book>;
  constructor(
    private db: FirestoreService,
    private route: ActivatedRoute,
    private booksService: BooksService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.book$ = this.booksService.getBook(params.get('id'));
    });
  }
}
