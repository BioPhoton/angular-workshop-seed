import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HighlightDirective} from './highlight.directive';

fdescribe('HighlightDirective', () => {

  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let el: HTMLElement;
  let targe1: Element;


  @Component({
    template: `<p id="targe1" appHighlight>Some String!!</p>`
  })
  class TestComponent {

  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HighlightDirective, TestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
    targe1 = el.querySelector('#targe1');
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have a ref to the target', () => {
    expect(targe1).toBeTruthy();
  });

  it('should apply class after initialisation', () => {
    expect(targe1.className).toBe('highlighted');
  });

});
