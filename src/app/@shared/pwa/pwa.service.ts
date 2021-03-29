import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var window: Window;
declare var navigator: Navigator;

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private isNetworkOffline: BehaviorSubject<boolean> = null;

  constructor() {
    // initialze the subjects
    this.initialize();
    // attach the events
    this.attachEvents();
  }

  getNetworkStatus(): Observable<boolean> {
    return this.isNetworkOffline.asObservable();
  }

  onNetworkStatusChange(evt: Event) {
    if (!evt) {
      this.isNetworkOffline = new BehaviorSubject(!navigator.onLine);
    } else {
      this.isNetworkOffline.next(!navigator.onLine);
    }
  }

  initialize() {
    this.onNetworkStatusChange(null);
  }

  attachEvents() {
    window.addEventListener('online', this.onNetworkStatusChange.bind(this));
    window.addEventListener('offline', this.onNetworkStatusChange.bind(this));
  }
}
