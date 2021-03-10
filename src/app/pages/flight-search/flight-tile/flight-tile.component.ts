import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Flight} from "../../../core/api/models/flight";

@Component({
  selector: 'app-flight-tile',
  template: `
    <h1>
      {{flight?.from}}-{{flight?.to}}
    </h1>
    <button
      class="btn"
      [ngClass]="{
      'btn-danger': !selected,
      'btn-default': selected
      }"
      (click)="selectedChange.emit(flight.id)">
      {{selected ? 'Deselect' : 'Select'}}
    </button>
    <button
      class="btn btn-outline-info"
      [routerLink]="['/flight/edit', flight.id]">
      Edit
    </button>
  `
})
export class FlightTileComponent {

  @Input()
  flight: Flight

  @Input()
  selected: boolean

  @Output()
  selectedChange = new EventEmitter<string>();

}
