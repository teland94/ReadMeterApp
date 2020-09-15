import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReadMeterService } from '../services/read-meter.service';
import { LoaderService } from '../services/loader.service';
import { ReadMeterResult } from '../models/read-meter-result';
import { BlickerResultPage } from '../blicker-result/blicker-result.page';
import { ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  image: string;
  content: ReadMeterResult;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly readMeterService: ReadMeterService,
              private readonly modalController: ModalController,
              private readonly loaderService: LoaderService,
              private readonly camera: Camera,
              private readonly sms: SMS,
              private readonly toastService: ToastService) { }

  ngOnInit() {
    this.loadCamera();
  }

  loadCamera() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType : this.camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: false,
    };

    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
    }, async (err) => {
      console.log(err);
      await this.toastService.error('Ошибка фотографирования');
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
    const readMeterResult = await this.readMeterService.read(this.image);
    try {
      this.loaderService.hideLoader();
      this.content = readMeterResult;
      if (readMeterResult.messages && readMeterResult.messages.length > 0) {
        const { code } = readMeterResult.messages[0];
        if (code === 'no_meter') {
          await this.toastService.error('Счетчик не обнаружен');
          return;
        }
      }
      const modal = await this.presentModal(readMeterResult.displayValue, readMeterResult.displayType);
      const { data: { accepted } } = await modal.onWillDismiss();
      if (accepted) {
        await this.sms.send('123', `${'12345'} ${readMeterResult.displayValue}`);
        await this.toastService.success('Показания успешно отправлены');
      }
    } catch (e) {
      console.log(e);
      this.loaderService.hideLoader();
      await this.toastService.error('Ошибка распознавания');
    }
  }

  async presentModal(displayValue: string, displayType: string) {
    const modal = await this.modalController.create({
      component: BlickerResultPage,
      componentProps: {
        displayValue,
        displayType
      }
    });
    await modal.present();
    return modal;
  }
}
