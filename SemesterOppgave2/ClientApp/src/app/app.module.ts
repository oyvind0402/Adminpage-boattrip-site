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
import { TerminalComponent } from './dashboard/components/terminal/terminal.service';
import { BoatService } from './_services/boat.service';
import { RouteService } from './_services/route.service';
import { TerminalService } from './_services/terminal.service';

@NgModule({
  declarations: [
    AppComponent,
    Admin,
    Home,
    NavMenu,
    AppFooter,
    NavMenu,
    CustomerComponent,
    BoatComponent,
    RouteComponent,
    TerminalComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [CustomerService, BoatService, RouteService, TerminalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
