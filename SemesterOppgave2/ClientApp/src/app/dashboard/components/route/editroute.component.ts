import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Route } from '../../../models/route';
import { RouteService } from '../../../_services/route.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertBox } from '../alertmodal/alertmodal';
import { Boat } from '../../../models/boat';
import { Terminal } from '../../../models/terminal';
import { TerminalService } from '../../../_services/terminal.service';
import { BoatService } from '../../../_services/boat.service';

@Component({
  templateUrl: 'editroute.html'
})

export class EditRouteComponent {
  form: FormGroup;
  currentRoute: Route;
  boat: Boat;
  departureTerminal: Terminal;
  arrivalTerminal: Terminal;
  boats: Array<Boat>;
  terminals: Array<Terminal>;

  /*Validation patterns*/
  validation = {
    id: [""],
    departuretime: ['', Validators.compose([Validators.required, Validators.pattern("[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}")])],
    arrivaltime: ['', Validators.compose([Validators.required, Validators.pattern("[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}")])],
    ticketsleft: [0, Validators.compose([Validators.required, Validators.pattern("[0-9]{1,4}")])],
    boat: [''],
    departureTerminal: [''],
    arrivalTerminal: ['']
  }

  constructor(private routeService: RouteService, private terminalService: TerminalService, private boatService: BoatService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private cookieService: CookieService, private modalService: NgbModal) {
    this.form = fb.group(this.validation);
  }

  fetchRoute(id: number) {
    this.routeService.getOne(id).subscribe(route => {
      this.currentRoute = route;
      this.boat = this.boats.find(b => b.boatName == route.boatName);
      this.arrivalTerminal = this.terminals.find(t => t.terminalName == route.arrivalTerminalName && t.street == route.arrivalTerminalStreet);
      this.departureTerminal = this.terminals.find(t => t.terminalName == route.departureTerminalName && t.street == route.departureTerminalStreet);

      this.form.patchValue({ id: route.id });

      //route
      this.form.patchValue({ departuretime: route.departureTime });
      this.form.patchValue({ arrivaltime: route.arrivalTime });
      this.form.patchValue({ ticketsleft: route.ticketsLeft });

      //arrivalterminal
      this.form.patchValue({ arrivalTerminal: this.arrivalTerminal });
      //departureterminal
      this.form.patchValue({ departureTerminal: this.departureTerminal });
      //boat
      this.form.patchValue({ boat: this.boat });

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

  editRoute() {
    
    const editedRoute = new Route();

    //route
    editedRoute.id = this.form.value.id;
    editedRoute.departureTime = this.form.value.departuretime;
    editedRoute.arrivalTime = this.form.value.arrivaltime;
    editedRoute.ticketsLeft = this.form.value.ticketsleft;

    //arrivalterminal
    editedRoute.arrivalTerminalName = this.arrivalTerminal.terminalName;
    editedRoute.arrivalTerminalCity = this.arrivalTerminal.city;
    editedRoute.arrivalTerminalZipCode = this.arrivalTerminal.zipCode;
    editedRoute.arrivalTerminalStreet = this.arrivalTerminal.street;

    //departureterminal
    editedRoute.departureTerminalName = this.departureTerminal.terminalName;
    editedRoute.departureTerminalCity = this.departureTerminal.city;
    editedRoute.departureTerminalZipCode = this.departureTerminal.zipCode;
    editedRoute.departureTerminalStreet = this.departureTerminal.street;

    //boat
    editedRoute.boatName = this.boat.boatName;
    editedRoute.capacity = this.boat.capacity;
    editedRoute.ticketPrice = this.boat.ticketPrice;

    console.log(editedRoute);

    this.routeService.edit(editedRoute).subscribe(() => {
      this.router.navigate(['/route']);
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

  changeBoat(event) {
    this.boat = event;
  }

  changeArrTerminal(event) {
    this.arrivalTerminal = event;
  }

  changeDepTerminal(event) {
    this.departureTerminal = event;
  }

  onSubmit() {
    this.editRoute();
  }

  ngOnInit() {
    this.terminalService.getAll().subscribe((terminals) => {
      this.terminals = terminals;
      this.boatService.getAll().subscribe((boats) => {
        this.boats = boats;
        this.route.params.subscribe((params) => {
          this.fetchRoute(params.id);
        }, error => console.log(error)
        );
      });
    }, (error: HttpErrorResponse) => {
      /* If authentication error (timeout / not logging) */
      if (error.status == 401) {
        const alertRef = this.modalService.open(AlertBox);
        alertRef.componentInstance.body = "Your session timed out, please log in again.";
        alertRef.componentInstance.title = "Session timeout";
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    });
  }
}
