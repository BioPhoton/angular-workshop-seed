import {HttpClientModule} from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FlightResource} from './resources/flight.resource';
import {FlightApiConfig} from './interfaces/flight-api-config.interface';
import {FLIGHT_API_CONFIG_TOKEN} from './tokens/flight-api-config.token';

@NgModule({
  imports: [
    HttpClientModule
  ],
  declarations: [],
  exports: [],
  providers: []
})
export class FlightApiModule {

  static forRoot(config: FlightApiConfig): ModuleWithProviders {
    return {
      ngModule: FlightApiModule,
      providers: [
        FlightResource,
        {
          provide: FLIGHT_API_CONFIG_TOKEN,
          useValue: config
        }
  ]
    };
  }
  static forFeature(): ModuleWithProviders {
    return {
      ngModule: FlightApiModule,
      providers: []
    };
  }

}
