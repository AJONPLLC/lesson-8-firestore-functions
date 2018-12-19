import { SsrPageComponent } from './ssr-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: SsrPageComponent
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SsrPageRoutingModule { }
