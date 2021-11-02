import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostPlace } from '../../../models/postPlace';
import { PostPlaceService } from '../../../_services/postPlace.service';
import { DeleteModal } from '../deletemodal/deletemodal';


@Component({
  templateUrl: 'postplace.html',
  styleUrls: ['postplace.css'],
})

export class PostPlaceComponent {
  postplaces: PostPlace[] = [];
  deletedPostPlace: string;

  ngOnInit() {
    this.loadAllPostPlaces();
  }


  constructor(private postPlaceService: PostPlaceService, private router: Router, private modalService: NgbModal) {

  }

  deletePostPlace(id: string) {
    this.postPlaceService.getOne(id).subscribe((postplace) => {
      this.deletedPostPlace = postplace.zipCode + " " + postplace.city;
      this.showModalAndDelete(id);
    }, error => console.log(error)
    );
  }

  showModalAndDelete(id: string) {
    const modalRef = this.modalService.open(DeleteModal);
    modalRef.componentInstance.info = this.deletedPostPlace;
    modalRef.result.then(result => {
      if (result == 'Delete') {
        this.postPlaceService.delete(id).subscribe(() => {
          this.loadAllPostPlaces();
        }, error => console.log(error)
        );
      }
      this.router.navigate(['/postplace']);
    }, error => console.log(error)
    );
  }


  loadAllPostPlaces() {
    this.postPlaceService.getAll().subscribe(postplace => {
      this.postplaces = postplace;
      console.log(this.postplaces);
    });
    

  }

}
