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
    console.log('addOverlay', overlayId);
    this.overlays[overlayId] = true;
  }

  notifyOverlay(action: OverlayAction) {
    console.log('action', action);
    if (action.id in this.overlays) {
      this._actions$.next(action);
    }
  }

}
