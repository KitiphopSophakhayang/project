import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListEditComponent } from './fontend-admin/list-edit/list-edit.component';
import { ListMenuComponent } from './fontend-admin/list-menu/list-menu.component';
import { OrderMenuComponent } from './fontend-admin/order-menu/order-menu.component';
import { ReportComponent } from './fontend-admin/report/report.component';

const routes: Routes = [
  { path: '', redirectTo: '/ListMenu', pathMatch: 'full' },
  { path: 'ListMenu', component: ListMenuComponent },
  { path: 'OrderMenu', component: OrderMenuComponent },
  { path: 'ListEdit', component: ListEditComponent },
  { path: 'Report', component: ReportComponent },
  { path: '**', redirectTo: 'ListMenu' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
