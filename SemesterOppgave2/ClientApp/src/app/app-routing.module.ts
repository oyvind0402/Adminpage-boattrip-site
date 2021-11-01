import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Admin } from './admin/admin';
import { BoatComponent } from './dashboard/components/boat/boat.component';
import { EditBoatComponent } from './dashboard/components/boat/editboat.component';
import { SaveBoatComponent } from './dashboard/components/boat/saveboat.component';
import { CustomerComponent } from './dashboard/components/customer/customer.component';
import { OrderComponent } from './dashboard/components/order/order.component';
import { PostPlaceComponent } from './dashboard/components/postplace/postplace.component';
import { RouteComponent } from './dashboard/components/route/route.component';
import { TerminalComponent } from './dashboard/components/terminal/terminal.service';
import { Home } from './home/home';


const appRoots: Routes = [
  { path: 'boat', component: BoatComponent },
  { path: 'editboat/:id', component: EditBoatComponent },
  { path: 'saveboat', component: SaveBoatComponent },
  { path: 'customer', component: CustomerComponent },
  { path: 'route', component: RouteComponent },
  { path: 'terminal', component: TerminalComponent },
  { path: 'postplace', component: PostPlaceComponent },
  { path: 'order', component: OrderComponent },
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
