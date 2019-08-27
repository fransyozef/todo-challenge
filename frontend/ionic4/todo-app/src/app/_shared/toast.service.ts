import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastInterface } from './toast.interface';
import { ToastOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toast$ = new BehaviorSubject<ToastOptions>(null);

  constructor() { }

  toast(payload: string | ToastInterface) {

    let newPayload: ToastOptions = {
      message: '',
      duration: 1500,
      color: 'dark',
      position: 'top'
    };

    if (typeof(payload) === 'string') {
      newPayload.message  = payload;
    } else {
      newPayload  = Object.assign(newPayload , payload);
    }
    this.toast$.next(newPayload);
  }
}
