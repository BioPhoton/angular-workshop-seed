import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PassengerComponent} from './passenger.component';
import {CommonModule} from '@angular/common';

const ROUTES: Routes = [
  {
    path: '',
    // component: PassengerComponent
    children: [
      {
        path: 't1',
        component: PassengerComponent
      },
      {
        path: 't2',
        component: PassengerComponent
      }
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES)],
  exports: [RouterModule, CommonModule]
})
export class PassengerRoutingModule {

}
