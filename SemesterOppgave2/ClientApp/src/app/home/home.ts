import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user';
import { CookieService } from 'ngx-cookie-service';
import { BoatService } from '../_services/boat.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  templateUrl: 'home.html',
  styleUrls: ['./home.css'],
})

export class Home {
  form: FormGroup;
  admin: boolean;
  
  validering = {
    email: [
      '', Validators.compose([Validators.required, Validators.pattern("([\\w\\.\\-]+)@([\\w\\-]+)((\\.(\\w){2,3})+)")])
    ],
    password: [
      '', Validators.compose([Validators.required, Validators.pattern("(?=.*[A-Za-z])(?=.*\\d)([a-zA-Z\\d]{6,})")])
    ]
  };

  constructor(private _http: HttpClient, private router: Router, private fb: FormBuilder, private cookieService: CookieService, private boatService: BoatService) {
    this.form = fb.group(this.validering);
  }

  logIn() {
    const user = new User();
    user.email = this.form.value.email;
    user.password = this.form.value.password;

    this._http.post<User>("api/boattrip/login", user).subscribe(value => {
      this.router.navigate(['/admin']);
    },
      error => console.log(error)
    );
  };

  onSubmit() {
    this.logIn();
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
