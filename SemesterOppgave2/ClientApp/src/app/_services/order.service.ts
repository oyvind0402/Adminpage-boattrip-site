import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Route } from '../models/order';

@Injectable()
export class RouteService {
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<Route[]>("api/boattrip/getallorders")
  }

  getOne(id: number) {
    return this.http.get<Route>('/api/boattrip/getoneorder/' + id);
  }

  save(order: Route) {
    return this.http.post('/api/boattrip/saveorder/', order, { responseType: 'text' });
  }

  edit(order: Route) {
    return this.http.put('/api/boattrip/editorder/', order, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete('/api/boattrip/deleteorder/' + id, { responseType: 'text' });
  }
}
