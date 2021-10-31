import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  templateUrl: 'admin.html',
  styleUrls: ['./admin.css'],
})

export class Admin {
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
  }

  ngOnInit() {
    this.checkAdmin();
    console.log(this.cookieService.get(".AdventureWorks.Session"));
  }
}
