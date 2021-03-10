import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import {Observable, of} from "rxjs";
import {delay} from "rxjs/operators";



export function emailBlacklisted(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
  if(control.value !== 'Mars') {
    return of(null).pipe(
      delay(2000)
    );
  }
  return of({
    emailBlacklisted: true
  }).pipe(
    delay(2000)
  )
}

export function validPlanet(validPlanets: string[]): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    if (validPlanets.includes(control.value)) {
      return null;
    }
    return {
      validPlanet: {
        currentPlanet: control.value,
        validPlanets
      }
    }
  }

}


export function isDifferent(group: FormGroup): ValidationErrors | null {

  if (group.controls.from.value !== group.controls.to.value) {
    return null;
  }
  return {
    isDifferent: true
  }
}

