import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Admin } from './admin/admin';
import { DashboardComponent } from './dashboard/dashboard.component';


const appRoots: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'home', component: Home },
  { path: 'admin', component: Admin },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
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
