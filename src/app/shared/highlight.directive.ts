import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {Flight} from "../core/api/models/flight";

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  @HostListener('click')
  click () {
    console.log('clik')
  }

  @Input()
  set appHighlight(flight: Flight) {
    if(flight.from === 'Wien') {
      console.log('Color border', flight.from)
      this.elRef.nativeElement.style = 'border: solid red 1px';
    }
  }

  constructor(
    private elRef: ElementRef
  ) {
    console.log('test HighlightDirective', this.elRef)
  }

}
