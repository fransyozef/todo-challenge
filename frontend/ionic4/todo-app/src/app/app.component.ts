import { Subscription, BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, ToastController, LoadingController } from '@ionic/angular';

import { TodoService } from './todo/_services/todo.service';

import { get, set } from 'idb-keyval';
import { SwUpdate } from '@angular/service-worker';
import { AngularPageVisibilityService, AngularPageVisibilityStateEnum } from 'angular-page-visibility';
import { ToastService } from './_shared/toast.service';
import { ToastInterface } from './_shared/toast.interface';
import { ToastOptions, LoadingOptions } from '@ionic/core';
import { LoaderService } from './_shared/loader.service';
import { PwaNetworkService } from './_shared/pwa-network.service';

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

  toastSubscription: Subscription;

  loading: any;

  online$: Subscription;

  toast: any;

  isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  }

  // tslint:disable-next-line:no-string-literal
  isInStandaloneMode = () => ('standalone' in window.navigator) && window.navigator['standalone'];

  constructor(
    private platform: Platform,
    private todoService: TodoService,
    private toastController: ToastController,
    private swUpdate: SwUpdate,
    private alertController: AlertController,
    private angularPageVisibilityService: AngularPageVisibilityService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    public loadingController: LoadingController,
    private pwaNetworkService: PwaNetworkService,
  ) { }

  initializeApp() {
    this.platform.ready().then(() => {

      this.fetchData();
      this.showIosInstallBanner();
      this.checkUpdate();
      this.initPageVisibility();

      this.initToast();
      this.initLoader();
      this.initNetworkChange();
    });
  }

  fetchData() {
    this.loaderService.show();
    this.todoService.fetch().subscribe(
      () => {
        this.loaderService.hide();
      }
    );
  }

  initLoader() {
    this.loaderService.loader$.subscribe(
      (payload) => {
        if(payload !== null) {
          this.presentLoader(payload);
        }
      }
    );

    this.loaderService.loaderHide$.subscribe(
      () => {
        if (this.loading) {
          this.loading.dismiss();
        }
      }
    );
  }

  async presentLoader(payload?: LoadingOptions) {
    this.loading =  await this.loadingController.create(payload);
    await this.loading.present();
  }

  initToast() {
    this.toastService.toast$.subscribe(
      (payload) => {
        if(payload !== null) {
          this.presentToast(payload);
        }
      }
    );
  }

  async presentToast(payload: ToastOptions) {
    this.toast = await this.toastController.create(payload);
    this.toast.present();
  }

  initPageVisibility() {
    if (this.isIos() && this.isInStandaloneMode()) {
      // listen on page visibility change
      this.onPageVisibleSubscription = this.angularPageVisibilityService.$onPageVisibilityChange.subscribe((
        visibilityState: AngularPageVisibilityStateEnum
      ) => {
        const visibility = localStorage.getItem('visibility');
        let status  = '';
        switch (visibilityState) {
          case AngularPageVisibilityStateEnum.VISIBLE: {
            status = 'VISIBLE';
            localStorage.setItem('visibility', status);
            if (visibility === 'HIDDEN') {
              this.onAppStarted();
            }
            break;
          }
          case AngularPageVisibilityStateEnum.HIDDEN: {
            status = 'HIDDEN';
            localStorage.setItem('visibility', status);
            break;
          }
        }
      });
    }
  }

  initNetworkChange() {
    this.online$ = this.pwaNetworkService.online$.subscribe(
      (value) => {
        if (!value) {
          this.presentToast({
            message: 'You are offline!',
            showCloseButton: true,
            position: 'top',
            color: 'danger'
          });
        } else {
          if (this.toast) {
            this.toast.dismiss();
          }
        }
      }
    );
  }

  onAppStarted() {
    this.swUpdate.checkForUpdate();
    this.pwaNetworkService.handleNetworkChange();
  }

  async showIosInstallBanner() {
    // Show the banner once
    const isBannerShown = await get('isBannerShown');

    // Checks if it should display install popup notification
    if (this.isIos() && !this.isInStandaloneMode() && isBannerShown === undefined) {
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
