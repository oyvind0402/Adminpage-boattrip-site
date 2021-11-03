import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { Order } from '../../../models/order';
import { OrderService } from '../../../_services/order.service';
import { DeleteModal } from '../deletemodal/deletemodal';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  templateUrl: 'order.html',
  styleUrls: ['./order.css'],
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
      if (error.status == 401) {
        alert("Your session timed out, please log in again.");
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    );
  }


  showModalAndDelete(id: number) {
    const modalRef = this.modalService.open(DeleteModal);
    modalRef.componentInstance.info = this.deletedOrder;
    modalRef.result.then(result => {
      if (result == 'Delete') {
        this.orderService.delete(id).subscribe(() => {
          this.loadAllOrders();
        }, (error: HttpErrorResponse) => {
          if (error.status == 401) {
            alert("Your session timed out, please log in again.");
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


  loadAllOrders() {
    this.orderService.getAll().subscribe(order => {
      this.orders = order;
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        alert("Your session timed out, please log in again.");
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    );
  }

}
