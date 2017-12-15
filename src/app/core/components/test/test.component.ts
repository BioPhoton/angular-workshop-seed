import { Component, OnInit } from '@angular/core';
import {FlightResource} from '../../api/resources/flight.resource';
import {FlightResourceMockService} from '../../api/resources/flight-resource-mock.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  providers: []
})
export class TestComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
