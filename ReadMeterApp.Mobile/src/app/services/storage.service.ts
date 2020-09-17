import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly storage: Storage | NativeStorage;

  constructor(private readonly nativeStorage: NativeStorage,
              private readonly platform: Platform) {
    if (this.platform.is('cordova')) {
      this.nativeStorage = nativeStorage;
    } else {
      this.storage = localStorage;
    }
  }

  async getItem(key: string) {
    return await this.nativeStorage.getItem(key);
  }

  async setItem(key: string, value: any) {
    await this.storage.setItem(key, value);
  }

  async removeItem(key: string) {
    if (this.storage instanceof NativeStorage) {
      await this.storage.remove(key);
    } else {
      this.storage.removeItem(key);
    }
  }

  async clear() {
    await this.storage.clear();
  }
}
