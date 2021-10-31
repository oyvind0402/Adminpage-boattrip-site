import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Order } from '../models/order';

@Injectable()
export class OrderService {
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<Order[]>("api/boattrip/getallorders")
  }

  getOne(id: number) {
    return this.http.get('/api/boattrip/getoneorder/' + id);
  }

  save(customer: Order) {
    return this.http.post('/api/boattrip/saveorder/', customer);
  }

  // no methods in controller
  /*edit(customer: Order) {
    return this.http.put('/api/boattrip/editcustomer/' + customer.id, customer);
  }

  delete(id: number) {
    return this.http.delete('/api/boattrip/deletecustomer/' + id);
  }*/
}
