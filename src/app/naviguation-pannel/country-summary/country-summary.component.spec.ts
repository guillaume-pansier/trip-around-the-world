/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { STATE_HANDLER_TOKEN } from '../../constants';
import { ApplicationStateHandler } from '../../application-state/application-state-handler';
import { CountrySummaryComponent } from './country-summary.component';
import { InterestPointCellComponent } from './interest-point-cell/interest-point-cell.component';
import { Country } from '../../model/country/country';
import { CountryPath } from '../../model/paths/country-path';
import { Observable } from 'rxjs/Rx';
import { Path } from '../../model/paths/path';
import { empty } from 'rxjs/observable/empty';
import { InterestPoint } from '../../model/paths/interest-point';
import { CountryRepository } from '../../model/country/country.repository';
import { CONTRY_REPO_TOKEN } from '../../model/country/country.repository.constants';

class ApplicationStateHandlerStub implements ApplicationStateHandler {
  leaveCountry(country: Country): void { }
  clicCountry(country: Country): void { }

  onCountryClicked(): Observable<Country> { return empty<Country>(); };

  modifyPath(path: Path): Observable<Path> { return empty<Path>(); };

  selectPath(path: Path): Observable<void> { return empty<void>(); };

  onActivePathModified(): Observable<Path> { return empty<Path>(); };

  modifyCountryPath(countryPathSingleOrArray: CountryPath[] | CountryPath, newInterestPoint?: InterestPoint): Observable<void> {
    return empty<void>();
  };

  onCountryPathModified(): Observable<CountryPath[]> { return empty<CountryPath[]>(); };
}

class CountryRepositoryMock implements CountryRepository {
  loadCountries(): Observable<Country[]> {
    throw new Error("Method not implemented.");
  }
  getCountry(countryId: string): Observable<Country> {
    throw new Error("Method not implemented.");
  }
  saveCountry(country: Country): void {
    throw new Error("Method not implemented.");
  }
  saveCountryWithPath(country: Country, path: any): void {
    throw new Error("Method not implemented.");
  }

}

describe('CountrySummaryComponent', () => {
  let component: CountrySummaryComponent;
  let fixture: ComponentFixture<CountrySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CountrySummaryComponent,
        InterestPointCellComponent
      ],
      providers: [
        { provide: STATE_HANDLER_TOKEN, useClass: ApplicationStateHandlerStub },
        { provide: CONTRY_REPO_TOKEN, useClass: CountryRepositoryMock }
      ]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CountrySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));
});
