import {CommonModule} from '@angular/common';
import {NgModule, Optional, SkipSelf} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {InMemoryDataModule} from "./in-memory-data/in-memory-data.module";

@NgModule({
  imports: [
    CommonModule, HttpClientModule
  ],
  exports: [CommonModule, HttpClientModule],
  providers: []
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only!');
    }
  }

}
