import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async getItem(key: string) {
    const { value } = await Storage.get({ key });
    return value;
  }

  async setItem(key: string, value: any) {
    await Storage.set({ key, value });
  }

  async removeItem(key: string) {
    await Storage.remove({ key });
  }

  async clear() {
    await Storage.clear();
  }
}
