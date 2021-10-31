import { Component, OnInit } from '@angular/core';
import { Order } from '../../../models/order';
import { OrderService } from '../../../_services/order.service';


@Component({
  templateUrl: 'order.html'
})

export class OrderComponent {
  orders: Order[] = [];

  ngOnInit() {
    this.loadAllOrders();
  }


  constructor(private orderService: OrderService) { }


  loadAllOrders() {
    this.orderService.getAll().subscribe(order => {
      this.orders = order;
      console.log(order);
    });
    

  }

}
