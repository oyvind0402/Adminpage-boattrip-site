import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { Customer } from '../../../models/customer';
import { CustomerService } from '../../../_services/customer.service';
import { DeleteModal } from '../deletemodal/deletemodal';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  templateUrl: 'customer.html',
  styleUrls: ['./customer.css'],
})

export class CustomerComponent {
  customers: Customer[] = [];
  deletedCustomer: string;

  ngOnInit() {
    this.loadAllCustomers();
  }

  constructor(private customerService: CustomerService, private router: Router, private modalService: NgbModal, private cookieService: CookieService) { }
  deleteCustomer(id: number) {
    this.customerService.getOne(id).subscribe((customer) => {
      this.deletedCustomer = customer.firstname + " " + customer.lastname;
      this.showModalAndDelete(id);
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        alert("Your session timed out, please log in again.");
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    );
  }

  showModalAndDelete(id: number) {
    const modalRef = this.modalService.open(DeleteModal);
    modalRef.componentInstance.info = this.deletedCustomer;
    modalRef.result.then(result => {
      if (result == 'Delete') {
        this.customerService.delete(id).subscribe(() => {
          this.loadAllCustomers();
        }, (error: HttpErrorResponse) => {
          if (error.status == 404) {
            alert("Couldn't delete that customer, it's a part of another table (order) as a foreign key! Delete all the orders containing this customer first to be able to delete this customer!");
          }
          if (error.status == 401) {
            alert("Your session has timed out. Please log in again");
            this.cookieService.delete(".AdventureWorks.Session");
            this.router.navigate(['/home']);
          }
        });
      }
      this.router.navigate(['/customer'])
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        alert("Your session has timed out. Please log in again");
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    );
  }


  loadAllCustomers() {
    this.customerService.getAll().subscribe(customer => {
      this.customers = customer;
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        alert("Your session timed out, please log in again.");
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    );
  }
}
