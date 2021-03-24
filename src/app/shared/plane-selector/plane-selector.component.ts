import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren, Directive,
  Inject,
  InjectionToken,
  Optional,
  QueryList,
  ViewChildren
} from '@angular/core';
import { merge, Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { AirplaneComponent } from './airplane.component';

export interface Plane {
  name: string;
}

export interface IPlaneService {
  planes$: Observable<Plane[]>
}

export function defaultPlanes(): Plane[] {
  return [
    {
      name: 'boeing 747'
    },
    {
      name: 'Airco DH.16'
    },
    {
      name: 'Airbus A321'
    },
    {
      name: 'Airbus A380'
    },
    {
      name: 'Beriev Be-200'
    }
  ];
}

export function specialPlanes(): Plane[] {
  return defaultPlanes().map(plane => ({
    name: `SPECIAL_✈️_${plane.name}`
  }))
}

export const PLANE_SERVICE = new InjectionToken<IPlaneService>('plane-service');

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class AbstractPlane {
  selected: Observable<Plane>;
}

@Component({
  selector: 'app-plane-selector',
  template: `
    <div class="row">
      <div class="col-10">
        <ng-content></ng-content>
      </div>
      <div class="col-2">

        <button class="btn btn-danger"
                (click)="selectPlane(null)"
                *ngIf="selectedPlane">
          {{ selectedPlane.name }}
          <i class="fa fa-remove"></i>
        </button>

      </div>
    </div>
  `,
  styles: [``]
})
export class PlaneSelectorComponent implements AfterContentInit {

  readonly planes$: Observable<Plane[]> = this.planeService.planes$;

  selectedPlane: Plane | null;

  @ContentChildren(AbstractPlane) airplanes: QueryList<AbstractPlane>;

  constructor(
    @Inject(PLANE_SERVICE) private planeService: IPlaneService
  ) {
  }

  ngAfterContentInit() {
    this.airplanes.changes.pipe(
      startWith(this.airplanes),
      switchMap(() => merge(...this.airplanes.map(airplane => airplane.selected)))
    ).subscribe((selected: Plane) => this.selectPlane(selected))
  }

  selectPlane(plane: Plane): void {
    this.selectedPlane = this.selectedPlane === plane ? null : plane;
  }
}
