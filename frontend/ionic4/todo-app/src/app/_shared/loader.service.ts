import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoadingOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loader$ = new BehaviorSubject<any>(null);
  loaderHide$ = new BehaviorSubject<any>(null);

  constructor() { }

  show(payload?: string | LoadingOptions) {

    let newPayload: LoadingOptions = {
      message: ''
    };

    if (typeof(payload) === 'string') {
      newPayload.message  = payload;
    } else {
      newPayload  = Object.assign(newPayload , payload);
    }

    this.loader$.next(newPayload);
  }

  hide() {
    this.loaderHide$.next({});
  }
}
