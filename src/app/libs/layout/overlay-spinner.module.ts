import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingScreenComponent} from './components/loading-screen/loading-screen.component';
import {OverlaySpinnerService} from '@app/libs/layout/services/overlay-spinner.service';

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
}
