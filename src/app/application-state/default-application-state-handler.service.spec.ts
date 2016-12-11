/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DefaultApplicationStateHandlerService } from './default-application-state-handler.service';

describe('Service: DefaultApplicationStateHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DefaultApplicationStateHandlerService]
    });
  });

  it('should ...', inject([DefaultApplicationStateHandlerService], (service: DefaultApplicationStateHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
