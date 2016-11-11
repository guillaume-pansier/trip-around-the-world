import { TestBed, async, inject  } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, HttpModule, Response, ResponseOptions } from '@angular/http';

import { Config } from '../../config/config';
import { CountryRepositoryService } from './country.repository.service';

const URL_SVG = 'urlSvg';
const URL_COUNTRY_CODES = 'urlCountryCodes';
const countryTest = `<svg>
  <g id="va">
    <path class="landxx coastxx va"
          d="M 1364.4789,398.71214 L 1364.3907,398.74019 L 1364.2808,398.70318 L 1364.363,398.61969 L 1364.4669,398.60148"
          id="va-"/>
    <circle class="circlexx va" cx="1364.5283" cy="398.096005" id="va." r="6.01303"/>
   </g>
 </svg>`;

class ConfigTest {
  load() {
  };

  getEnv(key:any) {
    return '';
  }

  get(key:any) {
    if ('svgUrl' === key) {
      return URL_SVG;
    } else {
      return URL_COUNTRY_CODES;
    }
  }
}

describe('Service: CountryRepository', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        CountryRepositoryService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        {provide: Config, useClass: ConfigTest}],
      imports: [
        HttpModule
      ]
    });
  }));


  it('should construct', async(inject(
    [CountryRepositoryService, MockBackend], (service, mockBackend) => {

      expect(service).toBeDefined();
    })));

  it('should call countries and countrycodes resources when loading', async(inject(
    [CountryRepositoryService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe(c => {
        if (c.request.url === URL_SVG) {
          c.mockRespond(new Response(new ResponseOptions({
            body: countryTest
          })));
        } else {
          c.mockRespond(new Response(new ResponseOptions({body: '{"VA" : "testID"}'})));
        }

      });


      service.loadCountries().subscribe((loadedCountries) => {
        expect(loadedCountries.length).toBe(1);
        expect(loadedCountries[0].id).toBe('VA');
        expect(loadedCountries[0].name).toBe('testID');
      });

    })));

});
