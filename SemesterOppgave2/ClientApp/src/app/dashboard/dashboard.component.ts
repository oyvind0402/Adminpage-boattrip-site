import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../_services/customer.service'
import { Customer } from '../models/customer'

@Component({
  templateUrl: 'dashboard.html'
})

export class DashboardComponent {
  customers: Customer[] = [];

  ngOnInit() {

    this.loadAllUsers();
  }
  

  constructor(private customerService: CustomerService) {
  
  }

  loadAllUsers() {
    this.customerService.getAll().subscribe(customer => { this.customers = customer; });
    console.log(this.customers); //returns undefined why? 

  }

}
