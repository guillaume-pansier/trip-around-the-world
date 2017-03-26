/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { DefaultApplicationStateHandlerService } from './default-application-state-handler.service';
import { Country } from '../model/country/country';
import { Path } from '../model/paths/path';
import { PathRepositoryService } from '../model/paths/path-repository.service';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';


class RouterStub {
  navigateByUrl(url: string) { return url; }
}

class PathServiceStub extends PathRepositoryService {
  public getPaths(): Observable<Path> {
    return empty<Path>();
  }
  public savePath(path: Path): Observable<Path> {
    return null;
  }
}

describe('Service: DefaultApplicationStateHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        DefaultApplicationStateHandlerService,
        { provide: Router, useClass: RouterStub },
        { provide: PathRepositoryService, useClass: PathServiceStub }
      ]
    });
  });

  it('should be instantiated',
    inject([DefaultApplicationStateHandlerService, Router], (service: DefaultApplicationStateHandlerService, router: Router) => {
      expect(service).toBeTruthy();
    }));

  it('should not redirect when country clicked and no path selected',
    inject([DefaultApplicationStateHandlerService, Router], (service: DefaultApplicationStateHandlerService, router: Router) => {
      const spy = spyOn(router, 'navigateByUrl');

      service.clicCountry(new Country('path', 'id', 'name'));
      const calls = spy.calls.count();

      expect(calls).toBe(0);
    }));

  it('should redirect to correct url when a country is clicked',
    inject([DefaultApplicationStateHandlerService, Router], (service: DefaultApplicationStateHandlerService, router: Router) => {
      const spy = spyOn(router, 'navigateByUrl');
      service.selectPath(new Path('', []));
      service.clicCountry(new Country('path', 'id', 'name'));
      const navArgs = spy.calls.first().args[0];

      expect(navArgs).toBe('/country/id(nav-section:country/id)', 'should navigate to country detail on main and nav sections');
    }));
});
