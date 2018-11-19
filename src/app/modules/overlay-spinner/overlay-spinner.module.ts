import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {LoadingScreenComponent} from './components/loading-screen/loading-screen.component';
import {OverlaySpinnerService} from '@app/modules/overlay-spinner/services/overlay-spinner.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LoadingScreenComponent],
  exports: [LoadingScreenComponent]
})
export class OverlaySpinnerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OverlaySpinnerModule,
      providers: [
        OverlaySpinnerService
      ]
    };
  }

  static forFeature(): ModuleWithProviders {
    return {
      ngModule: OverlaySpinnerModule,
      providers: []
    };
  }
}
