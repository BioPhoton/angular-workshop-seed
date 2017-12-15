import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlStateComponent } from './form-control-state/form-control-state.component';
import { HighlightDirective } from './directives/highlight.directive';


const comps = [FormControlStateComponent];
const dirs = [HighlightDirective];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [comps, dirs],
  exports: [comps, dirs]
})
export class SharedModule { }
