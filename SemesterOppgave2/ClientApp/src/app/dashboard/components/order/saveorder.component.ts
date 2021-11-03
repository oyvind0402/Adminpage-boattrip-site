import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Order } from '../../../models/order';
import { OrderService } from '../../../_services/order.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  templateUrl: 'saveorder.html'
})

export class SaveOrderComponent {
  form: FormGroup;

  validation = {

    // Order
    ticketamount: [0, Validators.compose([Validators.required, Validators.pattern("^[1-9]{1}[0-9]{0,3}$")])],
    totalpris: [0, Validators.compose([Validators.required, Validators.pattern("^[1-9]{1}[0-9]{1,6}$")])],

    //route
    departuretime: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}$")])],
    arrivaltime: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}$")])],
    ticketsleft: [0, Validators.compose([Validators.required, Validators.pattern("^[0-9]{1,4}$")])],


    //arrivalterminal
    arrivalterminalname: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-ZøæåØÆÅöÖäÄ. \-]{2,20}$")])],
    arrivalterminalcity: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-ZøæåØÆÅöÖäÄ. \-]{2,20}$")])],
    arrivalterminalzipcode: ['', Validators.compose([Validators.required, Validators.pattern("^[1-9][0-9]{4}|[0-9]{4}|[1-9]{1}[0-9]{2}( )[0-9]{2}$")])],
    arrivalterminalstreet: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9a-zA-ZøæåØÆÅöÖäÄ. \-]{2,30}$")])],

    //departureterminal
    departureterminalname: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-ZøæåØÆÅöÖäÄ. \-]{2,20}$")])],
    departureterminalcity: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-ZøæåØÆÅöÖäÄ. \-]{2,20}$")])],
    departureterminalzipcode: ['', Validators.compose([Validators.required, Validators.pattern("^[1-9][0-9]{4}|[0-9]{4}|[1-9]{1}[0-9]{2}( )[0-9]{2}$")])],
    departureterminalstreet: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9a-zA-ZøæåØÆÅöÖäÄ. \-]{2,30}$")])],

    //boat
    boatName: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,20}")])],
    capacity: [0, Validators.compose([Validators.required, Validators.pattern("([1-9]{1}[0-9]{1,4})")])],
    ticketPrice: [0, Validators.compose([Validators.required, Validators.pattern("([1-9]{1}[0-9]{1,3})")])],

    //customer
    firstname: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅ. \\-]{2,20}")])],
    lastname: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅ. \\-]{2,30}")])],
    phonenr: ['', Validators.compose([Validators.required, Validators.pattern("(\\+47)?[2-9][0-9]{7}")])],
    email: ['', Validators.compose([Validators.required, Validators.pattern("([\\w\\.\\-]+)@([\\w\\-]+)((\\.(\\w){2,3})+)")])],
    street: ['', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \\-]{2,50}")])],
    zipCode: ['', Validators.compose([Validators.required, Validators.pattern("[1-9][0-9]{4}|[0-9]{4}|[1-9]{1}[0-9]{2}( )[0-9]{2}")])],
    city: ['', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \\-]{2,30}")])]
  }


  constructor(private orderService: OrderService, private router: Router, private fb: FormBuilder, private cookieService: CookieService) {
    this.form = fb.group(this.validation);
  }

  saveOrder() {
    const newOrder = new Order();
    //order
    newOrder.ticketAmount = this.form.value.ticketamount;
    newOrder.totalPrice = this.form.value.totalprice;

    //route
    newOrder.departureTime = this.form.value.departuretime;
    newOrder.arrivalTime = this.form.value.arrivaltime;
    newOrder.ticketsLeft = this.form.value.ticketsleft;

    //arrivalterminal
    newOrder.arrivalTerminalName = this.form.value.arrivalterminalname;
    newOrder.arrivalTerminalCity = this.form.value.arrivalterminalcity;
    newOrder.arrivalTerminalZipCode = this.form.value.arrivalterminalzipCode;
    newOrder.arrivalTerminalStreet = this.form.value.arrivalterminalstreet;

    //departureterminal
    newOrder.departureTerminalName = this.form.value.departureterminalname;
    newOrder.departureTerminalCity = this.form.value.departureterminalcity;
    newOrder.departureTerminalZipCode = this.form.value.departureterminalzipcode;
    newOrder.departureTerminalStreet = this.form.value.departureterminalstreet;

    //boat
    newOrder.boatName = this.form.value.boatName;
    newOrder.capacity = this.form.value.capacity;
    newOrder.ticketPrice = this.form.value.ticketPrice;

    //customer
    newOrder.firstname = this.form.value.firstname;
    newOrder.lastname = this.form.value.lastname;
    newOrder.phonenr = this.form.value.phonenr;
    newOrder.email = this.form.value.email;
    newOrder.street = this.form.value.street;
    newOrder.city = this.form.value.city;

    console.log(newOrder);

    this.orderService.save(newOrder).subscribe(() => {
      this.router.navigate(['/order']);
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        alert("Your session timed out, please log in again.");
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    );
  }

  onSubmit() {
    this.saveOrder();
  }
}
