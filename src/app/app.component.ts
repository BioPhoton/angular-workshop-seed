import {Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {State} from '@app/+state';
import {Observable} from 'rxjs';
import {IncrementCount} from '@app/+state/app.actions';
import {getCount} from '@app/+state/app.selectors';
import {AppState} from '@app/+state/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  navBarCollapsed = true;
  count$: Observable<number>;

  constructor(private store: Store<State>) {
    this.count$ = this.store.pipe(select(getCount));
  }

  increment() {
    this.store.dispatch(new IncrementCount({amount: 1}));
  }

  toggleNav(closeOnly?: boolean) {
    if (closeOnly) {
      this.navBarCollapsed = true;
    } else {
      this.navBarCollapsed = !this.navBarCollapsed;
    }
  }

}
