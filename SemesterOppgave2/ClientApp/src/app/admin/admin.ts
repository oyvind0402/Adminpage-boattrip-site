import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'
import { BoatService } from '../_services/boat.service';

@Component({
  templateUrl: 'admin.html',
  styleUrls: ['./admin.css'],
})

export class Admin {
  admin: boolean;

  constructor(private _http: HttpClient, private router: Router, private cookieService: CookieService, private boatService: BoatService) { }

  logOut() {
    this._http.get("api/boattrip/logout").subscribe(() => {
      this.cookieService.delete(".AdventureWorks.Session");
      this.admin = false;
      this.router.navigate(['/home']);
    }, error => console.log(error)
    );
  }

  ngOnInit() {
    this.boatService.getAll().subscribe(() => {

    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        this.cookieService.delete(".AdventureWorks.Session");
        this.admin = false;
      }
    }
    );
    if (this.cookieService.check(".AdventureWorks.Session")) {
      this.admin = true;
    } else {
      this.admin = false;
    }
  }
}
