import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Admin } from './admin/admin';

const appRoots: Routes = [
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
