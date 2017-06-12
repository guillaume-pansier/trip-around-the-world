/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ModalModule } from 'ng2-bootstrap';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PathRepositoryService } from '../model/paths/path-repository.service';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { NaviguationPannelComponent } from './naviguation-pannel.component';
import { ModalComponentComponent } from './modal-component/modal-component.component';
import { ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';
import { Path } from '../model/paths/path';
import { Country } from '../model/country/country';
import { CountryPath } from '../model/paths/country-path';
import { ApplicationStateHandler } from '../application-state/application-state-handler';
import { STATE_HANDLER_TOKEN } from '../constants';
import { HttpModule } from '@angular/http';
import { InterestPoint } from '../model/paths/interest-point';




class PathServiceStub extends PathRepositoryService {
  public getPaths(): Observable<Path> {
    return empty<Path>();
  }
  public savePath(path: Path): Observable<Path> {
    return null;
  }
}

class ApplicationStateHandlerStub implements ApplicationStateHandler {
  leaveCountry(country: Country): void {
    throw new Error("Method not implemented.");
  }
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

describe('NaviguationPannelComponent', () => {
  let component: NaviguationPannelComponent;
  let fixture: ComponentFixture<NaviguationPannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ModalModule.forRoot(), FormsModule, HttpModule ],
      declarations: [ NaviguationPannelComponent, ModalComponentComponent ],
      providers: [
        { provide: PathRepositoryService, useClass: PathServiceStub },
        { provide: STATE_HANDLER_TOKEN, useClass: ApplicationStateHandlerStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaviguationPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
