import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = null;
  user$ = new BehaviorSubject(null);

  isLoggedIn$ = this.user$.pipe(map(u => !!u));

  constructor() {
  }

  logIn(): void {
    this.user$.next({
      name: 'Giulio',
      role: 'admin',
      permissions: {user: ['edit', 'delete']}
    });
  }

  logOut(): void {
    this.user$.next(null);
  }
}
