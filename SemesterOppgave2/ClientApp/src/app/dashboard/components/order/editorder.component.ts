import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Order } from '../../../models/order';
import { OrderService } from '../../../_services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  templateUrl: 'editorder.html'
})

export class EditOrderComponent {
  form: FormGroup;
  currentOrder: Order;

  validation = {

    // Order
    id: [""],
    ticketamount: [0, Validators.compose([Validators.required, Validators.pattern("[1-9]{1}[0-9]{0,3}")])],
    totalprice: [0, Validators.compose([Validators.required, Validators.pattern("[1-9]{1}[0-9]{1,6}")])],

    /*
    //route
    departuretime: ['', Validators.compose([Validators.required, Validators.pattern("[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}")])],
    arrivaltime: ['', Validators.compose([Validators.required, Validators.pattern("[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}")])],
    ticketsleft: [0, Validators.compose([Validators.required, Validators.pattern("[0-9]{1,4}")])],


    //arrivalterminal
    arrivalterminalname: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,20}")])],
    arrivalterminalcity: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,20}")])],
    arrivalterminalzipcode: ['', Validators.compose([Validators.required, Validators.pattern("[1-9][0-9]{4}|[0-9]{4}|[1-9]{1}[0-9]{2}( )[0-9]{2}")])],
    arrivalterminalstreet: ['', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,30}")])],

    //departureterminal
    departureterminalname: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,20}")])],
    departureterminalcity: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,20}")])],
    departureterminalzipcode: ['', Validators.compose([Validators.required, Validators.pattern("[1-9][0-9]{4}|[0-9]{4}|[1-9]{1}[0-9]{2}( )[0-9]{2}")])],
    departureterminalstreet: ['', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,30}")])],

    //boat
    boatName: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,20}")])],
    capacity: [ 0, Validators.compose([Validators.required, Validators.pattern("([1-9]{1}[0-9]{1,4})")])],
    ticketPrice: [0, Validators.compose([Validators.required, Validators.pattern("([1-9]{1}[0-9]{1,3})")])],

    //customer
    firstname: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅ. \\-]{2,20}")])],
    lastname: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅ. \\-]{2,30}")])],
    phonenr: ['', Validators.compose([Validators.required, Validators.pattern("(\\+47)?[2-9][0-9]{7}")])],
    email: ['', Validators.compose([Validators.required, Validators.pattern("([\\w\\.\\-]+)@([\\w\\-]+)((\\.(\\w){2,3})+)")])],
    street: ['', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \\-]{2,50}")])],
    zipCode: ['', Validators.compose([Validators.required, Validators.pattern("[1-9][0-9]{4}|[0-9]{4}|[1-9]{1}[0-9]{2}( )[0-9]{2}")])],
    city: ['', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \\-]{2,30}")])]
    */
  }



  constructor(private orderService: OrderService, private router: Router, private cookieService: CookieService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.form = fb.group(this.validation);
  }

  fetchOrder(id: number) {
    this.orderService.getOne(id).subscribe(order => {
      this.currentOrder = order;

      this.form.patchValue({ id: order.id });

      //order
      this.form.patchValue({ ticketamount: order.ticketAmount });
      this.form.patchValue({ totalprice: order.totalPrice });
      /*
      //route
      this.form.patchValue({ departuretime: order.departureTime });
      this.form.patchValue({ arrivaltime: order.arrivalTime });
      this.form.patchValue({ ticketsleft: order.ticketsLeft });

      //arrivalterminal
      this.form.patchValue({ arrivalterminalname: order.arrivalTerminalName });
      this.form.patchValue({ arrivalterminalcity: order.arrivalTerminalCity });
      this.form.patchValue({ arrivalterminalzipcode: order.arrivalTerminalZipCode });
      this.form.patchValue({ arrivalterminalstreet: order.arrivalTerminalStreet });

      //departureterminal
      this.form.patchValue({ departureterminalname: order.departureTerminalName });
      this.form.patchValue({ departureterminalcity: order.departureTerminalCity });
      this.form.patchValue({ departureterminalzipcode: order.departureTerminalZipCode });
      this.form.patchValue({ departureterminalstreet: order.departureTerminalStreet });

      //boat
      this.form.patchValue({ boatName: order.boatName });
      this.form.patchValue({ capacity: order.capacity });
      this.form.patchValue({ ticketPrice: order.ticketPrice });

      //customer
      this.form.patchValue({ firstname: order.firstname });
      this.form.patchValue({ lastname: order.lastname });
      this.form.patchValue({ phonenr: order.phonenr });
      this.form.patchValue({ email: order.email });
      this.form.patchValue({ street: order.street });
      this.form.patchValue({ city: order.city });
      */
    }, (error: HttpErrorResponse) => {
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          alert("Your session timed out, please log in again.");
          this.cookieService.delete(".AdventureWorks.Session");
          this.router.navigate(['/home']);
        }
      }
    }
    );

  }

  editOrder() {
    
    const editedOrder = new Order();

    //order
    editedOrder.id = this.form.value.id;
    editedOrder.ticketAmount = this.form.value.ticketamount;
    editedOrder.totalPrice = this.form.value.totalprice;

    //route
    editedOrder.departureTime = this.currentOrder.departureTime;
    editedOrder.arrivalTime = this.currentOrder.arrivalTime;
    editedOrder.ticketsLeft = this.currentOrder.ticketsLeft;

    //arrivalterminal
    editedOrder.arrivalTerminalName = this.currentOrder.arrivalTerminalName;
    editedOrder.arrivalTerminalCity = this.currentOrder.arrivalTerminalCity;
    editedOrder.arrivalTerminalZipCode = this.currentOrder.arrivalTerminalZipCode;
    editedOrder.arrivalTerminalStreet = this.currentOrder.arrivalTerminalStreet;

    //departureterminal
    editedOrder.departureTerminalName = this.currentOrder.departureTerminalName;
    editedOrder.departureTerminalCity = this.currentOrder.departureTerminalCity;
    editedOrder.departureTerminalZipCode = this.currentOrder.departureTerminalZipCode;
    editedOrder.departureTerminalStreet = this.currentOrder.departureTerminalStreet;

    //boat
    editedOrder.boatName = this.currentOrder.boatName;
    editedOrder.capacity = this.currentOrder.capacity;
    editedOrder.ticketPrice = this.currentOrder.ticketPrice;

    //customer
    editedOrder.firstname = this.currentOrder.firstname;
    editedOrder.lastname = this.currentOrder.lastname;
    editedOrder.phonenr = this.currentOrder.phonenr;
    editedOrder.email = this.currentOrder.email;
    editedOrder.street = this.currentOrder.street;
    editedOrder.city = this.currentOrder.city;
    editedOrder.zipCode = this.currentOrder.zipCode;

    console.log(editedOrder);

    this.orderService.edit(editedOrder).subscribe(() => {
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
    this.editOrder();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.fetchOrder(params.id);
    }, error => console.log(error)
    );
  }
}
