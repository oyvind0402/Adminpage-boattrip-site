import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Admin } from './admin/admin';
import { CustomerComponent } from './dashboard/components/customer/customer.component';
import { Home } from './home/home';


const appRoots: Routes = [
  //this component makes the /get 404 problem
  { path: 'customer', component: CustomerComponent },
  { path: 'home', component: Home },
  { path: 'admin', component: Admin },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoots),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule {}
