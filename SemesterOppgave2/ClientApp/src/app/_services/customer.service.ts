import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Customer } from '../models/customer';

@Injectable()
export class CustomerService {
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<Customer[]>("api/boattrip/getallcustomers")
  }
}
