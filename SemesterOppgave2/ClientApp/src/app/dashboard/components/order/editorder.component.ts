import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Order } from '../../../models/Order';
import { OrderService } from '../../../_services/order.service';

@Component({
  templateUrl: 'editorder.html'
})

export class EditOrderComponent {
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
  }



  constructor(private orderService: OrderService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute) {
    this.form = fb.group(this.validation);
  }

  fetchOrder(id: number) {
    this.orderService.getOne(id).subscribe(order => {
      this.form.patchValue({ id: order.id });

      //order
      this.form.patchValue({ ticketamount: order.ticketAmount });
      this.form.patchValue({ totalpris: order.totalPrice });

      //route
      this.form.patchValue({ departuretime: order.departureTime });
      this.form.patchValue({ arrivaltime: order.arrivalTime });
      this.form.patchValue({ ticketsleft: order.ticketsLeft });

      //arrivalterminal
      this.form.patchValue({ arrivalterminalname: order.arrivalTerminalName });
      this.form.patchValue({ arrivalterminalcity: order.arrivalTerminalCity });
      this.form.patchValue({ arrivalterminalzipcode: order.arrivalTerminalZipcode });
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
    }, error => console.log(error)
    );

  }

  editOrder() {
    
    const editedOrder = new Order();
    //order
    editedOrder.ticketAmount = this.form.value.ticketamount;
    editedOrder.totalPrice = this.form.value.totalprice;

    //route
    editedOrder.departureTime = this.form.value.departuretime;
    editedOrder.arrivalTime = this.form.value.arrivaltime;
    editedOrder.ticketsLeft = this.form.value.ticketsleft;

    //arrivalterminal
    editedOrder.arrivalTerminalName = this.form.value.arrivalterminalname;
    editedOrder.arrivalTerminalCity = this.form.value.arrivalterminalcity;
    editedOrder.arrivalTerminalZipcode = this.form.value.arrivalterminalzipcode;
    editedOrder.arrivalTerminalStreet = this.form.value.arrivalterminalstreet;

    //departureterminal
    editedOrder.departureTerminalName = this.form.value.departureterminalname;
    editedOrder.departureTerminalCity = this.form.value.departureterminalcity;
    editedOrder.departureTerminalZipCode = this.form.value.departureterminalzipcode;
    editedOrder.departureTerminalStreet = this.form.value.departureterminalstreet;

    //boat
    editedOrder.boatName = this.form.value.boatName;
    editedOrder.capacity = this.form.value.capacity;
    editedOrder.ticketPrice = this.form.value.ticketPrice;

    //customer
    editedOrder.firstname = this.form.value.firstname;
    editedOrder.lastname = this.form.value.lastname;
    editedOrder.phonenr = this.form.value.phonenr;
    editedOrder.email = this.form.value.email;
    editedOrder.street = this.form.value.street;
    editedOrder.city = this.form.value.city;

    console.log(editedOrder);

    this.orderService.edit(editedOrder).subscribe(() => {
      this.router.navigate(['/order']);
    }, error => console.log(error)
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
