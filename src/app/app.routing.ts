import {ExtraOptions, Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'flights',
    loadChildren: 'src/app/pages/flights/flights.module#FlightsModule',
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

export const ROUTER_OPTIONS: ExtraOptions = {

};
