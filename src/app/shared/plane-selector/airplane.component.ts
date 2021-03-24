import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractPlane, Plane } from './plane-selector.component';

@Component({
  selector: 'app-airplane',
  template: `
    <button class="btn rounded btn-primary m-2"
            (click)="selected.emit(plane)">
      {{ plane.name }}
    </button>
  `,
  styles: [],
  providers: [
    {
      provide: AbstractPlane,
      useExisting: AirplaneComponent
    }
  ]
})
export class AirplaneComponent implements AbstractPlane {

  @Input() plane: Plane;
  @Output() selected = new EventEmitter<Plane>();
}
