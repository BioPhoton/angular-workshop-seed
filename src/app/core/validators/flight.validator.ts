import {Injectable} from '@angular/core';
import {
  AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import {FlightResource} from '../api/resources/flight.resource';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';

@Injectable()
export class FlightValidators {

  private fr: FlightResource;

  constructor(fr: FlightResource) {
    this.fr = fr;
    const c = new FormControl('af');
  }


  // sync
  flightValid(): ValidatorFn {

    return (c: AbstractControl): null | ValidationErrors => {
      // access some service here
      console.log('this2', this.fr);
      return null;
    };
  }


  // async
  flightExisting(): AsyncValidatorFn {
    return (c: AbstractControl): Observable<null> | Observable<ValidationErrors> => {
      // access some service here
      console.log('this2', this.fr);
      return Observable.of(null).delay(2000);
    };
  }

}
