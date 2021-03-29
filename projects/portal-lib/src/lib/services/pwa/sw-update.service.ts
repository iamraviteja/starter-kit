import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SwUpdate, UpdateActivatedEvent, UpdateAvailableEvent } from '@angular/service-worker';
import { take } from 'rxjs/operators';

declare var window: Window;
declare var navigator: Navigator;

@Injectable({
  providedIn: 'root',
})
export class SwUpdateService {
  constructor(private swUpdate: SwUpdate) {
    if (!swUpdate.isEnabled) {
      console.log(`Service worker not enabled`);
    }
  }

  /**
   * updatesAvailable
   */
  public updatesAvailable(): Observable<UpdateAvailableEvent> {
    // event.current , event.available
    return this.swUpdate.available;
  }

  /**
   * updatesActivated
   */
  public updatesActivated(): Observable<UpdateActivatedEvent> {
    // event.previous , event.current
    return this.swUpdate.activated;
  }

  /**
   * checkForUpdates
   */
  public checkForUpdates(): Promise<void> {
    return this.swUpdate.checkForUpdate();
  }

  /**
   * forceUpdate
   */
  public forceUpdate(checkUpdates: boolean) {
    if (checkUpdates) {
      this.updatesAvailable()
        .pipe(take(1))
        .subscribe(() => {
          this.swUpdate.activateUpdate().then(() => window.location.reload());
        });
    } else {
      console.log(`force update!!!!!`);
      this.swUpdate.activateUpdate().then(() => window.location.reload());
    }
  }
}
