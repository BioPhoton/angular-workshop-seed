import {FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';


export function controlsDifferent(formControlNames: string[]): ValidatorFn {
  return (g: FormGroup): null | ValidationErrors => {
    let error = null;
    let NoEmptyValuesGiven = false;
    let SomeValuesGraterThanOne = false;

    // get all values by control name
    const result = formControlNames
      .map(controlName => g.get(controlName).value)
      // collect empty values
      .reduce((state, value) => {
        if (value === null || value === undefined || value === '') {
          state.countEmptyValues++;
        } else {
          const isSet: boolean = value in state.countByValue;
          const vC = state.countByValue;
          isSet ? vC[value]++ : vC[value] = 1;
        }
        return state;
      }, {countEmptyValues: 0, countByValue: {}});


    console.log('result', result);
    NoEmptyValuesGiven = !result.countEmptyValues;
    console.log('result.emptyValues', result.countEmptyValues, NoEmptyValuesGiven);
    SomeValuesGraterThanOne = !!Object.values(result.countByValue).find(v => v > 1);
    console.log('SomeValuesGraterThanOne', SomeValuesGraterThanOne);

    if (NoEmptyValuesGiven && SomeValuesGraterThanOne) {
      error = {
        controlsDifferent: {
          formControlNames
        }
      };
    }

    return error;
  };
}
