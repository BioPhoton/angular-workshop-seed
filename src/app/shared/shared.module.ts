import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlStateComponent } from './form-control-state/form-control-state.component';
import { FlightTileComponent } from './flight-tile/flight-tile.component';
import { HighlightDirective } from './highlight.directive';


const comps = [
  FormControlStateComponent,
  FlightTileComponent,
  HighlightDirective
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [comps],
  exports: [comps]
})
export class SharedModule { }
