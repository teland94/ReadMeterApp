import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private readonly toast: ToastController) { }

  async success(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 3000,
      color: 'primary'
    });
    await toast.present();
  }

  async error(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 3000,
      color: 'danger'
    });
    await toast.present();
  }
}
