import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Boat } from '../models/Boat';


@Injectable()
export class BoatService {
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<Boat[]>("api/boattrip/getallboats")
  }

  getOne(id: number) {
    return this.http.get('/api/boattrip/getoneboat/' + id);
  }

  save(boat: Boat) {
    return this.http.post('/api/boattrip/saveboat/', boat);
  }

  edit(boat: Boat) {
    return this.http.put('/api/boattrip/editboat/' + boat.id, boat);
  }

  delete(id: number) {
    return this.http.delete('/api/boattrip/deleteboat/' + id);
  }
}
