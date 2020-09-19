import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {MeterCategory} from '../models/read-meter-result';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-blicker-result',
  templateUrl: './blicker-result.page.html',
  styleUrls: ['./blicker-result.page.scss'],
})
export class BlickerResultPage implements OnInit {

  @Input() displayValue: string;
  @Input() meterCategory: MeterCategory;

  mCategory = MeterCategory;

  constructor(private readonly modalController: ModalController,
              private readonly translateService: TranslateService) { }

  ngOnInit() {
    console.log(this.displayValue, this.meterCategory);
  }

  confirmModal() {
    this.modalController.dismiss({ confirmed: true });
  }

  cancelModal() {
    this.modalController.dismiss({ confirmed: false });
  }

  getMeterCategoryText(meterCategory: MeterCategory) {
    let meterCategoryText;
    switch (meterCategory) {
      case MeterCategory.Electricity:
        meterCategoryText = this.translateService.instant('METER_CATEGORIES.ELECTRICITY');
        break;
      case MeterCategory.Gas:
        meterCategoryText = this.translateService.instant('METER_CATEGORIES.GAS');
        break;
      case MeterCategory.Water:
        meterCategoryText = this.translateService.instant('METER_CATEGORIES.WATER');
        break;
    }
    return meterCategoryText;
  }
}
