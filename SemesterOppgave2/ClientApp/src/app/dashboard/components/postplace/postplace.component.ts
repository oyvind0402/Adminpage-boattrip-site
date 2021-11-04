import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { PostPlace } from '../../../models/postPlace';
import { PostPlaceService } from '../../../_services/postPlace.service';
import { AlertBox } from '../alertmodal/alertmodal';
import { DeleteModal } from '../deletemodal/deletemodal';


@Component({
  templateUrl: 'postplace.html',
  styleUrls: ['../dblists.css'],
})

export class PostPlaceComponent {
  postplaces: PostPlace[] = [];
  deletedPostPlace: string;

  ngOnInit() {
    this.loadAllPostPlaces();
  }


  constructor(private postPlaceService: PostPlaceService, private router: Router, private modalService: NgbModal, private cookieService : CookieService) {

  }

  deletePostPlace(id: string) {
    this.postPlaceService.getOne(id).subscribe((postplace) => {
      this.deletedPostPlace = postplace.zipCode + " " + postplace.city;
      this.showModalAndDelete(id);
    }, (error: HttpErrorResponse) => {
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

  showModalAndDelete(id: string) {
    const modalRef = this.modalService.open(DeleteModal);
    modalRef.componentInstance.info = this.deletedPostPlace;
    modalRef.result.then(result => {
      if (result == 'Delete') {
        this.postPlaceService.delete(id).subscribe(() => {
          this.loadAllPostPlaces();
        }, (error: HttpErrorResponse) => {
          if (error.status == 404) {
            const alertRef = this.modalService.open(AlertBox);
            alertRef.componentInstance.body = "Couldn't delete that postplace, it's a part of another table (customer or terminal) as a foreign key! Delete all the entries containing this postplace first to be able to delete this postplace!";
            alertRef.componentInstance.title = "Deletion not valid";
          }
          if (error.status == 401) {
            const alertRef = this.modalService.open(AlertBox);
            alertRef.componentInstance.body = "Your session timed out, please log in again.";
            alertRef.componentInstance.title = "Session timeout";
            this.cookieService.delete(".AdventureWorks.Session");
            this.router.navigate(['/home']);
          }
        });
      }
      this.router.navigate(['/postplace']);
    }, error => console.log(error)
    );
  }


  loadAllPostPlaces() {
    this.postPlaceService.getAll().subscribe(postplace => {
      this.postplaces = postplace;
    }, (error: HttpErrorResponse) => {
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
