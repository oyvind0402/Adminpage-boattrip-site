import { Component, OnInit } from '@angular/core';
import { PostPlace } from '../../../models/postPlace';
import { PostPlaceService } from '../../../_services/postPlace.service';


@Component({
  templateUrl: 'postplace.html'
})

export class PostPlaceComponent {
  postplaces: PostPlace[] = [];

  ngOnInit() {
    this.loadAllPostPlaces();
  }


  constructor(private postPlaceService: PostPlaceService) {

  }
  delete(id: number) {
    this.postPlaceService.delete(id).subscribe(() => { this.loadAllPostPlaces() });
  }


  loadAllPostPlaces() {
    this.postPlaceService.getAll().subscribe(postplace => {
      this.postplaces = postplace;
      console.log(this.postplaces);
    });
    

  }

}
