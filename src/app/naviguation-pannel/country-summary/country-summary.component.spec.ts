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

class ApplicationStateHandlerStub implements ApplicationStateHandler {
  clicCountry(country: Country): void { }

  onCountryClicked(): Observable<Country> { return empty<Country>(); };

  modifyPath(path: Path): Observable<void> { return empty<void>(); };

  onPathModified(): Observable<Path> { return empty<Path>(); };

  modifyCountryPath(countryPath: CountryPath): Observable<void> { return empty<void>(); };

  onCountryPathModified(): Observable<CountryPath> { return empty<CountryPath>(); };
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
        { provide: STATE_HANDLER_TOKEN, useClass: ApplicationStateHandlerStub }
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
