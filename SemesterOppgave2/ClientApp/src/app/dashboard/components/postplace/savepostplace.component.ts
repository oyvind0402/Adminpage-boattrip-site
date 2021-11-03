import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { PostPlaceService } from '../../../_services/postPlace.service';
import { PostPlace } from '../../../models/postPlace';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  templateUrl: 'savepostplace.html'
})

export class SavePostPlaceComponent {
  form: FormGroup;

  validation = {
    zipcode: ["", Validators.compose([Validators.required, Validators.pattern("[1-9][0-9]{4}|[0-9]{4}|[1-9]{1}[0-9]{2}( )[0-9]{2}")])],
    city: ["", Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \\-]{2,30}")])]
  }

  constructor(private postPlaceService: PostPlaceService, private router: Router, fb: FormBuilder, private route: ActivatedRoute) {
    this.form = fb.group(this.validation);
  }

  savePostPlace() {
    const newPostPlace = new PostPlace();
    newPostPlace.zipCode = this.form.value.zipcode
    newPostPlace.city = this.form.value.city
    console.log(newPostPlace);

    this.postPlaceService.save(newPostPlace).subscribe(() => {
      this.router.navigate(['/postplace']);
    }, (error: HttpErrorResponse) => {
      if (error.status == 400) {
        alert("Couldn't save that postplace, there's a postplace with the same ZipCode that already exists!");
      }
    });
  }

  onSubmit() {
    this.savePostPlace();
  }
}
