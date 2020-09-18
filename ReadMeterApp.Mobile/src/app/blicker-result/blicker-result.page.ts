import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-blicker-result',
  templateUrl: './blicker-result.page.html',
  styleUrls: ['./blicker-result.page.scss'],
})
export class BlickerResultPage implements OnInit {

  @Input() displayValue: string;
  @Input() meterCategory: string;

  constructor(private readonly modalController: ModalController) { }

  ngOnInit() {
    console.log(this.displayValue, this.meterCategory);
  }

  confirmModal() {
    this.modalController.dismiss({ confirmed: true });
  }

  cancelModal() {
    this.modalController.dismiss({ confirmed: false });
  }
}
