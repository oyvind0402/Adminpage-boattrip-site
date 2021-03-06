import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Admin } from './admin/admin';
import { BoatComponent } from './dashboard/components/boat/boat.component';
import { EditBoatComponent } from './dashboard/components/boat/editboat.component';
import { SaveBoatComponent } from './dashboard/components/boat/saveboat.component';

import { CustomerComponent } from './dashboard/components/customer/customer.component';
import { EditCustomerComponent } from './dashboard/components/customer/editcustomer.component';
import { SaveCustomerComponent } from './dashboard/components/customer/savecustomer.component';

import { OrderComponent } from './dashboard/components/order/order.component';
import { EditOrderComponent } from './dashboard/components/order/editorder.component';

import { PostPlaceComponent } from './dashboard/components/postplace/postplace.component';
import { RouteComponent } from './dashboard/components/route/route.component';
import { TerminalComponent } from './dashboard/components/terminal/terminal.component';
import { Home } from './home/home';
import { EditTerminalComponent } from './dashboard/components/terminal/editterminal.component';
import { EditPostplaceComponent } from './dashboard/components/postplace/editpostplace.component';
import { SavePostPlaceComponent } from './dashboard/components/postplace/savepostplace.component';
import { EditRouteComponent } from './dashboard/components/route/editroute.component';
import { SaveTerminalComponent } from './dashboard/components/terminal/saveterminal.component';
import { SaveRouteComponent } from './dashboard/components/route/saveroute.component';


const appRoots: Routes = [
  { path: 'order', component: OrderComponent },
  { path: 'editorder/:id', component: EditOrderComponent },

  { path: 'boat', component: BoatComponent },
  { path: 'editboat/:id', component: EditBoatComponent },
  { path: 'saveboat', component: SaveBoatComponent },

  { path: 'customer', component: CustomerComponent },
  { path: 'editcustomer/:id', component: EditCustomerComponent },
  { path: 'savecustomer', component: SaveCustomerComponent },

  { path: 'route', component: RouteComponent },
  { path: 'editroute/:id', component: EditRouteComponent },
  { path: 'saveroute', component: SaveRouteComponent },

  { path: 'terminal', component: TerminalComponent },
  { path: 'editterminal/:id', component: EditTerminalComponent },
  { path: 'saveterminal', component: SaveTerminalComponent },

  { path: 'postplace', component: PostPlaceComponent },
  { path: 'editpostplace/:id', component: EditPostplaceComponent },
  { path: 'savepostplace', component: SavePostPlaceComponent },

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
