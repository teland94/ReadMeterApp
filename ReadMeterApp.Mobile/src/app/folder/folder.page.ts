import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReadMeterService } from '../services/read-meter.service';
import { LoaderService } from '../services/loader.service';
import { ReadMeterResult } from '../models/read-meter-result';
import { BlickerResultPage } from '../blicker-result/blicker-result.page';
import { ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { ToastService } from '../services/toast.service';
import { Settings } from '../models/settings.model';
import { SettingsService } from '../services/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit, OnDestroy {

  private settingsSubscription: Subscription;

  public folder: string;

  image: string;
  content: ReadMeterResult;
  settings: Settings;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly readMeterService: ReadMeterService,
              private readonly modalController: ModalController,
              private readonly loaderService: LoaderService,
              private readonly camera: Camera,
              private readonly sms: SMS,
              private readonly toastService: ToastService,
              private readonly settingsService: SettingsService) { }

  ngOnInit() {
    // this.loadCamera();
    this.settingsSubscription = this.settingsService.settings$.subscribe(data => {
      this.settings = data;
    });
  }

  ngOnDestroy() {
    this.settingsSubscription.unsubscribe();
  }

  cameraClick() {
    if (!this.settings || !this.settings.personalAccount) {
      this.toastService.error('Не установлен лицевой счет');
      return;
    }
    this.loadCamera();
  }

  loadCamera() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType : this.camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: false
    };

    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
    }, async (err) => {
      console.log(err);
    });
  }

  handleFileInput(files: FileList) {
    const file = files.item(0);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.image = reader.result.toString();
    }, false);
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  async read() {
    if (!this.image) { return; }
    this.loaderService.showLoader();
    try {
      const readMeterResult = await this.readMeterService.read(this.image);
      this.loaderService.hideLoader();
      this.content = readMeterResult;
      if (readMeterResult.messages && readMeterResult.messages.length > 0) {
        const { code } = readMeterResult.messages[0];
        if (code === 'no_meter') {
          await this.toastService.error('Счетчик не обнаружен');
          return;
        }
      }
      const modal = await this.presentModal(readMeterResult.displayValue, readMeterResult.meterCategory);
      const { data } = await modal.onWillDismiss();
      if (data && data.accepted) {
        await this.sendSms(this.settings.personalAccount, readMeterResult.displayValue, readMeterResult.meterCategory);
        await this.toastService.success('Показания успешно отправлены');
      }
    } catch (e) {
      console.log(e);
      this.loaderService.hideLoader();
      if (e.status === 400) {
        await this.toastService.error(e.error.detail);
      }
    }
  }

  async presentModal(displayValue: string, meterCategory: string) {
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

  private async sendSms(personalAccount: string, displayValue: string, meterCategory: string) {
    let smsNumber;
    switch (meterCategory) {
      case 'electricity':
        smsNumber = 123;
        break;
      case 'gas':
        smsNumber = 456;
        break;
    }
    if (smsNumber) {
      await this.sms.send(smsNumber, `${personalAccount} ${displayValue}`);
    }
  }
}
