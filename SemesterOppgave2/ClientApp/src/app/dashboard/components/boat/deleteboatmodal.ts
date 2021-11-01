import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: 'deleteboatmodal.html'
})
export class BoatModal {
  boatName: string;
  constructor(public modal: NgbActiveModal) { }
}
