import { Component, Inject, OnDestroy } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FlightResource} from "../../core/api/resources/flight.resource";
import {map, switchMap} from "rxjs/operators";
import {FormBuilder, Validators} from "@angular/forms";
import { PLANE_SERVICE } from '../../shared/plane-selector/plane-selector.component';
import {emailBlacklisted, isDifferent, validPlanet} from "../../shared/validators/custom.validator";
import { SpecialPlanesService } from './special-planes.service';

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
      <h3>Plane Selector:</h3>
      <app-plane-selector>
        <app-airplane
          [plane]="plane"
          *ngFor="let plane of planes$ | async"></app-airplane>
      </app-plane-selector>
    </form>
  `,
  providers: [{
    provide: PLANE_SERVICE,
    useClass: SpecialPlanesService
  }]
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

  readonly planes$ = this.planeService.planes$;

  constructor(
    @Inject(PLANE_SERVICE) private planeService: SpecialPlanesService,
    private route: ActivatedRoute,
    private fr: FlightResource,
    private fb: FormBuilder,
  ) {
    this.sub = this.flight$.subscribe(f => this.form.patchValue(f))
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}

