import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Customer } from '../models/customer';

@Injectable()
export class CustomerService {
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<Customer[]>("api/boattrip/getallcustomers")
  }

  getOne(id: number) {
    return this.http.get('/api/boattrip/getonecustomer/' + id);
  }
  
  save(customer: Customer) {
    return this.http.post('/api/boattrip/savecustomer/', customer);
  }
  
  edit(customer: Customer) {
    return this.http.put('/api/boattrip/editcustomer/' + customer.id, customer);
  }
  
  delete(id: number) {
    return this.http.delete('/api/boattrip/deletecustomer/' + id);
  }
}
