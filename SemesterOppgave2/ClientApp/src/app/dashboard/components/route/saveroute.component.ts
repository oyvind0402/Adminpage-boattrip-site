import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Route } from '../../../models/route';
import { RouteService } from '../../../_services/route.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertBox } from '../alertmodal/alertmodal';
import { release } from 'os';

@Component({
  templateUrl: 'saveroute.html'
})

export class SaveRouteComponent {
  form: FormGroup;

  /*Validation patterns*/
  validation = {
    //route
    departuretime: ['', Validators.compose([Validators.required, Validators.pattern("[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}")])],
    arrivaltime: ['', Validators.compose([Validators.required, Validators.pattern("[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}")])],
    ticketsleft: [0, Validators.compose([Validators.required, Validators.pattern("[0-9]{1,4}")])],

    //arrivalterminal
    arrivalTerminalName: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,20}")])],
    arrivalTerminalCity: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,20}")])],
    arrivalTerminalZipCode: ['', Validators.compose([Validators.required, Validators.pattern("[1-9][0-9]{4}|[0-9]{4}|[1-9]{1}[0-9]{2}( )[0-9]{2}")])],
    arrivalTerminalStreet: ['', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,30}")])],

    //departureterminal
    departureTerminalName: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,20}")])],
    departureTerminalCity: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,20}")])],
    departureTerminalZipCode: ['', Validators.compose([Validators.required, Validators.pattern("[1-9][0-9]{4}|[0-9]{4}|[1-9]{1}[0-9]{2}( )[0-9]{2}")])],
    departureTerminalStreet: ['', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,30}")])],

    //boat
    boatName: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,20}")])],
    capacity: [0, Validators.compose([Validators.required, Validators.pattern("([1-9]{1}[0-9]{1,4})")])],
    ticketPrice: [0, Validators.compose([Validators.required, Validators.pattern("([1-9]{1}[0-9]{1,3})")])],
  }

  constructor(private orderService: RouteService, private router: Router, private fb: FormBuilder, private cookieService: CookieService, private modalService: NgbModal) {
    this.form = fb.group(this.validation);
  }

  saveOrder() {
    const newRoute = new Route();

    //route
    newRoute.departureTime = this.form.value.departuretime;
    newRoute.arrivalTime = this.form.value.arrivaltime;
    newRoute.ticketsLeft = this.form.value.ticketsleft;

    //arrivalterminal
    newRoute.arrivalTerminalName = this.form.value.arrivalTerminalName;
    newRoute.arrivalTerminalCity = this.form.value.arrivalTerminalCity;
    newRoute.arrivalTerminalZipCode = this.form.value.arrivalTerminalZipCode;
    newRoute.arrivalTerminalStreet = this.form.value.arrivalTerminalStreet;

    //departureterminal
    newRoute.departureTerminalName = this.form.value.departureTerminalName;
    newRoute.departureTerminalCity = this.form.value.departureTerminalCity;
    newRoute.departureTerminalZipCode = this.form.value.departureTerminalZipCode;
    newRoute.departureTerminalStreet = this.form.value.departureTerminalStreet;

    //boat
    newRoute.boatName = this.form.value.boatName;
    newRoute.capacity = this.form.value.capacity;
    newRoute.ticketPrice = this.form.value.ticketPrice;

    const depDate = new Date(this.form.value.departuretime);
    const arrDate = new Date(this.form.value.arrivaltime);

    if (depDate > arrDate) {
      const alertRef = this.modalService.open(AlertBox);
      alertRef.componentInstance.body = "You can't choose an arrivaltime thats before the departuretime!";
      alertRef.componentInstance.title = "Time error";
    } else {
      this.orderService.save(newRoute).subscribe(() => {
        this.router.navigate(['/route']);
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
  }

  onSubmit() {
    this.saveOrder();
  }
}
