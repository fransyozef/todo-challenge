import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';

import { TodoService } from './todo/_services/todo.service';

import { get, set } from 'idb-keyval';
import { ToastController } from '@ionic/angular';
import { SwUpdate } from '@angular/service-worker';
import { AngularPageVisibilityService, AngularPageVisibilityStateEnum } from 'angular-page-visibility';

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

  onPageVisibleSubscription: Subscription;

  constructor(
    private platform: Platform,
    private todoService: TodoService,
    private toastController: ToastController,
    private swUpdate: SwUpdate,
    private alertController: AlertController,
    private angularPageVisibilityService: AngularPageVisibilityService,
  ) { }

  initializeApp() {
    this.platform.ready().then(() => {
      this.todoService.fetch().subscribe(
        () => {
          this.onPageVisibleSubscription = this.angularPageVisibilityService.$onPageVisibilityChange.subscribe((
            visibilityState: AngularPageVisibilityStateEnum
          ) => {
            localStorage.setItem('visibility' , '' + visibilityState);
          } );
        }
      );
      this.showIosInstallBanner();
      this.checkUpdate();

      setInterval(() => {
        const visibility = localStorage.getItem('visibility');
        if(visibility === 'hidden') {
          localStorage.setItem('visibility' , 'visible');
          this.checkUpdate();
        }
      }, 1000);

    });
  }

  fetchItems() {
    this.todoService.fetch().subscribe();
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

  checkUpdate() {
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

  ngOnInit() {
    this.initializeApp();
  }

}
