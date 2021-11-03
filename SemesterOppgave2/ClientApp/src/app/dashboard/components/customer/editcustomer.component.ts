import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Customer } from '../../../models/customer';
import { CustomerService } from '../../../_services/customer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertBox } from '../alertmodal/alertmodal';

@Component({
  templateUrl: 'editcustomer.html',
})

export class EditCustomerComponent {
  form: FormGroup;

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


  constructor(private customerService: CustomerService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private cookieService: CookieService, private modalService: NgbModal) {
    this.form = fb.group(this.validation);
  }

  fetchCustomer(id: number) {
    this.customerService.getOne(id).subscribe(customer => {
      this.form.patchValue({ id: customer.id });
      this.form.patchValue({ firstname: customer.firstname });
      this.form.patchValue({ lastname: customer.lastname });
      this.form.patchValue({ phonenr: customer.phonenr });
      this.form.patchValue({ email: customer.email });
      this.form.patchValue({ street: customer.street });
      this.form.patchValue({ zipCode: customer.zipCode });
      this.form.patchValue({ city: customer.city });
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        const alertRef = this.modalService.open(AlertBox);
        alertRef.componentInstance.body = "Your session timed out, please log in again.";
        alertRef.componentInstance.title = "Session timeout";
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    );

  }

  editCustomer() {
    
    const editedCustomer = new Customer();
    editedCustomer.id = this.form.value.id;
    editedCustomer.firstname = this.form.value.firstname;
    editedCustomer.lastname = this.form.value.lastname;
    editedCustomer.phonenr = this.form.value.phonenr;
    editedCustomer.email = this.form.value.email;
    editedCustomer.street = this.form.value.street;
    editedCustomer.city = this.form.value.city;
    editedCustomer.zipCode = this.form.value.zipCode;

    console.log(editedCustomer);

    this.customerService.edit(editedCustomer).subscribe(() => {
      this.router.navigate(['/customer']);
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        const alertRef = this.modalService.open(AlertBox);
        alertRef.componentInstance.body = "Your session timed out, please log in again.";
        alertRef.componentInstance.title = "Session timeout";        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    );
  }

  onSubmit() {
    this.editCustomer();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.fetchCustomer(params.id);
    }, error => console.log(error)
    );
  }
}
