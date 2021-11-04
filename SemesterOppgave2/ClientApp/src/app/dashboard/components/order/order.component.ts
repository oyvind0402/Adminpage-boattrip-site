import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { Order } from '../../../models/order';
import { OrderService } from '../../../_services/order.service';
import { DeleteModal } from '../deletemodal/deletemodal';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertBox } from '../alertmodal/alertmodal';

@Component({
  templateUrl: 'order.html',
  styleUrls: ['../dblists.css'],
})

export class OrderComponent {
  orders: Order[] = [];
  deletedOrder: string;

  ngOnInit() {
    this.loadAllOrders();
  }

  constructor(private cookieService: CookieService, private orderService: OrderService, private router: Router, private modalService: NgbModal) { }
  deleteOrder(id: number) {
    this.orderService.getOne(id).subscribe((order) => {
      this.deletedOrder = order.departureTerminalName + "-" + order.arrivalTerminalName;
      this.showModalAndDelete(id);
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

  /*Handles deletion, includes confirmation modal*/
  showModalAndDelete(id: number) {
    const modalRef = this.modalService.open(DeleteModal);
    modalRef.componentInstance.info = this.deletedOrder;
    modalRef.result.then(result => {
      if (result == 'Delete') {
        this.orderService.delete(id).subscribe(() => {
          this.loadAllOrders();
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
      this.router.navigate(['/order'])
    }, error => console.log(error)
    );
  }

  /*Get all orders*/
  loadAllOrders() {
    this.orderService.getAll().subscribe(order => {
      this.orders = order;
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
