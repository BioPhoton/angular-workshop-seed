import {Component} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CounterComponent,
      multi: true
    }
  ]
})
export class CounterComponent implements ControlValueAccessor {

  value = 0;
  disabled = false;

  onChange;
  onTouch;

  constructor() {
  }

  increment(): void {
    ++this.value;
    this.onChange(this.value);
  }

  decrement(): void {
    --this.value;
    this.onChange(this.value);
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
