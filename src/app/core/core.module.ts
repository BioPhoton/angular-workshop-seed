import {CommonModule} from '@angular/common';
import {NgModule, Optional, SkipSelf} from '@angular/core';
import {FlightResource} from './api/resources/flight.resource';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {environment} from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule, HttpClientModule
  ],
  exports: [CommonModule, HttpClientModule],
  providers: []
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only!');
    }
  }

}
