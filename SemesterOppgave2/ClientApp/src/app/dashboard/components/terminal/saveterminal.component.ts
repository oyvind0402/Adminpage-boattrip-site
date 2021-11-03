import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { Terminal } from '../../../models/terminal';
import { TerminalService } from '../../../_services/terminal.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  templateUrl: 'saveterminal.html'
})

export class SaveTerminalComponent {
  form: FormGroup;

  validation = {
    id: [""],
    terminalName: [
      '', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅ. \\-]{2,20}")])
    ],
    street: [
      '', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \\-]{2,50}")])
    ],
    city: [
      '', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \\-]{2,30}")])
    ],
    zipCode: [
      '', Validators.compose([Validators.required, Validators.pattern("[1-9][0-9]{4}|[0-9]{4}|[1-9]{1}[0-9]{2}( )[0-9]{2}")])
    ]
  }

  constructor(private terminalService: TerminalService, private fb: FormBuilder, private router: Router, private cookieService: CookieService) {
    this.form = fb.group(this.validation);
  }

  saveTerminal() {
    const newTerminal = new Terminal();
    newTerminal.street = this.form.value.street;
    newTerminal.terminalName = this.form.value.terminalName;
    newTerminal.city = this.form.value.city;
    newTerminal.zipCode = this.form.value.zipCode;
    console.log(newTerminal);

    this.terminalService.save(newTerminal).subscribe(() => {
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

  onSubmit() {
    this.saveTerminal();
  }

  ngOnInit() {
    
  }
}
