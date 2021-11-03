import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Order } from '../../../models/order';
import { OrderService } from '../../../_services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertBox } from '../alertmodal/alertmodal';

@Component({
  templateUrl: 'editorder.html'
})

export class EditOrderComponent {
  form: FormGroup;
  currentOrder: Order;

  validation = {
    id: [""],
    ticketamount: [0, Validators.compose([Validators.required, Validators.pattern("[1-9]{1}[0-9]{0,3}")])],
    totalprice: [0, Validators.compose([Validators.required, Validators.pattern("[1-9]{1}[0-9]{1,6}")])],
  }



  constructor(private orderService: OrderService, private router: Router, private cookieService: CookieService, private fb: FormBuilder, private route: ActivatedRoute, private modalService: NgbModal) {
    this.form = fb.group(this.validation);
  }

  fetchOrder(id: number) {
    this.orderService.getOne(id).subscribe(order => {
      this.currentOrder = order;

      this.form.patchValue({ id: order.id });
      this.form.patchValue({ ticketamount: order.ticketAmount });
      this.form.patchValue({ totalprice: order.totalPrice });

    }, (error: HttpErrorResponse) => {
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
    this.editOrder();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.fetchOrder(params.id);
    }, error => console.log(error)
    );
  }
}
