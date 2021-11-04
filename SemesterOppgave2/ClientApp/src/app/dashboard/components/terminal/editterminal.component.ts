import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { PostPlace } from '../../../models/postPlace';
import { Terminal } from '../../../models/terminal';
import { PostPlaceService } from '../../../_services/postPlace.service';
import { TerminalService } from '../../../_services/terminal.service';
import { AlertBox } from '../alertmodal/alertmodal';

@Component({
  templateUrl: 'editterminal.html'
})

export class EditTerminalComponent {
  form: FormGroup;
  terminal: Terminal;
  postplaces: Array<PostPlace>;
  postplacechosen: PostPlace;

  /* Validation patterns */
  validation = {
    id: [""],
    terminalName: [
      '', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅ. \\-]{2,20}")])
    ],
    street: [
      '', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \\-]{2,50}")])
    ],
    postplace: ['']
  }

  constructor(private terminalService: TerminalService, private postPlaceService: PostPlaceService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private modalService: NgbModal) {
    this.form = fb.group(this.validation);
  }

  fetchTerminal(id: number) {
    this.terminalService.getOne(id).subscribe((terminal) => {
      this.postplacechosen = this.postplaces.find(p => p.zipCode == terminal.zipCode);
      this.terminal = terminal;
      this.form.patchValue({ id: terminal.id });
      this.form.patchValue({ terminalName: terminal.terminalName });
      this.form.patchValue({ street: terminal.street });
      this.form.patchValue({ postplace: this.postplacechosen });
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
    editedTerminal.city = this.postplacechosen.city;
    editedTerminal.zipCode = this.postplacechosen.zipCode;

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

  changePostplace(event) {
    this.postplacechosen = event;
  }

  onSubmit() {
    this.editTerminal();
  }

  ngOnInit() {
    this.postPlaceService.getAll().subscribe((postplaces) => {
      this.postplaces = postplaces;
      this.route.params.subscribe((params) => {
        this.fetchTerminal(params.id);
      }, error => console.log(error)
      );
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
