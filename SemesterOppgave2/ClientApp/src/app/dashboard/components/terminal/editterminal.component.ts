import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { Terminal } from '../../../models/terminal';
import { TerminalService } from '../../../_services/terminal.service';
import { AlertBox } from '../alertmodal/alertmodal';

@Component({
  templateUrl: 'editterminal.html'
})

export class EditTerminalComponent {
  form: FormGroup;
  terminal: Terminal;

  /* Validation patterns */
  validation = {
    id: [""],
    terminalName: [
      '', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅ. \\-]{2,20}")])
    ],
    street: [
      '', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \\-]{2,50}")])
    ]
  }

  constructor(private terminalService: TerminalService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private modalService: NgbModal) {
    this.form = fb.group(this.validation);
  }

  fetchTerminal(id: number) {
    this.terminalService.getOne(id).subscribe((terminal) => {
      this.terminal = terminal;
      this.form.patchValue({ id: terminal.id });
      this.form.patchValue({ terminalName: terminal.terminalName });
      this.form.patchValue({ street: terminal.street });
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

  editTerminal() {
    const editedTerminal = new Terminal();
    editedTerminal.id = this.form.value.id;
    editedTerminal.street = this.form.value.street;
    editedTerminal.terminalName = this.form.value.terminalName;
    /* City & zipcode come from terminal so that foreign key is not handled here */
    editedTerminal.city = this.terminal.city;
    editedTerminal.zipCode = this.terminal.zipCode;

    this.terminalService.edit(editedTerminal).subscribe(() => {
      this.router.navigate(['/terminal']);
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

  onSubmit() {
    this.editTerminal();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.fetchTerminal(params.id);
    }, error => console.log(error)
    );
  }
}
