import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlStateComponent } from './form-control-state/form-control-state.component';
import { ArticleComponent } from './article/article.component';


const comps = [
  FormControlStateComponent,
  ArticleComponent
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [comps],
  exports: [comps]
})
export class SharedModule { }
