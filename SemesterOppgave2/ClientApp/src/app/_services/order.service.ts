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
    return this.http.get<Order>('/api/boattrip/getoneorder/' + id);
  }

  save(order: Order) {
    return this.http.post('/api/boattrip/saveorder/', order, { responseType: 'text' });
  }

  edit(order: Order) {
    return this.http.put('/api/boattrip/editorder/', order, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete('/api/boattrip/deleteorder/' + id, { responseType: 'text' });
  }
}
