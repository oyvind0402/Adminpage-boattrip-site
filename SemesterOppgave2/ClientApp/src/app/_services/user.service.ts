import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserModel } from '../models/user.model';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<UserModel[]>('/api/users');
  }

  getById(id: number) {
    return this.http.get('/api/users/' + id);
  }

  create(user: UserModel) {
    return this.http.post('/api/users', user);
  }

  update(user: UserModel) {
    return this.http.put('/api/users/' + user.id, user);
  }

  delete(id: number) {
    return this.http.delete('/api/users/' + id);
  }
}
