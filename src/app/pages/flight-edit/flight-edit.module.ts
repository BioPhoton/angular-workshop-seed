import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FlightEditComponent } from './flight-edit.component';

@NgModule({
  declarations: [FlightEditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':id',
        component: FlightEditComponent
      }
    ]),
    SharedModule,
    ReactiveFormsModule
  ]
})
export class FlightEditModule {}
