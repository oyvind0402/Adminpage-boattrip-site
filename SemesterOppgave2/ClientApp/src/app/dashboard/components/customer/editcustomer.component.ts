import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Customer } from '../../../models/customer';
import { CustomerService } from '../../../_services/customer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertBox } from '../alertmodal/alertmodal';
import { PostPlace } from '../../../models/postPlace';
import { PostPlaceService } from '../../../_services/postPlace.service';

@Component({
  templateUrl: 'editcustomer.html',
})

export class EditCustomerComponent {
  form: FormGroup;
  postplaces: Array<PostPlace>;
  postplacechosen: PostPlace;

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
    postplace: ['']
  }


  constructor(private customerService: CustomerService, private postPlaceService: PostPlaceService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private cookieService: CookieService, private modalService: NgbModal) {
    this.form = fb.group(this.validation);
  }

  fetchCustomer(id: number) {
    this.customerService.getOne(id).subscribe(customer => {
      this.postplacechosen = this.postplaces.find(p => p.zipCode == customer.zipCode);
      this.form.patchValue({ id: customer.id });
      this.form.patchValue({ firstname: customer.firstname });
      this.form.patchValue({ lastname: customer.lastname });
      this.form.patchValue({ phonenr: customer.phonenr });
      this.form.patchValue({ email: customer.email });
      this.form.patchValue({ street: customer.street });
      this.form.patchValue({ postplace: this.postplacechosen });
    }, (error: HttpErrorResponse) => {
      /* If authentication error (timeout / not logging) */
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

  changePostplace(event) {
    this.postplacechosen = event;
  }

  editCustomer() {
    
    const editedCustomer = new Customer();
    editedCustomer.id = this.form.value.id;
    editedCustomer.firstname = this.form.value.firstname;
    editedCustomer.lastname = this.form.value.lastname;
    editedCustomer.phonenr = this.form.value.phonenr;
    editedCustomer.email = this.form.value.email;
    editedCustomer.street = this.form.value.street;
    editedCustomer.city = this.postplacechosen.city;
    editedCustomer.zipCode = this.postplacechosen.zipCode;

    this.customerService.edit(editedCustomer).subscribe(() => {
      this.router.navigate(['/customer']);
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        /* If authentication error (timeout / not logging) */
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
    this.postPlaceService.getAll().subscribe((postplaces) => {
      this.postplaces = postplaces;
      this.route.params.subscribe((params) => {
        this.fetchCustomer(params.id);
      }, error => console.log(error)
      );
    }, (error: HttpErrorResponse) => {
      /* If authentication error (timeout / not logging) */
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
}
