import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IPlaneService, Plane, specialPlanes } from '../../shared/plane-selector/plane-selector.component';

@Injectable()
export class SpecialPlanesService implements IPlaneService {
  planes$ = new BehaviorSubject<Plane[]>(specialPlanes());
}
