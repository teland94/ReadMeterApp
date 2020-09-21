import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {CommunalServiceCategory, Settings} from '../models/settings.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private _settings = new ReplaySubject<Settings>(1);
  readonly settings$ = this._settings.asObservable();

  constructor(private storage: StorageService) { }

  set settings(val: Settings) {
    this._settings.next(val);
  }

  async save(settings: Settings) {
    await this.storage.setItem('settings', JSON.stringify(settings));
    this.settings = { ...settings };
  }

  async fetch() {
    let settings = JSON.parse(await this.storage.getItem('settings'));
    if (!settings) {
      settings = new Settings();
    }
    if (!settings.communalServices) {
      settings.communalServices = [{
        id: 1,
        personalAccount: null,
        phoneNumber: null,
        category: CommunalServiceCategory.Electricity
      }, {
        id: 2,
        personalAccount: null,
        phoneNumber: null,
        category: CommunalServiceCategory.Gas
      }, {
        id: 3,
        personalAccount: null,
        phoneNumber: null,
        category: CommunalServiceCategory.Water
      }];
    }
    this.settings = settings;
  }
}
