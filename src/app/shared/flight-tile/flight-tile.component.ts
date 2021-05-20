import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Flight} from "../../core/api/models/flight";
import {Router} from "@angular/router";

@Component({
  selector: 'app-flight-tile',
  template: `
  <h1>Flight ID {{flight.id}}</h1>
  <h2>From: {{flight.from}}</h2><h2>To: {{flight.to}}</h2>
  <p>Date {{flight.date | date}}</p>
  <button
    (click)="selectChange.emit(flight.id)"
  >{{selected ? 'Deselect': 'Select'}}</button>
  <button (click)="navigateToEdit()">edit</button>
  `
})
export class FlightTileComponent {

  @Input()
  flight: Flight;

  @Input()
  selected: boolean;

  @Output()
  selectChange = new EventEmitter<string>()

  constructor(private router: Router) {

  }

  navigateToEdit() {
    this.router.navigate(['flights',this.flight.id,'edit']);
  }

}
