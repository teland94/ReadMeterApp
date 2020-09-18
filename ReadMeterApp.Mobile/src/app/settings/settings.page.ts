import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingsService} from '../services/settings.service';
import {Settings} from '../models/settings.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  private settingsSubscription: Subscription;

  settings: Settings = { };

  constructor(private readonly settingsService: SettingsService) { }

  ngOnInit() {
    this.settingsSubscription = this.settingsService.settings$.subscribe(data => {
      if (!data) { return; }
      this.settings = data;
    });
  }

  async ngOnDestroy() {
    this.settingsSubscription.unsubscribe();
    await this.settingsService.save(this.settings);
  }
}
