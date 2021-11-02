import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: 'deletemodal.html'
})
export class DeleteModal {
  info: string;
  constructor(public modal: NgbActiveModal) { }
}
