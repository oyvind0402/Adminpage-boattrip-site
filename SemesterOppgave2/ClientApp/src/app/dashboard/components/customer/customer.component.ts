import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Customer } from '../../../models/customer';
import { CustomerService } from '../../../_services/customer.service';
import { DeleteModal } from '../deletemodal/deletemodal';

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
  
  constructor(private customerService: CustomerService, private router: Router, private modalService: NgbModal) { }
  deleteCustomer(id: number) {
    this.customerService.getOne(id).subscribe((customer) => {
      this.deletedCustomer = customer.firstname + " " + customer.lastname;
      this.showModalAndDelete(id);
    }, error => console.log(error)
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
        });
      }
      this.router.navigate(['/customer'])
    }, error => console.log(error)
    );
  }


  loadAllCustomers() {
    this.customerService.getAll().subscribe(customer => {
      this.customers = customer;
    });
  }

}
