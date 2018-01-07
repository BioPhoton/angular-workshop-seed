import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlightResource} from '@app/core/api/resources/flight.resource';
import {OverlaySpinnerModule} from '@app/libs/layout/overlay-spinner.module';

@NgModule({
  imports: [
    HttpClientModule,
    OverlaySpinnerModule.forRoot()
  ],
  declarations: [],
  exports: [OverlaySpinnerModule],
  providers: [
    FlightResource
  ]
})
export class CoreModule {

}
