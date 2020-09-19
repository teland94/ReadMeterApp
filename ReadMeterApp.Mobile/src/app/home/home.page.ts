import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReadMeterService } from '../services/read-meter.service';
import { LoaderService } from '../services/loader.service';
import {MeterCategory, ReadMeterResult} from '../models/read-meter-result';
import { BlickerResultPage } from '../blicker-result/blicker-result.page';
import { ModalController, Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { ToastService } from '../services/toast.service';
import { Settings } from '../models/settings.model';
import { SettingsService } from '../services/settings.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  private settingsSubscription: Subscription;

  public folder: string;

  file: File;
  image: string;
  result: ReadMeterResult;
  settings: Settings;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly readMeterService: ReadMeterService,
              private readonly modalController: ModalController,
              private readonly loaderService: LoaderService,
              private readonly camera: Camera,
              private readonly sms: SMS,
              private readonly toastService: ToastService,
              private readonly settingsService: SettingsService,
              private readonly platform: Platform,
              private readonly translateService: TranslateService) { }

  ngOnInit() {
    this.settingsSubscription = this.settingsService.settings$.subscribe(data => {
      this.settings = data;
    });
  }

  ngOnDestroy() {
    this.settingsSubscription.unsubscribe();
  }

  get isCordova() {
    return this.platform.is('cordova');
  }

  async cameraClick() {
    if (!this.settings || !this.settings.personalAccount) {
      await this.toastService.error(this.translateService.instant('MESSAGES.PERSONAL_ACCOUNT_NOT_SET_ERROR'));
      return;
    }
    await this.loadCameraImage();
    await this.read();
  }

  async readClick() {
    if (!this.settings || !this.settings.personalAccount) {
      await this.toastService.error(this.translateService.instant('MESSAGES.PERSONAL_ACCOUNT_NOT_SET_ERROR'));
      return;
    }
    await this.read();
  }

  async sendSmsClick() {
    if (!this.result) { return; }
    try {
      await this.sendSms(this.settings.personalAccount, this.result.displayValue, this.result.meterCategory);
      await this.toastService.success(this.translateService.instant('MESSAGES.METER_READING_SENT_SUCCESS'));
    } catch (e) {
      console.log(e);
      await this.toastService.error(this.translateService.instant('MESSAGES.METER_READING_SENT_ERROR'));
    }
  }

  handleFileInput(files: FileList) {
    const file = files.item(0);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.image = reader.result.toString();
    }, false);
    if (file) {
      this.file = file;
      reader.readAsDataURL(this.file);
    }
  }

  private async read() {
    if (!this.image) { return; }
    this.loaderService.showLoader();
    try {
      const readMeterResult = await this.readMeterService.read(this.image);
      this.loaderService.hideLoader();
      if (!await this.checkReadMeterResult(readMeterResult)) { return; }
      const readMeterViewResult = { ...readMeterResult };
      readMeterViewResult.displayValue = readMeterViewResult.displayValue.split('.')[0];
      this.result = readMeterViewResult;
      const modal = await this.presentModal(readMeterViewResult.displayValue, readMeterViewResult.meterCategory);
      const { data } = await modal.onWillDismiss();
      if (data && data.confirmed) {
        try {
          await this.sendSms(this.settings.personalAccount, readMeterViewResult.displayValue, readMeterViewResult.meterCategory);
          await this.toastService.success(this.translateService.instant('MESSAGES.METER_READING_SENT_SUCCESS'));
        } catch (e) {
          console.log(e);
          await this.toastService.error(this.translateService.instant('MESSAGES.METER_READING_SENT_ERROR'));
        }
      }
    } catch (e) {
      console.log(e);
      this.loaderService.hideLoader();
      if (e.status === 400) {
        await this.toastService.error(e.error.detail);
      }
    }
  }

  private async checkReadMeterResult(readMeterResult: ReadMeterResult) {
    if (readMeterResult.messages && readMeterResult.messages.length > 0) {
      const { code } = readMeterResult.messages[0];
      if (code === 'no_meter') {
        await this.toastService.error(this.translateService.instant('MESSAGES.NO_METER_ERROR'));
        return false;
      }
    }
    if (!readMeterResult.displayValue) {
      await this.toastService.error(this.translateService.instant('MESSAGES.UNREAD_METER_READING_ERROR'));
      return false;
    }
    return true;
  }

  private async loadCameraImage() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType : this.camera.DestinationType.DATA_URL,
      correctOrientation: true,
      saveToPhotoAlbum: false
    };
    const imageData = await this.camera.getPicture(options);
    this.image = 'data:image/jpeg;base64,' + imageData;
  }

  private async presentModal(displayValue: string, meterCategory: string) {
    const modal = await this.modalController.create({
      component: BlickerResultPage,
      componentProps: {
        displayValue,
        meterCategory
      }
    });
    await modal.present();
    return modal;
  }

  private async sendSms(personalAccount: string, displayValue: string, meterCategory: MeterCategory) {
    let smsNumber;
    switch (meterCategory) {
      case MeterCategory.Electricity:
        smsNumber = '123';
        break;
      case MeterCategory.Gas:
        smsNumber = '456';
        break;
    }
    if (smsNumber) {
      await this.sms.send(smsNumber, `${personalAccount} ${displayValue}`);
    }
  }
}
