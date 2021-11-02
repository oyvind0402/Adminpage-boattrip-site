import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { PostPlaceService } from '../../../_services/postPlace.service';
import { error } from 'protractor';
import { PostPlace } from '../../../models/postPlace';


@Component({
  templateUrl: 'editpostplace.html'
})

export class EditPostplaceComponent {
  form: FormGroup;

  validation = {
    zipCode: ["", Validators.compose([Validators.required, Validators.pattern("[1-9][0-9]{4}|[0-9]{4}|[1-9]{1}[0-9]{2}( )[0-9]{2}")])],
    city: ["", Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \-]{2,30}")])]
  }

  constructor(private postPlaceService: PostPlaceService, private router: Router, fb: FormBuilder, private route: ActivatedRoute) {
    this.form = fb.group(this.validation);
  }

  fetchPostPlace(id: string) {
    this.postPlaceService.getOne(id).subscribe(postplace => {
      this.form.patchValue({ id: postplace.zipCode });
      this.form.patchValue({ city: postplace.city });
    }, error => console.log(error)
    );
  }

  editOrder() {
    const editedPostPlace = new PostPlace();
    editedPostPlace.city;

    console.log(editedPostPlace);

    this.postPlaceService.edit(editedPostPlace).subscribe(() => {
      this.router.navigate(['/postPlace']); // double check the route
    }, error => console.log(error)
    );
  }

  onSubmit() {
    this.editOrder();
  }

  ngOnInnit() {
    this.route.params.subscribe((params) => {
      this.fetchPostPlace(params.id);
    }, error => console.log(error)
    );
  }
}
