import {NgModule} from '@angular/core';
import {OverlaySpinnerModule} from '@app/libs/layout/overlay-spinner.module';

@NgModule({
  imports: [
    OverlaySpinnerModule.forRoot()
  ],
  declarations: [],
  exports: [OverlaySpinnerModule],
  providers: [

  ]
})
export class CoreModule {

}
