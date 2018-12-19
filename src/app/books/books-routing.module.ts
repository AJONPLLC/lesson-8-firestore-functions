import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksComponent } from './books.component';
import { AuthGuard } from '@ajonp-services/auth.guard';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookEditComponent } from './book-edit/book-edit.component';

const routes: Routes = [
      { path: '', component: BooksComponent },
      { path: 'detail/:id', component: BookDetailComponent, canActivate: [AuthGuard] },
      { path: ':action', component: BookEditComponent, canActivate: [AuthGuard] },
      { path: ':action/:id', component: BookEditComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule {}
