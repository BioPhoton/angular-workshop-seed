import {CommonModule} from '@angular/common';
import {NgModule, Optional, SkipSelf} from '@angular/core';
import {FlightResource} from './api/resources/flight.resource';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule, HttpClientModule
  ],
  declarations: [],
  exports: [CommonModule, HttpClientModule],
  providers: [
    FlightResource
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only!');
    }
  }

}
