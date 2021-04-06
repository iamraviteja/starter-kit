import { ErrorHandler, Injectable } from '@angular/core';

import { Logger } from './logger.service';

const log = new Logger('AppErrorHandler');

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor() {}

  public handleError(error: any) {
    //   update the config for sentry or other third party error logging libs
    log.error(`App Error`, error);
  }
}
