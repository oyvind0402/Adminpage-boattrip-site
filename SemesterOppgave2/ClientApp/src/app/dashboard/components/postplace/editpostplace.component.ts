import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { PostPlaceService } from '../../../_services/postPlace.service';
import { error } from 'protractor';
import { PostPlace } from '../../../models/postPlace';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertBox } from '../alertmodal/alertmodal';


@Component({
  templateUrl: 'editpostplace.html'
})

export class EditPostplaceComponent {
  form: FormGroup;

  /* Validation patterns */
  validation = {
    id: [""],
    city: ["", Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \\-]{2,30}")])]
  }

  constructor(private postPlaceService: PostPlaceService, private router: Router, fb: FormBuilder, private route: ActivatedRoute, private cookieService: CookieService, private modalService: NgbModal) {
    this.form = fb.group(this.validation);
  }

  fetchPostPlace(id: string) {
    this.postPlaceService.getOne(id).subscribe(postplace => {
      this.form.patchValue({ id: postplace.zipCode });
      this.form.patchValue({ city: postplace.city });
    }, (error: HttpErrorResponse) => {
      /* If authentication error (timeout / not logging) */
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

  editPostplace() {
    const editedPostPlace = new PostPlace();
    editedPostPlace.zipCode = this.form.value.id
    editedPostPlace.city = this.form.value.city

    this.postPlaceService.edit(editedPostPlace).subscribe(() => {
      this.router.navigate(['/postplace']); // double check the route
    }, (error: HttpErrorResponse) => {
      /* If authentication error (timeout / not logging) */
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

  onSubmit() {
    this.editPostplace();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.fetchPostPlace(params.id);
    }, (error: HttpErrorResponse) => {
      if (error.status == 401) {
        /* If authentication error (timeout / not logging) */
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
