import { Injectable } from '@angular/core';
import { Storage as NativeStorage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly storage: Storage | NativeStorage;

  constructor(private readonly nativeStorage: NativeStorage,
              private readonly platform: Platform) {
    if (this.platform.is('cordova')) {
      this.storage = localStorage;
    } else {
      this.storage = localStorage;
    }
  }

  async getItem(key: string) {
    if (this.storage instanceof NativeStorage) {
      await this.storage.get(key);
    } else {
      return await this.storage.getItem(key);
    }
  }

  async setItem(key: string, value: any) {
    if (this.storage instanceof NativeStorage) {
      await this.storage.set(key, value);
    } else {
      await this.storage.setItem(key, value);
    }
  }

  async removeItem(key: string) {
    if (this.storage instanceof NativeStorage) {
      await this.storage.remove(key);
    } else {
      await this.storage.removeItem(key);
    }
  }

  async clear() {
    await this.storage.clear();
  }
}
