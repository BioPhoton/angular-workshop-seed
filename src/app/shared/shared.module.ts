import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlStateComponent } from './form-control-state/form-control-state.component';
import { OutdatedDirective } from './directives/outdated.directive';
import { CounterControlComponent } from './counter-control/counter-control.component';
import { PlaneSelectorComponent } from './plane-selector/plane-selector.component';


const comps = [FormControlStateComponent, OutdatedDirective, CounterControlComponent, PlaneSelectorComponent];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [comps],
  exports: [comps]
})
export class SharedModule { }
