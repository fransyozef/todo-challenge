import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaNetworkService {

  online$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    window.addEventListener('load', () => {
      window.addEventListener('online', this.handleNetworkChange.bind(this));
      window.addEventListener('offline', this.handleNetworkChange.bind(this));
    });
  }

  handleNetworkChange() {
    this.online$.next(navigator.onLine);
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}
