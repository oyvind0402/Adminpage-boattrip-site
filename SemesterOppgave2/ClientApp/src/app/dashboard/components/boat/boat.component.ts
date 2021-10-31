import { Component } from '@angular/core';
import { Boat } from '../../../models/Boat';
import { BoatService } from '../../../_services/boat.service';

@Component({
  templateUrl: 'boat.html'
})

export class BoatComponent {
  boats: Boat[] = [];

  ngOnInit() {

    this.loadAllBoats();
  }


  constructor(private boatService: BoatService) {

  }

  loadAllBoats() {
    this.boatService.getAll().subscribe(boat => {
      this.boats = boat;
      console.log(boat);
    });
    console.log(this.boats); 
  }
}
