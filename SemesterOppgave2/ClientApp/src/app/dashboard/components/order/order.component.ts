import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Order } from '../../../models/order';
import { OrderService } from '../../../_services/order.service';
import { OrderModal } from './deleteordermodal';



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

  constructor(private orderService: OrderService, private router: Router, private modalService: NgbModal) { }
  deleteOrder(id: number) {
    this.orderService.getOne(id).subscribe((order) => {
      this.deletedOrder = order.departureTerminalName + "-" + order.arrivalTerminalName;
      this.showModalAndDelete(id);
    }, error => console.log(error)
    );
  }


  showModalAndDelete(id: number) {
    const modalRef = this.modalService.open(OrderModal);
    modalRef.componentInstance.name = this.deletedOrder;
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
