import {CommonModule, DatePipe} from '@angular/common';
import {NgModule, Optional, SkipSelf} from '@angular/core';
import {FlightResource} from './api/resources/flight.resource';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { TestComponent } from './components/test/test.component';
import {FlightResourceMockService} from './api/resources/flight-resource-mock.service';
import {environment} from '../../environments/environment';
import { AddStrPipe } from './pipes/add-str.pipe';
import {FlightValidators} from './validators/flight.validator';
import { PostfixPipe } from './pipes/postfix.pipe';

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
  declarations: [TestComponent, AddStrPipe, PostfixPipe],
  exports: [CommonModule, HttpClientModule, TestComponent, AddStrPipe],
  providers: [
    AddStrPipe,
    {provide: FlightResource, useClass: FlightResource },
    // create interface
    // => ng g i core/api/resources/flightResource (rename it afterwards to flight-resource.interface.ts)
    // implement interface into old service
    // create a service FlightResourceMockService => ng g s core/api/resources/flightResourceMock
    // implement interface into new service
    // override DI with the new service => useClass

    // use the useFactory function to bind the service
    // {
    //   provide: FlightResource,
    //   useFactory: function(http) {
    //      return environment.production? new FlightResource(http):new FlightResourceMockService(http)
    //   },
    //
    // }
    {
      provide: FlightResource,
      useFactory: flightResourceFactory,
      deps: [HttpClient]
    },
    FlightValidators
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
