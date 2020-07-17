import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlStateComponent } from './form-control-state/form-control-state.component';
import { FlightCardComponent } from './flight-card/flight-card.component';
import { CounterComponent } from './counter/counter.component';
import {RouterModule} from "@angular/router";
import { PermDirective } from './perm.directive';


const comps = [FormControlStateComponent, PermDirective, FlightCardComponent, CounterComponent];

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
  declarations: [comps],
  exports: [comps]
})
export class SharedModule { }
