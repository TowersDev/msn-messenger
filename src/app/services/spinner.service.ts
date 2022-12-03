import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})

export class SpinnerService {
  constructor(public loadingCtrl: LoadingController) {}

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      spinner: 'dots',
    });

    loading.present();
  }

  endLoading() {
    this.loadingCtrl.dismiss();
  }
}
