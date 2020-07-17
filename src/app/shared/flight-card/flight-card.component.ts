import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Flight} from "../../core/api/models/flight";

@Component({
  selector: 'app-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.scss']
})
export class FlightCardComponent {

  @Input()
  flight: Flight;

  @Input()
  selected: boolean;

  @Output()
  selectTrigger = new EventEmitter();


  onClick() {
    this.selectTrigger.emit(this.flight.id);
  }

}

