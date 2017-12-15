import { NgModule } from '@angular/core';

import { PassengerRoutingModule } from './passenger-routing.module';
import {PassengerComponent} from './passenger.component';
import { Test2Component } from './test2/test2.component';

@NgModule({
  imports: [
    PassengerRoutingModule
  ],
  declarations: [PassengerComponent, Test2Component]
})
export class PassengerModule { }
