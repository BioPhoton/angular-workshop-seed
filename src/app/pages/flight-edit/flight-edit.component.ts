import {Component, OnDestroy} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {FlightResource} from "../../core/api/resources/flight.resource";
import {map, share, shareReplay, switchMap} from "rxjs/operators";
import {RxState} from "@rx-angular/state";
import {Flight} from "../../core/api/models/flight";

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.scss'],
  providers: [RxState]
})
export class FlightEditComponent {


  editForm: FormGroup = this.fb.group({
    from: [42, [], []],
    to: ['', {asyncValidators: [isBlacklistedEmail()], updateOn: 'blur'}],
    date: [],
  }, {
    validators: [isEqual(['from', 'to'])]
  });

  // npm i @rx-angular/state -S

  id$ = this.s.select('id');
  flightFromUrl$ = this.s.select('flight');

  constructor(private fb: FormBuilder,
              private fr: FlightResource,
              private route: ActivatedRoute,
              private s: RxState<{flight: Flight, id: string}>) {

      this.s.connect('id', this.route.params.pipe(map(p => p.idodaso)))
      this.s.connect('flight', this.id$.pipe(switchMap(id => this.fr.findById(id))));

      this.s.hold(this.flightFromUrl$, f => this.editForm.patchValue(f));

  }

  submit() {
    console.log('submit');
  }

  disable() {
    this.editForm.disabled ? this.editForm.enable() : this.editForm.disable();
  }
}

function isEqual(formControlNames: string[]): ValidatorFn {
  return (group: FormGroup): ValidationErrors | null => {
    return null;
  }
}


function isBlacklistedEmail(): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {

    console.log('isBlacklistedEmail');
    return isBlacklisted(control.value).then(
      (isBlacklisted) => {
        return isBlacklisted ? {
          isBlacklistedEmail: {
            actualPlanet: control.value
          }
        } : null;
      }
    );

  }
}


const isBlacklisted = (email: string) => new Promise((res, rej) => {
  setTimeout(() => {
    res(Math.random() < 0.5 ? true : false);
  }, 2000)
})
