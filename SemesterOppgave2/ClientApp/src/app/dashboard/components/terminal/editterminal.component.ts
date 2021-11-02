import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Terminal } from '../../../models/terminal';
import { TerminalService } from '../../../_services/terminal.service';

@Component({
  templateUrl: 'editterminal.html'
})

export class EditTerminalComponent {
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

  constructor(private terminalService: TerminalService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private modalService: NgbModal) {
    this.form = fb.group(this.validation);
  }

  fetchTerminal(id: number) {
    this.terminalService.getOne(id).subscribe((terminal) => {
      this.form.patchValue({ id: terminal.id });
      this.form.patchValue({ terminalName: terminal.terminalName });
      this.form.patchValue({ street: terminal.street });
      this.form.patchValue({ city: terminal.city });
      this.form.patchValue({ zipCode: terminal.zipCode });
      console.log(terminal);
    }, error => console.log(error)
    );
  }

  editTerminal() {
    const editedTerminal = new Terminal();
    editedTerminal.id = this.form.value.id;
    editedTerminal.street = this.form.value.street;
    editedTerminal.terminalName = this.form.value.terminalName;
    editedTerminal.city = this.form.value.city;
    editedTerminal.zipCode = this.form.value.zipCode;
    console.log(editedTerminal);

    this.terminalService.edit(editedTerminal).subscribe(() => {
      this.router.navigate(['/terminal']);
    }, error => console.log(error)
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