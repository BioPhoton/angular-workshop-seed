import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs/Observable';
import {Flight} from '../../core/api/models/flight';
import {controlsDifferent} from '../../core/validators/controlsDifferent.validator';
import {FlightValidators} from '../../core/validators/flight.validator';
import {cityValid, cityValidWithParam} from '../../core/validators/index';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.scss']
})
export class FlightEditComponent implements OnInit {


  flight$: Observable<Flight>;
  editForm: FormGroup;
  initialData: Flight;

  selectOption: { label: string, value: any }[];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private fV: FlightValidators
  ) {
    this.flight$ = this.route.data.pluck('flight');
    this.selectOption = [
      {label: 'option 1', value: '1'},
      {label: 'option 2', value: 2},
      {label: 'option 3', value: 3.21},
      {label: 'option 4', value: true},
      {label: 'option 5', value: [1, 2, 3, 4, 5]},
      {label: 'option 6', value: {a: 1, b: 2, c: 3}},
    ];
  }

  ngOnInit() {

    const val = this.fV.flightValid();
    const val2 = this.fV.flightExisting();

    this.flight$.subscribe((f: Flight) => {
      this.initialData = f;

      this.editForm = this.fb.group({
          id: [f.id, Validators.required, []],
          from: [f.from, [Validators.required, Validators.minLength(3), cityValidWithParam(['asdf', '325'])], []],
          to: [f.to, [cityValid], []],
          date: [f.date, [val], [val2]],
          select1: ['initFormState', [/*sync*/], [/*async*/]]
        },
        {
          validator: controlsDifferent(['from', 'to'])
        });
    })


  }

  displayError(controlName: string, errorName: string): boolean {
    const c = this.editForm.get(controlName);
    return (c.touched || c.dirty) && c.hasError(errorName);
  }

  getErrorRequiredMessage(): string {
    return 'This field is required';
  }

  getErrorMinLengthMessage(controlName: string): string {
    const error = this.editForm.get(controlName).getError('minlength');
    return `The actual length is ${error.actualLength} required length is ${error.requiredLength}`;
  }

  resetFormWithVal() {
    this.editForm.reset(this.initialData);
  }

  resetForm() {
    this.editForm.reset();
  }

  submitForm() {
    if (this.editForm.valid) {
      console.log('SEND TO SERVER');
    } else {
      Object.values(this.editForm.controls)
        .forEach((c: FormControl) => {
          c.markAsTouched();
        });
      console.log('INVALID');
    }
  }

}
