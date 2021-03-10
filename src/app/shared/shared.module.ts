import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlStateComponent } from './form-control-state/form-control-state.component';
import { OutdatedDirective } from './directives/outdated.directive';
import { CounterControlComponent } from './counter-control/counter-control.component';


const comps = [FormControlStateComponent, OutdatedDirective, CounterControlComponent];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [comps],
  exports: [comps]
})
export class SharedModule { }
