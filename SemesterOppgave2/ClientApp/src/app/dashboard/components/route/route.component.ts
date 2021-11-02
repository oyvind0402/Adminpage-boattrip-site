import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Route } from '../../../models/route';
import { RouteService } from '../../../_services/route.service';
import { DeleteModal } from '../deletemodal/deletemodal';


@Component({
  templateUrl: 'route.html',
  styleUrls: ['route.css'],
})

export class RouteComponent {
  routes: Route[] = [];
  deletedRoute: string;

  ngOnInit() {
    this.loadAllRoutes();
  }


  constructor(private routeService: RouteService, private modalService: NgbModal, private router: Router) {

  }

  deleteRoute(id: number) {
    this.routeService.getOne(id).subscribe((route) => {
      this.deletedRoute = route.boatName + ": from " + route.arrivalTerminalName + "-" + route.departureTerminalName;
      this.showModalAndDelete(id);
    }, error => console.log(error)
    );
  }

  showModalAndDelete(id: number) {
    const modalRef = this.modalService.open(DeleteModal);
    modalRef.componentInstance.info = this.deletedRoute;
    modalRef.result.then(result => {
      if (result == 'Delete') {
        this.routeService.delete(id).subscribe(() => {
          this.loadAllRoutes();
        }, error => console.log(error)
        );
      }
      this.router.navigate(['/route']);
    });
  }


  loadAllRoutes() {
    this.routeService.getAll().subscribe(route => { this.routes = route; });
    console.log(this.routes); 

  }

}
