import {AbstractControl, ValidationErrors} from '@angular/forms';

export function syncValidator(c: AbstractControl): null | ValidationErrors {
  console.log('syncValidator this', this);
  return null;
}


export function cityValid(c: AbstractControl): null | ValidationErrors {
  const validCities: string[] = ['Bratislava', 'Partyslava', 'Bratislover'];

  if (!validCities.includes(c.value)) {
    return {
      cityValid: {
        actualCity: c.value,
        validCities: validCities
      }
    };
  }

  return null;
}
