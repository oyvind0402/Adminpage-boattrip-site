import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Boat } from '../../../models/Boat';
import { BoatService } from '../../../_services/boat.service';

@Component({
  templateUrl: 'editboat.html'
})

export class EditBoatComponent {
  form: FormGroup;

  validation = {
    id: [""],
    boatName: [
      '', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅöÖäÄ. \\-]{2,20}")])
    ],
    capacity: [
      0, Validators.compose([Validators.required, Validators.pattern("([1-9]{1}[0-9]{1,4})")])
    ],
    ticketPrice: [
      0, Validators.compose([Validators.required, Validators.pattern("([1-9]{1}[0-9]{1,3})")])
    ],
  }


  constructor(private boatService: BoatService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute) {
    this.form = fb.group(this.validation);
  }

  fetchBoat(id: number) {
    this.boatService.getOne(id).subscribe(boat => {
      this.form.patchValue({ id: boat.id });
      this.form.patchValue({ boatName: boat.boatName });
      this.form.patchValue({ capacity: boat.capacity });
      this.form.patchValue({ ticketPrice: boat.ticketPrice });
    }, error => console.log(error)
    );
  }

  editABoat() {
    const editedBoat = new Boat();
    editedBoat.id = this.form.value.id;
    editedBoat.boatName = this.form.value.boatName;
    editedBoat.capacity = this.form.value.capacity;
    editedBoat.ticketPrice = this.form.value.ticketPrice;

    this.boatService.edit(editedBoat).subscribe(() => {
      this.router.navigate(['/boat']);
    }, error => console.log(error)
    );
  }

  onSubmit() {
    this.editABoat();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.fetchBoat(params.id);
    }, error => console.log(error)
    );
  }
}
