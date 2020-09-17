import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {SettingsService} from './services/settings.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/folder',
      icon: 'home',
      name: 'MAIN_PAGE'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings',
      name: 'SETTINGS_PAGE'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private androidPermissions: AndroidPermissions,
    private settingsService: SettingsService,
    private translateService: TranslateService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.androidPermissions.requestPermissions(
          [
            this.androidPermissions.PERMISSION.CAMERA,
            this.androidPermissions.PERMISSION.SEND_SMS
          ]
      );
      this.translateService.setDefaultLang('en');
      this.translateService.use('ru');
      const translationKeys = this.appPages.map(page => `SIDEBAR.${page.name}_TITLE`);
      this.translateService.get(translationKeys).subscribe(data => {
        this.appPages.forEach(page => {
          page.title = data[`SIDEBAR.${page.name}_TITLE`];
        });
      });
    });
  }

  async ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
    this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
    await this.settingsService.fetch();
  }
}
