import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Terminal } from '../../../models/terminal';
import { TerminalService } from '../../../_services/terminal.service';
import { DeleteModal } from '../deletemodal/deletemodal';


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


  constructor(private terminalService: TerminalService, private modalService: NgbModal, private router: Router) {

  }

  deleteTerminal(id: number) {
    this.terminalService.getOne(id).subscribe((terminal) => {
      this.deletedTerminal = terminal.street + ", " + terminal.zipCode + " " + terminal.city;
      this.showModalAndDelete(id);
    }, error => console.log(error)
    );
  }

  showModalAndDelete(id: number) {
    const modalRef = this.modalService.open(DeleteModal);
    modalRef.componentInstance.info = this.deletedTerminal;
    modalRef.result.then(result => {
      if (result == 'Delete') {
        this.terminalService.delete(id).subscribe(() => {
          this.loadAllTerminals();
        }, error => console.log(error)
        );
      }
      this.router.navigate(['/terminal']);
    });
  }


  loadAllTerminals() {
    this.terminalService.getAll().subscribe(terminal => {
      this.terminals = terminal;
    });
  }

}
