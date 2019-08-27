import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FakeBackendInterceptor } from './_shared/fakebackend';
import { APP_BASE_HREF } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TodoService } from './todo/_services/todo.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularPageVisibilityModule } from 'angular-page-visibility';
import { ToastService } from './_shared/toast.service';
import { LoaderService } from './_shared/loader.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularPageVisibilityModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/'},
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendInterceptor,
      multi: true
    },
    TodoService,
    ToastService,
    LoaderService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
