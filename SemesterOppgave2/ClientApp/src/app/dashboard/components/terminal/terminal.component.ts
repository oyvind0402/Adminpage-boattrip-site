import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Terminal } from '../../../models/terminal';
import { TerminalService } from '../../../_services/terminal.service';
import { DeleteModal } from '../deletemodal/deletemodal';
import { CookieService } from 'ngx-cookie-service';
import { AlertBox } from '../alertmodal/alertmodal';



@Component({
  templateUrl: 'terminal.html',
  styleUrls: ['../dblists.css'],
})

export class TerminalComponent {
  terminals: Terminal[] = [];
  deletedTerminal: string;

  ngOnInit() {
    this.loadAllTerminals();
  }

  constructor(private terminalService: TerminalService, private modalService: NgbModal, private router: Router, private cookieService: CookieService) {
  }

  deleteTerminal(id: number) {
    this.terminalService.getOne(id).subscribe((terminal) => {
      this.deletedTerminal = terminal.street + ", " + terminal.zipCode + " " + terminal.city;
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

  showModalAndDelete(id: number) {
    const modalRef = this.modalService.open(DeleteModal);
    modalRef.componentInstance.info = this.deletedTerminal;
    modalRef.result.then(result => {
      /*If user chooses to delete*/
      if (result == 'Delete') {
        this.terminalService.delete(id).subscribe(() => {
          this.loadAllTerminals();
        }, (error: HttpErrorResponse) => {
          /* If authentication error (timeout / not logging) */
          if (error.status == 404) {
            const alertRef = this.modalService.open(AlertBox);
            alertRef.componentInstance.body = "Couldn't delete that terminal, it's a part of another table (route) as a foreign key! Delete all the routes containing this terminal first to be able to delete this terminal!";
            alertRef.componentInstance.title = "Deletion not valid";
          }
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
      this.router.navigate(['/terminal']);
    }, error => console.log(error)
    );
   
  }


  loadAllTerminals() {
    this.terminalService.getAll().subscribe(t => {
      this.terminals = t;
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
