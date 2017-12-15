import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {Flight} from '../../core/api/models/flight';
import {FlightResource} from '../../core/api/resources/flight.resource';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnChanges, OnInit {


  @Input() appHighlight;

  @Input() flight: Flight;
  @Input() notExisting;

  domElem: HTMLElement;
  initialBackground: string;

  initCont;

  newCont: HTMLElement;


  @HostBinding('class')
  className: string;

  constructor(private eR: ElementRef, private renderer: Renderer2) {
    this.domElem = this.eR.nativeElement;

    // this.init();
  }

  ngOnInit(): void {
    this.initialBackground = this.domElem.style.backgroundColor;

    this.initCont = this.domElem.querySelector('span');
    console.log(this.domElem.parentElement.parentElement.parentElement);


    this.newCont = this.renderer.createElement('marquee');
    this.newCont.style.position = 'absolute';
    this.newCont.style.top = '-1000';

    this.renderer.appendChild(this.domElem, this.newCont);

    console.log('this.domElem.innerText', this.domElem.innerText);
    this.newCont.innerText = this.initCont.innerText;

  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('appHighlight' in changes && changes.appHighlight.currentValue) {
      this.appHighlight = changes.appHighlight.currentValue;
    } else {
      this.appHighlight = 'yellow';
    }
  }

  /*
   init() {
   this.domElem.addEventListener('mouseover', ($event: MouseEvent) => {
   this.domElem.style.backgroundColor = this.hoverBackground;
   });
   this.domElem.addEventListener('mouseleave', ($event: MouseEvent) => {
   this.domElem.style.backgroundColor = this.initialBackgroud;
   });
   }
   */

  @HostListener('mouseover', ['$event'])
  onMouseOver($event: MouseEvent) {
    this.domElem.style.backgroundColor = this.appHighlight;

    this.initCont.style.display = 'none';
    this.newCont.style.display = 'block';
    this.newCont.style.position = 'relative';
    this.newCont.style.top = '0';

    // this.className = 'text-muted text-center';
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave($event: MouseEvent) {
    this.domElem.style.backgroundColor = this.initialBackground;
    // this.className = '';
    // this.domElem.innerHTML = this.initCont;
    this.initCont.style.display = 'block';
    this.newCont.style.display = 'none';

    this.newCont.style.position = 'absolute';
    this.newCont.style.top = '-1000';
    this.renderer.removeClass(this.domElem, 'text-center');
  }

}
