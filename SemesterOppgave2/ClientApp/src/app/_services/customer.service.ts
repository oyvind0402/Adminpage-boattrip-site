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
    return this.http.get<Customer>('/api/boattrip/getonecustomer/' + id);
  }
  
  save(customer: Customer) {
    return this.http.post('/api/boattrip/savecustomer/', customer, { responseType: 'text' });
  }
  
  edit(customer: Customer) {
    return this.http.put('/api/boattrip/editcustomer/', customer, { responseType: 'text' });
  }
  
  delete(id: number) {
    return this.http.delete('/api/boattrip/deletecustomer/' + id, { responseType: 'text' });
  }
}
