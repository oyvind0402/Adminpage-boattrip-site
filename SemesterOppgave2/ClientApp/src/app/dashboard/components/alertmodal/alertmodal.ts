import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: 'alertmodal.html',
})
export class AlertBox {
  title: string;
  body: string;
  constructor(public modal: NgbActiveModal) { }
}
