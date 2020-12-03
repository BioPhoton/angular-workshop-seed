import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Flight} from "../../core/api/models/flight";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  @Input()
  article: Flight;

  @Input()
  selected: boolean;

  @Output()
  selectedChange = new EventEmitter<string | number>();

  constructor() { }

  ngOnInit(): void {
  }

}
