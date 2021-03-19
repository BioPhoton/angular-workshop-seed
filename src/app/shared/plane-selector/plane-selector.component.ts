import { Component, Inject, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';

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

@Component({
  selector: 'app-plane-selector',
  template: `
    <div class="row">
      <div class="col-10">

        <app-airplane
          [plane]="plane"
          (selected)="selectPlane($event)"
          *ngFor="let plane of planes$ | async"></app-airplane>

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
export class PlaneSelectorComponent {

  readonly planes$: Observable<Plane[]> = this.planeService.planes$;

  selectedPlane: Plane | null;

  constructor(
    @Inject(PLANE_SERVICE) private planeService: IPlaneService
  ) {
  }

  selectPlane(plane: Plane): void {
    this.selectedPlane = this.selectedPlane === plane ? null : plane;
  }
}
