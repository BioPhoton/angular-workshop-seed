import {Directive, ElementRef, HostBinding, Input} from '@angular/core';

@Directive({
  selector: '[appOutdated]'
})
export class OutdatedDirective {
   _date;


   @HostBinding('class')
   class

  @Input()
  set date(d: string) {
    if(d !== null && d.length > 0) {
      this._date = new Date(d);
      if(this._date > new Date()) {
        this.elementRef.nativeElement.classList.add('bg-primary')
      } else {
        this.elementRef.nativeElement.classList.remove('bg-primary')
      }
    } else {
      this.elementRef.nativeElement.classList.remove('bg-primary')
    }
  }

  constructor(private elementRef:ElementRef) {
    console.log('CTOR OutdatedDirective');
  }

}
