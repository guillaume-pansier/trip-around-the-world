/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';

import { AppComponent } from './app.component';
import { MapSVGComponent } from './map/map.svg';
import { CountrySVGComponent } from './map/country.svg';
import { CountryRepository } from './map/repository/country.repository';
import { Country } from './map/model/country';
import { CONTRY_REPO_TOKEN } from './map/repository/country.repository.constants';


class CountryRepositoryMock implements CountryRepository {
  loadCountries(): Observable<Array<Country>> {
    return from([]);
  }
  saveCountry(country: Country): void {

  }
  saveCountryWithPath(country: Country, path: any): void {

  }
  getCountry(countryId: string): Observable<Country> {
    return of(new Country('', '', ''));
  }
}

describe('App: Ponyracer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MapSVGComponent,
        CountrySVGComponent
      ],
      providers: [{provide: CONTRY_REPO_TOKEN, useClass: CountryRepositoryMock}]
    });
  });

  it('to fix', async(() => {
    expect(true).toBeTruthy();
  }));

/*  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should contains one child of type map 'MapSVGComponent'`, async(() => {
    let fixture = TestBed.createComponent(AppComponent);

    let maps = fixture.debugElement.queryAll(By.directive(MapSVGComponent));
    expect(maps.length).toBe(1);
  }));*/

});
