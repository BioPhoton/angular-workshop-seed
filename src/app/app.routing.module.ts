import {NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'flights',
    loadChildren: 'app/pages/flights/flights.module#FlightsModule',
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
const routerOptions: ExtraOptions = {
  enableTracing: true,
  useHash: true
};


@NgModule({
  imports: [
    RouterModule.forRoot(routes, routerOptions)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
