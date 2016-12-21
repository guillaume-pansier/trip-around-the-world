/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PathRepositoryService } from './path-repository.service';
import { Http, BaseRequestOptions, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('Service: PathRepository', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [PathRepositoryService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }],
      imports: [
        HttpModule
      ]
    });
  }));

  it('should ...', async(inject([PathRepositoryService, MockBackend], (service: PathRepositoryService, mockBackend) => {
    expect(service).toBeTruthy();
  })));

  it('empty response from backend gives empty array', async(inject(
    [PathRepositoryService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe(c => {
        c.mockRespond(new Response(new ResponseOptions({
          body: []
        })));

      });


      service.getPaths().subscribe(
        (path) => fail(),
        () => { },
        () => expect(true).toBeTruthy()
      );

    })));

  it('should retrieve 1 path from backend', async(inject(
    [PathRepositoryService, MockBackend], (service: PathRepositoryService, mockBackend) => {

      mockBackend.connections.subscribe(c => {
        c.mockRespond(new Response(new ResponseOptions({
          body: [{
            '_id': '_id', countries: [
              { countryid: 'countryid', interestPoints: [{ name: 'name', coordinates: 'coordinates' }] }]
          }]
        })));

      });

      service.getPaths().single()
        .subscribe((path) => {
          expect(path._id).toBe('_id');
          expect(path.countries.length).toBe(1);
          expect(path.countries[0].interestPoints.length).toBe(1);
          expect(path.countries[0].interestPoints[0].coordinates).toBe('coordinates');
          expect(path.countries[0].interestPoints[0].name).toBe('name');
          expect(path.countries[0].countryid).toBe('countryid');
        });

      service.getPaths().count().subscribe(
        count => expect(count).toBe(1)
      );

    })));

  it('should retrieve 2 path from backend', async(inject(
    [PathRepositoryService, MockBackend], (service: PathRepositoryService, mockBackend) => {

      mockBackend.connections.subscribe(c => {
        c.mockRespond(new Response(new ResponseOptions({
          body: [
            { '_id': '_id', countries: [
              { countryid: 'countryid', 'interestPoints': [ { name: 'name1', coordinates: 'coordinates' }] }
              ] },
            { '_id': '_id2', countries: [
              { countryid: 'countryid2', 'interestPoints': [ { name: 'name2', coordinates: 'coordinates2' }] }
              ] }
          ]
        })));

      });

      service.getPaths()
        .subscribe((path) => {
          expect(path._id).toMatch('_id.*');
          expect(path.countries.length).toBe(1);
          expect(path.countries[0].interestPoints.length).toBe(1);
          expect(path.countries[0].interestPoints[0].coordinates).toMatch('coordinates.*');
          expect(path.countries[0].interestPoints[0].name).toMatch('name.*');
          expect(path.countries[0].countryid).toMatch('countryid.*');
        });

      service.getPaths().count().subscribe(
        count => expect(count).toBe(2)
      );

    })));
});
