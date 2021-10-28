import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: 'admin.html'
})

export class Admin {
  admin: boolean;

  constructor(private _http: HttpClient) {}

  checkAdmin() {
    if (localStorage.getItem("admin")) {
      this.admin = true;
    } else {
      this.admin = false;
    }
  }

  logOut() {
    this._http.get("api/boattrip/logout").subscribe(() => {
      localStorage.removeItem("admin");
    }, error => console.log(error)
    );
  }

  ngOnInit() {
    this.checkAdmin();
  }
}
