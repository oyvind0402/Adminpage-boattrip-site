import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Terminal } from '../../../models/terminal';
import { TerminalService } from '../../../_services/terminal.service';
import { DeleteModal } from '../deletemodal/deletemodal';
import { CookieService } from 'ngx-cookie-service';



@Component({
  templateUrl: 'terminal.html',
  styleUrls: ['terminal.css'],
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
    modalRef.componentInstance.info = this.deletedTerminal;
    modalRef.result.then(result => {
      if (result == 'Delete') {
        this.terminalService.delete(id).subscribe(() => {
          this.loadAllTerminals();
        }, (error: HttpErrorResponse) => {
          if (error.status == 404) {
            alert("Couldn't delete that terminal, it's a part of another table (route) as a foreign key! Delete all the routes containing this terminal first to be able to delete this terminal!");
          }
          if (error.status == 401) {
            alert("Your session has timed out. Please log in again");
            this.cookieService.delete(".AdventureWorks.Session");
            this.router.navigate(['/home']);
          }
        });
      }
      this.router.navigate(['/terminal']);
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        alert("Your session has timed out. Please log in again");
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    );
   
  }


  loadAllTerminals() {
    this.terminalService.getAll().subscribe(t => {
      this.terminals = t;
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        alert("Your session has timed out. Please log in again");
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    );
  }
}
