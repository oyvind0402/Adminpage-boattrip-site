import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Terminal } from '../models/terminal';


@Injectable()
export class TerminalService {
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<Terminal[]>("api/boattrip/getallterminals")
  }

  getOne(id: number) {
    return this.http.get<Terminal>('/api/boattrip/getoneterminal/' + id);
  }

  save(terminal: Terminal) {
    return this.http.post('/api/boattrip/saveterminal/', terminal, { responseType: 'text' });
  }

  edit(terminal: Terminal) {
    return this.http.put('/api/boattrip/editterminal/', terminal, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete('/api/boattrip/deleteterminal/' + id, { responseType: 'text' });
  }
}
