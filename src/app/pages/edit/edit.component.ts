import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FlightResource} from "../../core/api/resources/flight.resource";
import {combineLatest, of, Subscription} from "rxjs";
import {map, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-edit',
  template: ``
})
export class EditComponent {

  constructor(
    private route: ActivatedRoute,
    private fr: FlightResource
  ) {

  }

}
