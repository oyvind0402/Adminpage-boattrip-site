import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route } from '../models/route';


@Injectable()
export class RouteService {
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<Route[]>("api/boattrip/getallroutes")
  }

  getOne(id: number) {
    return this.http.get<Route>('/api/boattrip/getoneroute/' + id);
  }

  save(route: Route) {
    return this.http.post('/api/boattrip/saveroute/', route, { responseType: 'text' });
  }

  edit(route: Route) {
    return this.http.put('/api/boattrip/editroute/', route, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete('/api/boattrip/deleteroute/' + id, { responseType: 'text' });
  }
}
