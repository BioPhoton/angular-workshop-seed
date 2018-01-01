import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBookingsComponent } from './flight-bookings.component';

describe('FlightBookingsComponent', () => {
  let component: FlightBookingsComponent;
  let fixture: ComponentFixture<FlightBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
