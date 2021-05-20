import {Routes} from "@angular/router";
import {FlightSearchComponent} from "./pages/flight-search/flight-search.component";
import {HomeComponent} from "./pages/home/home.component";
import {EditComponent} from "./pages/edit/edit.component";

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'flights',
    component: FlightSearchComponent
  },
  {
    path: 'flights/:id/edit',
    component: EditComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
];
