import { Component, Input, OnInit } from '@angular/core';
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
  @Input()
  admin: boolean = false;

  constructor(private _http: HttpClient, private router: Router, private cookieService: CookieService) { }

  ngOnInit() {
    if (this.cookieService.check(".AdventureWorks.Session")) {
      this.admin = true;
    } else {
      this.admin = false;
      this.router.navigate(['/']);
    }
  }
}
