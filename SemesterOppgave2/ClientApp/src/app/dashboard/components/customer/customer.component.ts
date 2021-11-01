import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../models/customer';
import { CustomerService } from '../../../_services/customer.service';


@Component({
  templateUrl: 'customer.html',
  styleUrls: ['./customer.css'],
})

export class CustomerComponent {
  customers: Customer[] = [];

  ngOnInit() {

    this.loadAllCustomers();
  }
  

  constructor(private customerService: CustomerService) {
  
  }
  delete(id: number) {
    this.customerService.delete(id).subscribe(() => { this.loadAllCustomers() });
  }


  loadAllCustomers() {
    this.customerService.getAll().subscribe(customer => { this.customers = customer; });
    console.log(this.customers); 

  }

}
