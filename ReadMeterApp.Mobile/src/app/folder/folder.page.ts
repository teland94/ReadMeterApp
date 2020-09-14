import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReadMeterService } from '../services/read-meter.service';
import { LoaderService } from '../services/loader.service';
import { ReadMeterResult } from '../models/read-meter-result';
import {BlickerResultPage} from '../blicker-result/blicker-result.page';
import {ModalController} from '@ionic/angular';
import {from, of} from 'rxjs';
import {switchAll, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  file: File;
  image: any;
  content: ReadMeterResult;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly readMeterService: ReadMeterService,
              private readonly modalController: ModalController) { }

  ngOnInit() {
    // this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.image = reader.result;
    }, false);
    if (this.file) {
      reader.readAsDataURL(this.file);
    }
  }

  read() {
    if (!this.file) { return; }
    this.readMeterService.read(this.file).subscribe(data => {
      this.content = data;
      this.presentModal(data).subscribe();
    });
  }

  presentModal(readMeterResult: ReadMeterResult) {
    const createModal = from(this.modalController.create({
      component: BlickerResultPage,
      componentProps: {
        readMeterResult
      }
    }));
    return createModal.pipe(switchMap((modal) => from(modal.present())));
  }
}
