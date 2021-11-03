import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Boat } from '../../../models/Boat';
import { BoatService } from '../../../_services/boat.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { DeleteModal } from '../deletemodal/deletemodal';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  templateUrl: 'boat.html',
  styleUrls: ['boat.css'],
})

export class BoatComponent {
  boats: Array<Boat>;
  deletedBoat: string;

  ngOnInit() {
    this.loadAllBoats();
  }


  constructor(private boatService: BoatService, private router: Router, private modalService: NgbModal) {

  }

  deleteBoat(id: number) {
    this.boatService.getOne(id).subscribe((boat) => {
      this.deletedBoat = boat.boatName;
      this.showModalAndDelete(id);
    }, error => console.log(error)
    );
  }

  showModalAndDelete(id: number) {
    const modalRef = this.modalService.open(DeleteModal);
    modalRef.componentInstance.info = this.deletedBoat;
    modalRef.result.then(result => {
      if (result == 'Delete') {
        this.boatService.delete(id).subscribe(() => {
          this.loadAllBoats();
        }, (error: HttpErrorResponse) => {
          if (error.status == 404) {
            alert("Couldn't delete that boat, it's a part of another table (route) as a foreign key! Delete all the routes containing this boat first to be able to delete this boat!");
          }
        });
      }
      this.router.navigate(['/boat']);
    }, error => console.log(error)
    );
  }

  loadAllBoats() {
    this.boatService.getAll().subscribe(boat => {
      this.boats = boat;
    });
    console.log(this.boats); 
  }
}
