import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Order } from '../../../models/order';
import { OrderService } from '../../../_services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertBox } from '../alertmodal/alertmodal';
import { Customer } from '../../../models/customer';
import { Route } from '../../../models/route';
import { CustomerService } from '../../../_services/customer.service';
import { RouteService } from '../../../_services/route.service';

@Component({
  templateUrl: 'editorder.html'
})

export class EditOrderComponent {
  form: FormGroup;
  currentOrder: Order;
  customer: Customer;
  theroute: Route;
  routes: Array<Route>
  customers: Array<Customer>

  /* Validation patterns */
  validation = {
    id: [""],
    ticketamount: [0, Validators.compose([Validators.required, Validators.pattern("[1-9]{1}[0-9]{0,3}")])],
    totalprice: [0, Validators.compose([Validators.required, Validators.pattern("[1-9]{1}[0-9]{1,6}")])],
    route: [''],
    customer: ['']
  }

  constructor(private orderService: OrderService, private customerService: CustomerService, private routeService: RouteService, private router: Router, private cookieService: CookieService, private fb: FormBuilder, private route: ActivatedRoute, private modalService: NgbModal) {
    this.form = fb.group(this.validation);
  }

  fetchOrder(id: number) {
    this.orderService.getOne(id).subscribe(order => {
      this.currentOrder = order;
      this.customer = this.customers.find(c => c.email == order.email);
      this.theroute = this.routes.find(r => r.arrivalTerminalName == order.arrivalTerminalName && r.departureTerminalName == order.departureTerminalName && r.departureTime == order.departureTime && r.arrivalTime == order.arrivalTime);

      this.form.patchValue({ id: order.id });
      this.form.patchValue({ ticketamount: order.ticketAmount });
      this.form.patchValue({ totalprice: order.totalPrice });
      this.form.patchValue({ route: this.theroute });
      this.form.patchValue({ customer: this.customer });

    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        /* If authentication error (timeout / not logging) */
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
    editedOrder.departureTime = this.theroute.departureTime;
    editedOrder.arrivalTime = this.theroute.arrivalTime;
    editedOrder.ticketsLeft = this.theroute.ticketsLeft;

    //arrivalterminal
    editedOrder.arrivalTerminalName = this.theroute.arrivalTerminalName;
    editedOrder.arrivalTerminalCity = this.theroute.arrivalTerminalCity;
    editedOrder.arrivalTerminalZipCode = this.theroute.arrivalTerminalZipCode;
    editedOrder.arrivalTerminalStreet = this.theroute.arrivalTerminalStreet;

    //departureterminal
    editedOrder.departureTerminalName = this.theroute.departureTerminalName;
    editedOrder.departureTerminalCity = this.theroute.departureTerminalCity;
    editedOrder.departureTerminalZipCode = this.theroute.departureTerminalZipCode;
    editedOrder.departureTerminalStreet = this.theroute.departureTerminalStreet;

    //boat
    editedOrder.boatName = this.theroute.boatName;
    editedOrder.capacity = this.theroute.capacity;
    editedOrder.ticketPrice = this.theroute.ticketPrice;

    //customer
    editedOrder.firstname = this.customer.firstname;
    editedOrder.lastname = this.customer.lastname;
    editedOrder.phonenr = this.customer.phonenr;
    editedOrder.email = this.customer.email;
    editedOrder.street = this.customer.street;
    editedOrder.city = this.customer.city;
    editedOrder.zipCode = this.customer.zipCode;

    if (this.customers.length > 0 && this.routes.length > 0) {
      this.orderService.edit(editedOrder).subscribe(() => {
        this.router.navigate(['/order']);
      }, (error: HttpErrorResponse) => {
        if (error.status == 401) {
          /* If authentication error (timeout / not logging) */
          const alertRef = this.modalService.open(AlertBox);
          alertRef.componentInstance.body = "Your session timed out, please log in again.";
          alertRef.componentInstance.title = "Session timeout";
          this.cookieService.delete(".AdventureWorks.Session");
          this.router.navigate(['/home']);
        }
      }
      );
    } else if (this.customers.length > 0 && this.routes.length < 1) {
      const alertRef = this.modalService.open(AlertBox);
      alertRef.componentInstance.body = "There are no routes added yet, add some routes before editing orders!";
      alertRef.componentInstance.title = "No routes in database";
    } else if (this.customers.length < 1 && this.routes.length > 0) {
      const alertRef = this.modalService.open(AlertBox);
      alertRef.componentInstance.body = "There are no customers added yet, add some customers before editing orders!";
      alertRef.componentInstance.title = "No customers in database";
    } else {
      const alertRef = this.modalService.open(AlertBox);
      alertRef.componentInstance.body = "There are no customers or routes added yet, add some customers and routes before editing orders!";
      alertRef.componentInstance.title = "No customers or routes in database";
    }
  }

  changeCustomer(event) {
    this.customer = event;
  }

  changeRoute(event) {
    this.theroute = event;
  }

  onSubmit() {
    this.editOrder();
  }

  ngOnInit() {
    this.routeService.getAll().subscribe((routes) => {
      this.routes = routes;
      this.customerService.getAll().subscribe((customers) => {
        this.customers = customers;
        this.route.params.subscribe((params) => {
          this.fetchOrder(params.id);
        }, error => console.log(error)
        );
      });
    });
  }
}
