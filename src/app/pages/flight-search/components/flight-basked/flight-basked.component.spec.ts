import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBaskedComponent } from './flight-basked.component';

describe('FlightBaskedComponent', () => {
  let component: FlightBaskedComponent;
  let fixture: ComponentFixture<FlightBaskedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightBaskedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightBaskedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
