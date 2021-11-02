import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Boat } from '../models/boat';


@Injectable()
export class BoatService {
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<Boat[]>("api/boattrip/getallboats")
  }

  getOne(id: number) {
    return this.http.get<Boat>('/api/boattrip/getoneboat/' + id);
  }

  save(boat: Boat) {
    return this.http.post('/api/boattrip/saveboat/', boat, { responseType: 'text' });
  }

  edit(boat: Boat) {
    return this.http.put('/api/boattrip/editboat', boat, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete('/api/boattrip/deleteboat/' + id, { responseType: 'text' });
  }
}
