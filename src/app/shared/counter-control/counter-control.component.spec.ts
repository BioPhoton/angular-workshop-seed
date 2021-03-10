import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterControlComponent } from './counter-control.component';

describe('CounterControlComponent', () => {
  let component: CounterControlComponent;
  let fixture: ComponentFixture<CounterControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
