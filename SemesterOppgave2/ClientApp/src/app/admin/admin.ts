import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'
import { BoatService } from '../_services/boat.service';

@Component({
  templateUrl: 'admin.html',
  styleUrls: ['./admin.css'],
})

export class Admin {
  admin: boolean = false;

  constructor(private _http: HttpClient, private router: Router, private cookieService: CookieService, private boatService: BoatService) { }

  ngOnInit() {
    this.boatService.getAll().subscribe(() => {

    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        /* If authentication error (timeout / not logging) */
        this.cookieService.delete(".AdventureWorks.Session");
        this.admin = false;
        this.router.navigate(['/home']);
      }
    }
    );
    if (this.cookieService.check(".AdventureWorks.Session")) {
      this.admin = true;
    } else {
      /* If no cookie found, redirect */
      this.admin = false;
      this.router.navigate(['/home']);
    }
  }
}
