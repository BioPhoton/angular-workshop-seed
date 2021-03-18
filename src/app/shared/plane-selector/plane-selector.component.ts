import { Component, Inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface Plane {
  name: string;
}

export interface IPlaneService {
  planes$: Observable<Plane[]>
}

export const PLANE_SERVICE = new InjectionToken<IPlaneService>('plane-service');

@Component({
  selector: 'app-plane-selector',
  template: `
    <div class="row">
      <div class="col-10">

        <button class="btn rounded btn-primary m-2"
                (click)="selectPlane(plane)"
                *ngFor="let plane of planes$ | async">
          {{ plane.name }}
        </button>

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
  ) {}

  selectPlane(plane: Plane): void {
    this.selectedPlane = this.selectedPlane === plane ? null : plane;
  }
}
