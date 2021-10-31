import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user';


@Component({
  templateUrl: 'home.html',
  styleUrls: ['./home.css'],
})

export class Home {
  form: FormGroup;



  ngOnInit() {
  }

  
  
  validering = {
    email: [
      null, Validators.compose([Validators.required, Validators.pattern("([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)")])
    ],
    password: [
      null, Validators.compose([Validators.required, Validators.pattern("(?=.*[A-Za-z])(?=.*\d)([a-zA-Z\d]{6,})")])
    ]
  };

  constructor( private _http: HttpClient, private router: Router, private fb: FormBuilder) {
    this.form = fb.group(this.validering);
  }

  logIn() {
    const user = new User();
    user.email = this.form.value.email;
    user.password = this.form.value.password;

    console.log(user.email + " " + user.password);

    this._http.post<User>("api/boattrip/login", user).subscribe(value => {
      //Har den her for nå, skal endre til å sjekke etter session cookie etterhvert
      localStorage.setItem("admin", "true");
      this.router.navigate(['/admin']);
    },
      error => console.log(error)
    );
  };

  onSubmit() {
    this.logIn();
  }
}
