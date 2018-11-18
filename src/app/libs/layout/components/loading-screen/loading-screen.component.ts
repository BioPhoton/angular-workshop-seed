import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {OverlaySpinnerService} from '@app/libs/layout/services/overlay-spinner.service';
import {Observable, Subject} from 'rxjs';
import {delay, filter, pluck, switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'overlay-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit, AfterViewInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject();

  @Input()
  id: string;

  showDelay = 100;
  hideDelay = 700;

  hostContainer;
  initialDisplayValue: string;
  hiddenDisplayValue = 'none';

  relevantActions$ = this.olS.actions$
    .pipe(
      filter(a => a.id === this.id),
      pluck('action'),
    );
  show$ = this.relevantActions$.pipe(filter(a => a === 'show'));
  hide$ = this.relevantActions$.pipe(filter(a => a === 'hide'));

  constructor(private e: ElementRef, private olS: OverlaySpinnerService) {
    this.hostContainer = this.e.nativeElement;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.initialDisplayValue = this.hostContainer.style.display;
    this.hide();
    this.olS.addOverlay(this.id);

    this.show$.pipe(
      switchMap((a) => {
        // delay display of overlay or skip entirely
        return Observable.of(a).pipe(delay(this.showDelay), takeUntil(this.hide$));
      }),
      takeUntil(this.destroy$)
    ).subscribe(this.show);

    this.hide$
      .pipe(delay(this.hideDelay), takeUntil(this.destroy$))
      .subscribe(this.hide);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  show = () => {
    if (this.hostContainer.style.display !== this.initialDisplayValue) {
      this.hostContainer.style.display = this.initialDisplayValue;
    }
  }

  hide = () => {
    if (this.hostContainer.style.display !== this.hiddenDisplayValue) {
      this.hostContainer.style.display = this.hiddenDisplayValue;
    }
  }

}
