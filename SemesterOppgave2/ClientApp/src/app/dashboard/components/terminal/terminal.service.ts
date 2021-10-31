import { Component, OnInit } from '@angular/core';
import { Terminal } from '../../../models/terminal';
import { TerminalService } from '../../../_services/terminal.service';


@Component({
  templateUrl: 'terminal.html'
})

export class TerminalComponent {
  terminals: Terminal[] = [];

  ngOnInit() {
    this.loadAllTerminals();
  }


  constructor(private terminalService: TerminalService) {

  }
  delete(id: number) {
    this.terminalService.delete(id).subscribe(() => { this.loadAllTerminals() });
  }


  loadAllTerminals() {
    this.terminalService.getAll().subscribe(terminal => {
      this.terminals = terminal;
    });
  }

}
