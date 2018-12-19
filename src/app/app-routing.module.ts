import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'welcome',
    loadChildren: './welcome/welcome.module#WelcomeModule'
  },
  {
    path: 'profile',
    loadChildren: './profile/profile.module#ProfileModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'books',
    loadChildren: './books/books.module#BooksModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'signin',
    loadChildren: './user-signin/user-signin.module#UserSigninModule'
  },
  {
    path: 'ssr',
    loadChildren: './ssr-page/ssr-page.module#SsrPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
