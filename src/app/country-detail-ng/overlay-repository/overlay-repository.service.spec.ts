/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OverlayRepositoryService } from './overlay-repository.service';
import { Http, BaseRequestOptions, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('Service: OverlayRepository', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OverlayRepositoryService,
       MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
      ],
       imports: [
        HttpModule
      ]
    });
  });

  it('should ...', inject([OverlayRepositoryService], (service: OverlayRepositoryService) => {
    expect(service).toBeTruthy();
  }));
});
