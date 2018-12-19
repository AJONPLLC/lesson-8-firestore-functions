import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@ajonp-services/auth.service';
import { FirestoreService } from '@ajonp-services/firestore.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Book } from '@ajonp-models/book';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { DeleteConfirmComponent } from '@ajonp-shared/delete-confirm/delete-confirm.component';
import { DialogData } from '@ajonp-shared/delete-confirm/delete-confirm.component';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.scss']
})
export class BookEditComponent implements OnInit {
  bookForm: FormGroup;
  saving = false;
  editBook: Book = new Book();
  uploadSource: string;
  blob: Blob;
  book$: Observable<Book>;
  action: string;
  title = 'New Book';
  id: string;
  percentage$;

  constructor(
    private db: FirestoreService,
    public auth: AuthService,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    public router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.action = params.get('action');
      this.book$ = this.db.doc$<Book>(`books/${this.id}`);
      this.book$.subscribe(book => {
        if (this.action === 'edit') {
          this.bookForm = this.fb.group({
            title: [book.title, Validators.required],
            author: [book.author, Validators.required],
            description: [book.description, Validators.maxLength(255)]
          });
          this.editBook = book;
          this.title = 'Edit Book';
        } else {
          this.title = 'New Book';
        }
      });
    });
    this.buildForm();
  }
  private buildForm() {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      description: ['', Validators.maxLength(255)]
    });
  }
  rebuildForm() {
    this.bookForm.reset(0);
  }
  formChange() {
    this.bookForm.markAsDirty();
  }
  imgChange(event) {
    this.blob = event;
    console.log(event);
    this.bookForm.markAsDirty();
  }
  deleteImage() {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '250px',
      data: { deleteConfirmed: false }
    });

    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (result && result.deleteConfirmed) {
        this.db
          .update(`books/${this.id}`, {
            imageURL: firebase.firestore.FieldValue.delete()
          })
          .then(
            value =>
              this.snackBar.open('Deleted Image', '', { panelClass: 'success' }),
            reason =>
              this.snackBar.open(reason.message, '', { panelClass: 'error' })
          );
      }
    });
  }
  saveBookChanges() {
    if (this.bookForm.status !== 'VALID') {
      console.log('form is not valid, cannot save to database');
      return;
    }
    this.saving = true;
    const data = this.bookForm.value;
    data.edit = true;
    data.rating = this.editBook.rating;

    if (this.id) {
      this.db.updateAndUploadPic(`books/${this.id}`, data, this.blob).subscribe(
        value => {
          if (value.task) {
            this.percentage$ = value.task.percentageChanges();
          }
          if (value.updateRef) {
            value.updateRef.then(
              () => {
                this.saving = false;
                this.snackBar.open('Book Updated', '', {
                  panelClass: 'success'
                });
                this.router.navigate(['/books']);
              },
              reason => this.snackBar.open(reason.message, '', { panelClass: 'error' })
            );
          }
        },
        reason => this.snackBar.open(reason.message, '', { panelClass: 'error' }),
        () => {
          console.log('completed update');
        }
      );
    } else {
      this.db.createAndUploadPic('books', data, this.blob).subscribe(
        value => {
          if (value.createRef) {
            value.createRef.then(
              () => {
                this.saving = false;
                this.snackBar.open('Book Added', '', { panelClass: 'success' });
              },
              reason => this.snackBar.open(reason.message, '', { panelClass: 'error' })
            );
          }
          if (value.task) {
            this.percentage$ = value.task.percentageChanges();
          }
          if (value.updateRef) {
            value.updateRef.then(
              () => {
                this.saving = false;
                this.snackBar.open('Book Updated with Photo', '', {
                  panelClass: 'success'
                });
                this.router.navigate(['/books']);
              },
              reason => this.snackBar.open(reason.message, '', { panelClass: 'error' })
            );
          }
        },
        reason => this.snackBar.open(reason.message, '', { panelClass: 'error' }),
        () => {
          console.log('completed create');
        }
      );
    }
  }

  revert() {
    this.rebuildForm();
  }
}
