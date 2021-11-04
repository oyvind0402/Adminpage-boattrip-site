import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Customer } from '../../../models/customer';
import { CustomerService } from '../../../_services/customer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertBox } from '../alertmodal/alertmodal';

@Component({
  templateUrl: 'savecustomer.html',
})

export class SaveCustomerComponent {
  form: FormGroup;

  /*Validation patterns*/
  validation = {
    id: [""],
    firstname: [
      '', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅ. \\-]{2,20}")])
    ],
    lastname: [
      '', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅ. \\-]{2,30}")])
    ],
    phonenr: [
      '', Validators.compose([Validators.required, Validators.pattern("(\\+47)?[2-9][0-9]{7}")])
    ],
    email: [
      '', Validators.compose([Validators.required, Validators.pattern("([\\w\\.\\-]+)@([\\w\\-]+)((\\.(\\w){2,3})+)")])
    ],
    street: [
      '', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \\-]{2,50}")])
    ],
    zipCode: [
      '', Validators.compose([Validators.required, Validators.pattern("[1-9][0-9]{4}|[0-9]{4}|[1-9]{1}[0-9]{2}( )[0-9]{2}")])
    ],
    city: [
      '', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \\-]{2,30}")])
    ]
  }


  constructor(private customerService: CustomerService, private router: Router, private fb: FormBuilder, private cookieService: CookieService, private modalService: NgbModal) {
    this.form = fb.group(this.validation);
  }

  saveACustomer() {
    const newCustomer = new Customer();
    newCustomer.firstname = this.form.value.firstname;
    newCustomer.lastname = this.form.value.lastname;
    newCustomer.phonenr = this.form.value.phonenr;
    newCustomer.email = this.form.value.email;
    newCustomer.street = this.form.value.street;
    newCustomer.city = this.form.value.city;
    newCustomer.zipCode = this.form.value.zipCode;
   
    this.customerService.save(newCustomer).subscribe(() => {
      this.router.navigate(['/customer']);
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        /* If authentication error (timeout / not logging) */
        const alertRef = this.modalService.open(AlertBox);
        alertRef.componentInstance.body = "Your session timed out, please log in again.";
        alertRef.componentInstance.title = "Session timeout";
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    );
  }

  onSubmit() {
    this.saveACustomer();
  }
}
