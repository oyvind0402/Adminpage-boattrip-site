import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: 'deletecustomermodal.html'
})
export class CustomerModal {
  name: string;
  constructor(public modal: NgbActiveModal) { }
}
