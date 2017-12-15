import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';





export function syncValidatorWithParam(param: any): ValidatorFn {
// this
  return (c: AbstractControl): null | ValidationErrors => {
console.log(param);
    return null;
  };
}


export function cityValidWithParam(validCities: string[]): ValidatorFn {
  return (c: AbstractControl): null | ValidationErrors => {
    if (!validCities.includes(c.value)) {
      return {
        cityValid: {
          actualCity: c.value,
          validCities: validCities
        }
      };
    }
    return null;
  };
}

// cityValidWithParam(asf) => defaultPatternOfValidator
