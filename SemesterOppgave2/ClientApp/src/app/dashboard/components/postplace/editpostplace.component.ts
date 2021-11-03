import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { PostPlaceService } from '../../../_services/postPlace.service';
import { error } from 'protractor';
import { PostPlace } from '../../../models/postPlace';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  templateUrl: 'editpostplace.html'
})

export class EditPostplaceComponent {
  form: FormGroup;

  validation = {
    id: [""],
    city: ["", Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \\-]{2,30}")])]
  }

  constructor(private postPlaceService: PostPlaceService, private router: Router, fb: FormBuilder, private route: ActivatedRoute, private cookieService: CookieService) {
    this.form = fb.group(this.validation);
  }

  fetchPostPlace(id: string) {
    this.postPlaceService.getOne(id).subscribe(postplace => {
      this.form.patchValue({ id: postplace.zipCode });
      this.form.patchValue({ city: postplace.city });
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        alert("Your session has timed out. Please log in again");
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    
    );
  }

  editPostplace() {
    const editedPostPlace = new PostPlace();
    editedPostPlace.zipCode = this.form.value.id
    editedPostPlace.city = this.form.value.city

    console.log(editedPostPlace);

    this.postPlaceService.edit(editedPostPlace).subscribe(() => {
      this.router.navigate(['/postplace']); // double check the route
    }, 
    );
  }

  onSubmit() {
    this.editPostplace();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.fetchPostPlace(params.id);
      console.log(params);
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        alert("Your session has timed out. Please log in again");
        this.cookieService.delete(".AdventureWorks.Session");
        this.router.navigate(['/home']);
      }
    }
    );
  }
}
