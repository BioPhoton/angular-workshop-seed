import {CommonModule} from '@angular/common';
import {NgModule, Optional, SkipSelf} from '@angular/core';
import {FlightResource} from './api/resources/flight.resource';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {environment} from '../../environments/environment';

export function flightResourceFactory(http: HttpClient) {
  if(environment.production) {
    return new FlightResource(http);
  }
  return new FlightResource(http);
}

@NgModule({
  imports: [
    CommonModule, HttpClientModule
  ],
  exports: [CommonModule, HttpClientModule],
  providers: [
    {provide: FlightResource, useClass: FlightResource },
    {
      provide: FlightResource,
      useFactory: flightResourceFactory,
      deps: [HttpClient]
    }
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
