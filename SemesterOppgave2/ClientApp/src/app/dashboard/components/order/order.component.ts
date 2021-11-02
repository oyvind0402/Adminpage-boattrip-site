import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Route } from '../../../models/order';
import { RouteService } from '../../../_services/order.service';
import { DeleteModal } from '../deletemodal/deletemodal';

@Component({
  templateUrl: 'order.html',
  styleUrls: ['./order.css'],
})

export class OrderComponent {
  orders: Route[] = [];
  deletedOrder: string;

  ngOnInit() {
    this.loadAllOrders();
  }

  constructor(private orderService: RouteService, private router: Router, private modalService: NgbModal) { }
  deleteOrder(id: number) {
    this.orderService.getOne(id).subscribe((order) => {
      this.deletedOrder = order.departureTerminalName + "-" + order.arrivalTerminalName;
      this.showModalAndDelete(id);
    }, error => console.log(error)
    );
  }


  showModalAndDelete(id: number) {
    const modalRef = this.modalService.open(DeleteModal);
    modalRef.componentInstance.info = this.deletedOrder;
    modalRef.result.then(result => {
      if (result == 'Delete') {
        this.orderService.delete(id).subscribe(() => {
          this.loadAllOrders();
        }, error => console.log(error)
        );
      }
      this.router.navigate(['/order'])
    }, error => console.log(error)
    );
  }


  loadAllOrders() {
    this.orderService.getAll().subscribe(order => {
      this.orders = order;
    });
    

  }

}
