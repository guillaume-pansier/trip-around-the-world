import { NgModule } from '@angular/core';
import { DefaultApplicationStateHandlerService } from './default-application-state-handler.service';
import { STATE_HANDLER_TOKEN } from '../constants';

@NgModule({
  providers: [
      { provide: STATE_HANDLER_TOKEN, useClass: DefaultApplicationStateHandlerService }
  ]
})
export class ApplicationStateModule {
}
