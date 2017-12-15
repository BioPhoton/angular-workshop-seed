import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {
  ExtraOptions,
  PreloadAllModules,
  RouterModule,
  Routes
} from '@angular/router';

import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {FlightEditComponent} from './pages/flight-edit/flight-edit.component';
import {FlightBaskedComponent} from './pages/flight-search/components/flight-basked/flight-basked.component';
import {FlightCardComponent} from './pages/flight-search/components/flight-card/flight-card.component';
import {FlightSearchComponent} from './pages/flight-search/flight-search.component';
import {HomeComponent} from './pages/home/home.component';
import {DetailComponent} from './pages/test/detail/detail.component';
import {TestComponent} from './pages/test/test.component';
import {SharedModule} from './shared/shared.module';
import {FlightResolver} from './pages/flight-edit/services/flight.resover';


const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
   path: 'home',
    component: HomeComponent
  },
  {
    path: 'flight-search',
    component: FlightSearchComponent
  },
  {
    path: 'flight-edit/:id',
    component: FlightEditComponent,
    resolve: {
      flight: FlightResolver
    }
  },
  {
    path: 'passenger',
    loadChildren: 'app/pages/passenger/passenger.module#PassengerModule'
  },
  {
    path : 'test',
    component: TestComponent,
    children: [
      {
        path: '',
        redirectTo: 'detail',
        pathMatch: 'full'
      },
      {
        path: 'detail',
        component: DetailComponent
      },

    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  },
];
const extraOptions: ExtraOptions = {
  useHash: true,
  // enableTracing: true,
  preloadingStrategy: PreloadAllModules
};

@NgModule({
  declarations: [
    // Components
    // Directives
    AppComponent,
    HomeComponent,
    FlightSearchComponent,
    FlightCardComponent,
    FlightBaskedComponent,
    FlightEditComponent,
    TestComponent,
    DetailComponent
  ],
  exports: [
    // Modules
    // Components
    // Directives
  ],
  imports: [
    // Modules
    BrowserModule,
    CoreModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(APP_ROUTES, extraOptions),
    // PassengerModule
  ],
  providers: [
    // Services
    FlightResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
