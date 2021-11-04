import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Boat } from '../../../models/Boat';
import { BoatService } from '../../../_services/boat.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertBox } from '../alertmodal/alertmodal';

@Component({
  templateUrl: 'saveboat.html'
})

export class SaveBoatComponent {
  form: FormGroup;

  /*Validation patterns*/
  validation = {
    id: [""],
    boatName: [
      '', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,20}")])
    ],
    capacity: [
      0, Validators.compose([Validators.required, Validators.pattern("([1-9]{1}[0-9]{1,4})")])
    ],
    ticketPrice: [
      0, Validators.compose([Validators.required, Validators.pattern("([1-9]{1}[0-9]{1,3})")])
    ],
  }


  constructor(private boatService: BoatService, private router: Router, private fb: FormBuilder, private cookieService: CookieService, private modalService: NgbModal) {
    this.form = fb.group(this.validation);
  }

  saveABoat() {
    const newBoat = new Boat();
    newBoat.boatName = this.form.value.boatName;
    newBoat.capacity = this.form.value.capacity;
    newBoat.ticketPrice = this.form.value.ticketPrice;

    console.log(newBoat);

    this.boatService.save(newBoat).subscribe(() => {
      this.router.navigate(['/boat']);
    }, (error: HttpErrorResponse) => {
      /* If authentication error (timeout / not logging) */
      if (error.status == 401) {
        const alertRef = this.modalService.open(AlertBox);
        alertRef.componentInstance.body = "Your session timed out, please log in again.";
        alertRef.componentInstance.title = "Session timeout";
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    );
  }

  onSubmit() {
    this.saveABoat();
  }
}
