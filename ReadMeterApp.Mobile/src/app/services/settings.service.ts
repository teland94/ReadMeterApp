import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Settings } from '../models/settings.model';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private _settings = new ReplaySubject<Settings>(1);
  readonly settings$ = this._settings.asObservable();

  constructor(private storage: Storage) { }

  set settings(val: Settings) {
    this._settings.next(val);
  }

  async save(settings: Settings) {
    await this.storage.set('settings', settings);
    this.settings = { ...settings };
  }

  async fetch() {
    this.settings = await this.storage.get('settings');
  }
}
