import {Directive, ElementRef, Input} from '@angular/core';
import {AuthService} from "../core/api/auth.service";
import {tap} from "rxjs/operators";
import {RxState} from "@rx-angular/state";
import {combineLatest} from "rxjs";
import {tokenReference} from "@angular/compiler";

interface StyleManager {
  enable(): void;

  disable(): void;
}

class ButtonStyleManager implements StyleManager {


  constructor(private elem: HTMLElement) {
  }

  disable(): void {
    this.elem.style.display =  'hidden';
  }

  enable(): void {
    this.elem.style.display =  'block';
  }
}

class InputStyleManager implements StyleManager {


  constructor(private elem: HTMLElement) {
  }

  disable(): void {
    this.elem.setAttribute('disabled', 'disabled');
  }

  enable(): void {
    this.elem.removeAttribute('disabled');
  }
}

class DivStyleManager implements StyleManager {


  constructor(private elem: HTMLElement) {
  }

  disable(): void {
    this.elem.classList.remove('disabled');
  }

  enable(): void {
    this.elem.classList.add('disabled');
  }
}

function getManager(elem: HTMLElement): StyleManager {
  const tagName = elem.tagName;

  switch (tagName) {
    case 'INPUT':
      return new InputStyleManager(elem);
    case 'BUTTON':
      return new ButtonStyleManager(elem);
    case 'DIV':
      return new DivStyleManager(elem);
    default:
      return new DivStyleManager(elem);

  }
}

@Directive({
  selector: '[perm]'
})
export class PermDirective extends RxState<{ prop: any }> {

  @Input()
  set prop(prop: any) {
    this.set({prop})
  }

  constructor(
    private auth: AuthService,
    private hostElem: ElementRef
  ) {
    super();
    const manager = getManager(this.hostElem.nativeElement);
    this.set({prop: true})
    this.hold(
      combineLatest([this.auth.user$, this.select('prop')])
      .pipe(
        tap(([isLoggedIn, prop]) => {
          isLoggedIn ? manager.enable() : manager.disable();
        })
      ))
  }

  checkPerm(u, prop): boolean {
    return u.role === prop
  }

}
