import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  count: number;
  maxCount: number;

  constructor() {
    this.count = 0;
    this.maxCount = 42;
  }

  increment() {
    if (this.count < this.maxCount) {
      this.count++;
    }
  }


  ngOnInit() {
  }

}
