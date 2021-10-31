import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostPlace } from '../models/postPlace';


@Injectable()
export class PostPlaceService {
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<PostPlace[]>("api/boattrip/getallpostplaces")
  }

  getOne(id: number) {
    return this.http.get('/api/boattrip/getonepostplace/' + id);
  }

  save(postPlace: PostPlace) {
    return this.http.post('/api/boattrip/savepostplace/', postPlace);
  }

  edit(postPlace: PostPlace) {
    return this.http.put('/api/boattrip/editpostplace/' + postPlace.zipCode, postPlace);
  }

  delete(id: number) {
    return this.http.delete('/api/boattrip/deletepostplace/' + id);
  }
}
