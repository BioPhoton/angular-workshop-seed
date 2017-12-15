import {Directive, ElementRef, HostBinding} from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {


  @HostBinding('class')
  className: string;

  constructor(private eR: ElementRef) {
    console.info('HighlightDirectiveHighlightDirectiveHighlightDirective');
    this.className = 'highlighted';
  }

}
