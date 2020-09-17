import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Settings } from '../models/settings.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private _settings = new ReplaySubject<Settings>(1);
  readonly settings$ = this._settings.asObservable();

  constructor(private storageService: StorageService) { }

  set settings(val: Settings) {
    this._settings.next(val);
  }

  async save(settings: Settings) {
    await this.storageService.setItem('settings', JSON.stringify(settings));
    this.settings = { ...settings };
  }

  async fetch(): Promise<Settings> {
    return JSON.parse(await this.storageService.getItem('settings'));
  }
}
