import { Component, OnInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';

import { TodoService } from './todo/_services/todo.service';

import { get, set } from 'idb-keyval';
import { ToastController } from '@ionic/angular';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: 'Todo',
      url: '/todo',
      icon: 'list'
    },
    {
      title: 'About',
      url: '/about',
      icon: 'information-circle-outline'
    }
  ];

  constructor(
    private platform: Platform,
    private todoService: TodoService,
    private toastController: ToastController,
    private swUpdate: SwUpdate,
    private alertController: AlertController,
  ) {
    this.initializeApp();

    this.todoService.fetch().subscribe();

    this.showIosInstallBanner();
  }

  initializeApp() {
    this.platform.ready().then(() => {

    });
  }

  async showIosInstallBanner() {
    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };  // Detects if device is in standalone mode
    // tslint:disable-next-line:no-string-literal
    const isInStandaloneMode = () => ('standalone' in window.navigator) && window.navigator['standalone'];
  
    // Show the banner once
    const isBannerShown = await get('isBannerShown');
  
    // Checks if it should display install popup notification
    if (isIos() && !isInStandaloneMode() && isBannerShown === undefined) {
      const toast = await this.toastController.create({
        showCloseButton: true,
        closeButtonText: 'OK',
        cssClass: 'custom-toast',
        position: 'bottom',
        message: `To install the app, tap "Share" icon below and select "Add to Home Screen".`,
      });
      toast.present();
      set('isBannerShown', true);
    }
  }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(async () => {
        const alert = await this.alertController.create({
          header: `App update!`,
          message: `Newer version of the app is available. It's a quick refresh away!`,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            }, {
              text: 'Refresh',
              handler: () => {
                window.location.reload();
              },
            },
          ],
        });
  
        await alert.present();
      });
    }
  }

}
