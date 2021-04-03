import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RequestService } from './request.service';

@NgModule({
  imports: [CommonModule],
})
export class AsyncModule {
  static forRoot(config: any): ModuleWithProviders<AsyncModule> {
    return {
      ngModule: AsyncModule,
      providers: [RequestService, { provide: 'config', useValue: config }],
    };
  }
}
