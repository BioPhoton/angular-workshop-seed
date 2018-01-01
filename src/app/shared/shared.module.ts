import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlStateComponent } from './form-control-state/form-control-state.component';


const comps = [FormControlStateComponent];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [comps],
  exports: [comps]
})
export class SharedModule { }
