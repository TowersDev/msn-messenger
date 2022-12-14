import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {
  @ViewChild('') loading: any;
  constructor() {}

  ngOnInit() {}
}
