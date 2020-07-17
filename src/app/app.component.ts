import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {AuthService} from "./core/api/auth.service";
import {timer} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  navBarCollapsed = true;

  constructor(private auth: AuthService, private router: Router) {
   this.initAuth();
  }

  initAuth() {
    timer(3000)
      .subscribe(() => {
        Math.random() < 0.5 ? this.auth.logIn() : this.auth.logOut();
        this.router.navigate(['edit']);
      })
  }

  toggleNav(closeOnly?: boolean) {
    if (closeOnly) {
      this.navBarCollapsed = true;
    } else {
      this.navBarCollapsed = !this.navBarCollapsed;
    }
  }

}
