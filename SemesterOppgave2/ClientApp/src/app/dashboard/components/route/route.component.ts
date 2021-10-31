import { Component, OnInit } from '@angular/core';
import { Route } from '../../../models/route';
import { RouteService } from '../../../_services/route.service';



@Component({
  templateUrl: 'route.html'
})

export class RouteComponent {
  routes: Route[] = [];

  ngOnInit() {

    this.loadAllRoutes();
  }


  constructor(private routeService: RouteService) {

  }
  delete(id: number) {
    this.routeService.delete(id).subscribe(() => { this.loadAllRoutes() });
  }


  loadAllRoutes() {
    this.routeService.getAll().subscribe(route => { this.routes = route; });
    console.log(this.routes); 

  }

}
