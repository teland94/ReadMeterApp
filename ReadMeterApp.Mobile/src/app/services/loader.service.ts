import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(private readonly loadingController: LoadingController,
              private readonly translateService: TranslateService) { }

  showLoader() {
    this.loadingController.create({
      message: this.translateService.instant('MESSAGES.PLEASE_WAIT')
    }).then((res) => {
      res.present();
    });
  }

  hideLoader() {
    this.loadingController.dismiss().then((res) => {
    }).catch((error) => {
      console.log('error', error);
    });
  }
}
