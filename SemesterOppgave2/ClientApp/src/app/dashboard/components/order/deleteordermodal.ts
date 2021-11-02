import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: 'deleteordermodal.html'
})
export class OrderModal {
  route: string;
  constructor(public modal: NgbActiveModal) { }
}
