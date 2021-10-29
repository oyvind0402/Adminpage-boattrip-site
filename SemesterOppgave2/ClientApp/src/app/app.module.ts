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

@NgModule({
  declarations: [
    AppComponent,
    Admin,
    Home,
    NavMenu,
    AppFooter
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
