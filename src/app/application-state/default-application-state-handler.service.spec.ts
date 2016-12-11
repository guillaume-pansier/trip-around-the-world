/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DefaultApplicationStateHandlerService } from './default-application-state-handler.service';
import { Country } from '../model/country/country';

class RouterStub {
  navigateByUrl(url: string) { return url; }
}

describe('Service: DefaultApplicationStateHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DefaultApplicationStateHandlerService,
        { provide: Router, useClass: RouterStub }
      ]
    });
  });

  it('should ...',
    inject([DefaultApplicationStateHandlerService, Router], (service: DefaultApplicationStateHandlerService, router: Router) => {
      expect(service).toBeTruthy();
    }));

  it('should redirect to correct url when a country is clicked',
    inject([DefaultApplicationStateHandlerService, Router], (service: DefaultApplicationStateHandlerService, router: Router) => {
         const spy = spyOn(router, 'navigateByUrl');

         service.countryClicked(new Country('path', 'id', 'name'));
         const navArgs = spy.calls.first().args[0];

         expect(navArgs).toBe('/country/id(nav-section:country/id)', 'should navigate to country detail on main and nav sections');
    }));
});
