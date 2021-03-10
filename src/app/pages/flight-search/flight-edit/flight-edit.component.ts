import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FlightResource} from "../../../core/api/resources/flight.resource";
import {map, switchMap} from "rxjs/operators";
import {FormBuilder, Validators} from "@angular/forms";
import {emailBlacklisted, isDifferent, validPlanet} from "../../../shared/validators/custom.validator";

@Component({
  selector: 'app-flight-edit',
  template: `
    <h1>Flight {{id$ | async}}</h1>
    <form [formGroup]="form">

      <label for="from">From</label>
      <input type="text" id="from" name="from" formControlName="from">
      <app-counter-control formControlName="num"></app-counter-control>
      <app-form-control-state [control]="form.get('num')"></app-form-control-state>
      <label for="to">To</label>
      <input type="text" id="to" name="to" formControlName="to">

      <label for="date">Date</label>
      <input type="text" id="date" name="date" formControlName="date">
    </form>
  `,
  styleUrls: ['./flight-edit.component.scss']
})
export class FlightEditComponent implements OnDestroy {

  validPlanets = ['Merkur', 'Venus', 'Erde', 'Mars', 'Jupiter', 'Saturn', 'Uranu', 'Neptun', 'Pluto'];
  sub
  id$ = this.route.params.pipe(map((params) => params.id));
  flight$ = this.id$.pipe(switchMap(id => this.fr.findById(id)));
  form = this.fb.group({
    from: ['', [validPlanet(this.validPlanets)], [emailBlacklisted]],
    to: [null, [Validators.required]],
    num: [12],
    date: ['', []],
  }, {
    validators: [isDifferent],
    asyncValidators: [emailBlacklisted]
  });

  constructor(private route: ActivatedRoute,
              private fr: FlightResource,
              private fb: FormBuilder,
  ) {
    this.sub = this.flight$.subscribe(f => this.form.patchValue(f))
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}

