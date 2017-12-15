import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-flight-basket',
  templateUrl: './flight-basked.component.html',
  styleUrls: ['./flight-basked.component.scss']
})
export class FlightBaskedComponent implements OnInit {

  @Input() selectedFlightIds: { [key: string]: boolean };
  constructor() { }

  ngOnInit() {
  }

}
