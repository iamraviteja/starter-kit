import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class RequestService {
  constructor(@Inject('config') private config: any) {
    console.log(`This is config :: ${config}`);
  }
}
