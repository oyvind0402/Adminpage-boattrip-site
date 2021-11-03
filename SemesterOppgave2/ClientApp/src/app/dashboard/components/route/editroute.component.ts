import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Route } from '../../../models/route';
import { RouteService } from '../../../_services/route.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertBox } from '../alertmodal/alertmodal';

@Component({
  templateUrl: 'editroute.html'
})

export class EditRouteComponent {
  form: FormGroup;
  currentRoute: Route;

  validation = {
    id: [""],
    departuretime: ['', Validators.compose([Validators.required, Validators.pattern("[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}")])],
    arrivaltime: ['', Validators.compose([Validators.required, Validators.pattern("[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}")])],
    ticketsleft: [0, Validators.compose([Validators.required, Validators.pattern("[0-9]{1,4}")])],
  }



  constructor(private routeService: RouteService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private cookieService: CookieService, private modalService: NgbModal) {
    this.form = fb.group(this.validation);
  }

  fetchOrder(id: number) {
    this.routeService.getOne(id).subscribe(route => {
      this.currentRoute = route;

      this.form.patchValue({ id: route.id });

      //route
      this.form.patchValue({ departuretime: route.departureTime });
      this.form.patchValue({ arrivaltime: route.arrivalTime });
      this.form.patchValue({ ticketsleft: route.ticketsLeft });

      
      //arrivalterminal
      this.form.patchValue({ arrivalterminalname: route.arrivalTerminalName });
      this.form.patchValue({ arrivalterminalcity: route.arrivalTerminalCity });
      this.form.patchValue({ arrivalterminalzipcode: route.arrivalTerminalZipCode });
      this.form.patchValue({ arrivalterminalstreet: route.arrivalTerminalStreet });

      //departureterminal
      this.form.patchValue({ departureterminalname: route.departureTerminalName });
      this.form.patchValue({ departureterminalcity: route.departureTerminalCity });
      this.form.patchValue({ departureterminalzipcode: route.departureTerminalZipCode });
      this.form.patchValue({ departureterminalstreet: route.departureTerminalStreet });

      //boat
      this.form.patchValue({ boatName: route.boatName });
      this.form.patchValue({ capacity: route.capacity });
      this.form.patchValue({ ticketPrice: route.ticketPrice });
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
    
    const editedRoute = new Route();

    //route
    editedRoute.id = this.form.value.id;
    editedRoute.departureTime = this.form.value.departuretime;
    editedRoute.arrivalTime = this.form.value.arrivaltime;
    editedRoute.ticketsLeft = this.form.value.ticketsleft;

    //arrivalterminal
    editedRoute.arrivalTerminalName = this.currentRoute.arrivalTerminalName;
    editedRoute.arrivalTerminalCity = this.currentRoute.arrivalTerminalCity;
    editedRoute.arrivalTerminalZipCode = this.currentRoute.arrivalTerminalZipCode;
    editedRoute.arrivalTerminalStreet = this.currentRoute.arrivalTerminalStreet;

    //departureterminal
    editedRoute.departureTerminalName = this.currentRoute.departureTerminalName;
    editedRoute.departureTerminalCity = this.currentRoute.departureTerminalCity;
    editedRoute.departureTerminalZipCode = this.currentRoute.departureTerminalZipCode;
    editedRoute.departureTerminalStreet = this.currentRoute.departureTerminalStreet;

    //boat
    editedRoute.boatName = this.currentRoute.boatName;
    editedRoute.capacity = this.currentRoute.capacity;
    editedRoute.ticketPrice = this.currentRoute.ticketPrice;

    console.log(editedRoute);

    this.routeService.edit(editedRoute).subscribe(() => {
      this.router.navigate(['/route']);
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
