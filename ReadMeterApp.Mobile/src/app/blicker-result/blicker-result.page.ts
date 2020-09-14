import {Component, Input, OnInit} from '@angular/core';
import {ReadMeterResult} from '../models/read-meter-result';

@Component({
  selector: 'app-blicker-result',
  templateUrl: './blicker-result.page.html',
  styleUrls: ['./blicker-result.page.scss'],
})
export class BlickerResultPage implements OnInit {

  @Input() readMeterResult: ReadMeterResult;

  constructor() { }

  ngOnInit() {
  }

}
