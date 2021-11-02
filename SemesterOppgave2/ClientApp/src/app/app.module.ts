import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { Admin } from './admin/admin';
import { Home } from './home/home';
import { NavMenu } from './navmenu/navmenu';
import { AppRoutingModule } from './app-routing.module';
import { AppFooter } from './footer/footer';
import { CustomerService } from './_services/customer.service';
import { CustomerComponent } from './dashboard/components/customer/customer.component';
import { BoatComponent } from './dashboard/components/boat/boat.component';
import { RouteComponent } from './dashboard/components/route/route.component';
import { TerminalComponent } from './dashboard/components/terminal/terminal.component';
import { BoatService } from './_services/boat.service';
import { OrderService } from './_services/order.service';
import { RouteService } from './_services/route.service';
import { TerminalService } from './_services/terminal.service';
import { OrderComponent } from './dashboard/components/order/order.component';
import { PostPlaceService } from './_services/postPlace.service';
import { PostPlaceComponent } from './dashboard/components/postplace/postplace.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EditBoatComponent } from './dashboard/components/boat/editboat.component';
import { SaveBoatComponent } from './dashboard/components/boat/saveboat.component';

import { SaveCustomerComponent } from './dashboard/components/customer/savecustomer.component';
import { EditCustomerComponent } from './dashboard/components/customer/editcustomer.component';

import { EditOrderComponent } from './dashboard/components/order/editorder.component';
import { SaveOrderComponent } from './dashboard/components/order/saveorder.component';

import { DeleteModal } from './dashboard/components/deletemodal/deletemodal';
import { EditTerminalComponent } from './dashboard/components/terminal/editterminal.component';
import { SavePostPlaceComponent } from './dashboard/components/postplace/savepostplace.component';
import { EditPostplaceComponent } from './dashboard/components/postplace/editpostplace.component';
import { EditRouteComponent } from './dashboard/components/route/editroute.component';
import { SaveRouteComponent } from './dashboard/components/route/saveroute.component';


import { SaveTerminalComponent } from './dashboard/components/terminal/saveterminal.component';


@NgModule({
  declarations: [
    AppComponent,
    Admin,
    Home,
    NavMenu,
    AppFooter,
    NavMenu,
    DeleteModal,

    CustomerComponent,
    EditCustomerComponent,
    SaveCustomerComponent,

    BoatComponent,
    EditBoatComponent,
    SaveBoatComponent,

    OrderComponent,
    EditOrderComponent,
    SaveOrderComponent,

    RouteComponent,
    EditRouteComponent,
    SaveRouteComponent,

    TerminalComponent,
    EditTerminalComponent,
    SaveTerminalComponent,

    PostPlaceComponent,
    EditPostplaceComponent,


    //SavePostPlaceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
  ],
  providers: [CustomerService, BoatService, RouteService, TerminalService, OrderService, PostPlaceService],
  bootstrap: [AppComponent],
  entryComponents: [DeleteModal],
})
export class AppModule { }
