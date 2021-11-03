import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from 'src/app/app.component';
@Component({
  selector: 'app-nav-menu',
  templateUrl: 'navmenu.html',
  styleUrls: ['./navmenu.css'],
})

export class NavMenu {
  admin: boolean;

  constructor(private _http: HttpClient, private router: Router, private cookieService: CookieService) { }

  checkAdmin() {
    if (this.cookieService.check(".AdventureWorks.Session")) {
      this.admin = true;
    } else {
      this.admin = false;
    }
  }

  logOut() {
    this._http.get("api/boattrip/logout").subscribe(() => {
      this.cookieService.delete(".AdventureWorks.Session");
      this.admin = false;
      this.router.navigate(['/home']);
    }, error => console.log(error)
    );
    this.ngOnInit();
  }

  ngOnInit() {
    this.checkAdmin();
  }
}
