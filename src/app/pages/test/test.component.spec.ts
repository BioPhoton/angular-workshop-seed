import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TestComponent} from './test.component';

describe('TestComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be initialized with default values', () => {
    expect(component.count).toBe(0);
  });

  it('should be initialized with maxCount 42', () => {
    expect(component.maxCount).toBe(42);
  });

  it('should increment properly', () => {
    expect(component.count).toBe(0);
    component.increment();
    expect(component.count).toBe(1);
  });

  it('should increment only to the maxCount', () => {
    expect(component.count).toBe(0);
    for (let i = 0; i < 80; i++) {
      if (i < component.maxCount) {
        expect(component.count).toBe(i);
      } else {
        expect(component.count).toBe(component.maxCount);
      }
      component.increment();
    }
    expect(component.count).toBe(component.maxCount);

  });

});
