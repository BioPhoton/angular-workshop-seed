import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      console.log('params.id: ', params.id)
    });
  }

  ngOnInit(): void {
  }

}
