import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
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


  constructor(private routeService: RouteService, private modalService: NgbModal, private router: Router, private cookieService : CookieService) {

  }

  deleteRoute(id: number) {
    this.routeService.getOne(id).subscribe((route) => {
      this.deletedRoute = route.boatName + ": from " + route.arrivalTerminalName + "-" + route.departureTerminalName;
      this.showModalAndDelete(id);
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        alert("Your session has timed out. Please log in again");
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    );
  }

  showModalAndDelete(id: number) {
    const modalRef = this.modalService.open(DeleteModal);
    modalRef.componentInstance.info = this.deletedRoute;
    modalRef.result.then(result => {
      if (result == 'Delete') {
        this.routeService.delete(id).subscribe(() => {
          this.loadAllRoutes();
        }, (error: HttpErrorResponse) => {
          if (error.status == 404) {
            alert("Couldn't delete that route, it's a part of another table (order) as a foreign key! Delete all the orders containing this route first to be able to delete this route!");
          }
        });
      }
      this.router.navigate(['/route']);
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        alert("Your session has timed out. Please log in again");
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    );
  }


  loadAllRoutes() {
    this.routeService.getAll().subscribe(route => { this.routes = route; });
    console.log(this.routes); 

  }

}
