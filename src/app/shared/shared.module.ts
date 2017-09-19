import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlStateComponent } from './form-control-state/form-control-state.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FormControlStateComponent],
  exports: [FormControlStateComponent]
})
export class SharedModule { }
