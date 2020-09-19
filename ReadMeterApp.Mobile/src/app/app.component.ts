import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SettingsService } from './services/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';

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
      url: '/home',
      icon: 'home',
      name: 'HOME_PAGE'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings',
      name: 'SETTINGS_PAGE'
    },
  ];
  public path: string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private androidPermissions: AndroidPermissions,
    private settingsService: SettingsService,
    private translateService: TranslateService,
    private router: Router,
    private location: Location
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
      this.platform.backButton.subscribe(() => {
        if (this.path !== 'home') {
          this.location.back();
        } else {
          navigator['app'].exitApp();
        }
      });
    });
  }

  async ngOnInit() {
    this.router.events.subscribe(val => {
      if (!(val instanceof NavigationEnd)) { return; }
      this.path = window.location.pathname.split('/')[1];
      if (this.path !== undefined) {
        const pageIndex = this.appPages.findIndex(
            page => page.name.replace('_PAGE', '').toLowerCase() === this.path.toLowerCase());
        this.selectedIndex = pageIndex > -1 ? pageIndex : 0;
      }
    });
    await this.settingsService.fetch();
  }
}
