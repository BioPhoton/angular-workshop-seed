import {
  Component, DoCheck, Input, OnChanges,
  SimpleChanges
} from '@angular/core';
import {async, TestBed} from '@angular/core/testing';
import {PostfixPipe} from './postfix.pipe';

xdescribe('PostfixPipe', () => {

  describe('PostfixPipe without html', () => {

    let someString = '';
    let pipe;

    beforeEach(() => {
      pipe = new PostfixPipe();
      someString = 'someString';
    });

    it('create an instance', () => {
      expect(pipe).toBeTruthy();
    });

    it('should postfix with default value', () => {
      expect(pipe.transform(someString)).toBe(someString + pipe.defaultPostfix);
    });

    it('should postfix with custom value', () => {
      const customPostfix = '??';
      expect(pipe.transform(someString, customPostfix)).toBe(someString + customPostfix);
    });

  });


  describe('PostfixPipe with html', () => {

    let fixture;
    let component;
    let el: HTMLElement;


    @Component({
      template: `{{someString | postfix:customPostfix }}`
    })
    class TestComponent implements DoCheck {

      customPostfix: string;
      @Input() someString = 'someString';

      constructor()  {
        console.log('ctro someString: ', this.someString);
      }

      // <tt [someString]="12"></tt>

      ngDoCheck(): void {
        console.log('ngDoCheck', this.someString);
      }

    }


    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [PostfixPipe, TestComponent]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      el = fixture.nativeElement;
      fixture.detectChanges();
    });

    it('should render string with default postfix', () => {
      const p = new PostfixPipe();
      console.log(component);
      expect(el.textContent).toBe(component.someString + p.defaultPostfix);
    });

    it('should render string with custom postfix', () => {
      component.customPostfix = '!!!';
      fixture.detectChanges();
      expect(el.textContent).toBe(component.someString + component.customPostfix);
    });


  });

});
