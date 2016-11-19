/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OverlayRepositoryService } from './overlay-repository.service';

describe('Service: OverlayRepository', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OverlayRepositoryService]
    });
  });

  it('should ...', inject([OverlayRepositoryService], (service: OverlayRepositoryService) => {
    expect(service).toBeTruthy();
  }));
});
