import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

interface OverlayAction {
  id: string;
  action: string;
}

@Injectable()
export class OverlaySpinnerService {

  _actions$: Subject<OverlayAction> = new Subject();
  get actions$() {
    return this._actions$.asObservable();
  }

  overlays: { [key: string]: boolean } = {};

  constructor() {
  }

  addOverlay(overlayId: string) {
    this.overlays[overlayId] = true;
  }

  notifyOverlay(action: OverlayAction) {
    if (action.id in this.overlays) {
      this._actions$.next(action);
    }
  }

}
