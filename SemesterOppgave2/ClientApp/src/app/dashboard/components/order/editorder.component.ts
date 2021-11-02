import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Order } from '../../../models/Order';
import { OrderService } from '../../../_services/order.service';

@Component({
  templateUrl: 'editorder.html'
})

export class EditOrderComponent {
  form: FormGroup;

  validation = {
    id: [""],
    firstname: [
      '', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅ. \\-]{2,20}")])
    ],
    lastname: [
      '', Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅ. \\-]{2,30}")])
    ],
    phonenr: [
      '', Validators.compose([Validators.required, Validators.pattern("(\\+47)?[2-9][0-9]{7}")])
    ],
    email: [
      '', Validators.compose([Validators.required, Validators.pattern("([\\w\\.\\-]+)@([\\w\\-]+)((\\.(\\w){2,3})+)")])
    ],
    street: [
      '', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \\-]{2,50}")])
    ],
    zipCode: [
      '', Validators.compose([Validators.required, Validators.pattern("[1-9][0-9]{4}|[0-9]{4}|[1-9]{1}[0-9]{2}( )[0-9]{2}")])
    ],
    city: [
      '', Validators.compose([Validators.required, Validators.pattern("[0-9a-zA-ZøæåØÆÅ. \\-]{2,30}")])
    ]
  }


  constructor(private orderService: OrderService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute) {
    this.form = fb.group(this.validation);
  }

  fetchOrder(id: number) {
    this.orderService.getOne(id).subscribe(order => {
      this.form.patchValue({ id: order.id });
      this.form.patchValue({ firstname: order.firstname });
      this.form.patchValue({ lastname: order.lastname });
      this.form.patchValue({ phonenr: order.phonenr });
      this.form.patchValue({ email: order.email });
      this.form.patchValue({ street: order.street });
      this.form.patchValue({ city: order.city });
    }, error => console.log(error)
    );

  }

  editOrder() {
    
    const editedOrder = new Order();
    editedOrder.firstname = this.form.value.firstname;
    editedOrder.lastname = this.form.value.lastname;
    editedOrder.phonenr = this.form.value.phonenr;
    editedOrder.email = this.form.value.email;
    editedOrder.street = this.form.value.street;
    editedOrder.city = this.form.value.city;

    console.log(editedOrder);

    this.orderService.edit(editedOrder).subscribe(() => {
      this.router.navigate(['/order']);
    }, error => console.log(error)
    );
  }

  onSubmit() {
    this.editOrder();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.fetchOrder(params.id);
    }, error => console.log(error)
    );
  }
}
