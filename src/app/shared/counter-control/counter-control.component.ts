import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, DefaultValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-counter-control',
  template: `
    <div class="btn-group">
      <button class="btn btn-info" (click)="decrement()">-</button>
      <button class="btn btn-link">{{value}}</button>
      <button class="btn btn-info" (click)="increment()">+</button>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CounterControlComponent,
      multi: true
    }
  ]
})
export class CounterControlComponent implements ControlValueAccessor {

  onChangeCb: (value: any) => void;
  value = 42;

  increment() {
    this.value++;
    // vm => m
    this.onChangeCb(this.value);
  }

  decrement() {
    this.value--;
    // vm => m
    this.onChangeCb(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: any): void {
  }

  // m => vm
  writeValue(value: any): void {
    this.value = value;
  }

}
