import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCardComponent } from './flight-card.component';
import {RouterModule} from '@angular/router';

describe('FlightCardComponent', () => {
  let component: FlightCardComponent;
  let fixture: ComponentFixture<FlightCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
      declarations: [ FlightCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
