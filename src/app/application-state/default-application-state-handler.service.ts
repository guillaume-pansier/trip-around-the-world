import { Injectable } from '@angular/core';
import { Country } from '../model/country/country';
import { Path } from '../model/paths/path';
import { CountryPath } from '../model/paths/country-path';
import { ApplicationStateHandler } from './application-state-handler';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/Rx';

import { PathRepositoryService } from '../model/paths/path-repository.service';
import { of } from 'rxjs/observable/of';



@Injectable()
export class DefaultApplicationStateHandlerService implements ApplicationStateHandler {

  private countryEventChannel: BehaviorSubject<Country> = new BehaviorSubject<Country>(null);
  private contryPathEventChannel: BehaviorSubject<CountryPath> = new BehaviorSubject<CountryPath>(null);
  private pathEventChannel: BehaviorSubject<Path> = new BehaviorSubject<Path>(null);

  private path: Path;
  private countryPath: CountryPath;

  constructor(private router: Router,
    private pathRepositoryService: PathRepositoryService) { }

  clicCountry(country: Country): void {
    this.countryEventChannel.next(country);


    if (this.path) {
      let countryPath = this.path.countries.find(pathCountry => pathCountry.countryid === country.id);
      if (!countryPath) {
        countryPath = new CountryPath(country.id, []);
        countryPath.preceededBy(this.countryPath);
        this.path.countries.push(countryPath);
      }

      this.countryPath = countryPath;
      this.contryPathEventChannel.next(countryPath);
      this.router.navigateByUrl('/country/' + country.id + '(nav-section:country/' + country.id + ')');
    } else {
      alert('Please create a new trip :)');
    }
  }

  modifyCountryPath(countryPath: CountryPath): Observable<void> {

    let indexForReplace = this.path.countries.findIndex(country => country.countryid === countryPath.countryid);
    if (!countryPath.hasInterestPoints()) {
      this.path.countries.splice(indexForReplace, 1);
    } else {
      this.path.countries.splice(indexForReplace, 1, countryPath);
    }

    return this.pathRepositoryService.savePath(this.path).map(
      returnedPath => {
        this.path = returnedPath;
        this.pathEventChannel.next(returnedPath);
        this.contryPathEventChannel.next(countryPath);
      }
    );
  }

  onCountryClicked(): Observable<Country> {
    return this.countryEventChannel.asObservable();
  }

  modifyPath(path: Path): Observable<Path> {
    return this.pathRepositoryService.savePath(path)
      .map(savedPath => {
        this.pathEventChannel.next(savedPath);
        this.path = savedPath;
        return this.path;
      });
  }

  selectPath(path: Path): Observable<void> {
    this.pathEventChannel.next(path);
    this.path = path;
    return of(null);
  }

  onActivePathModified(): Observable<Path> {
    return this.pathEventChannel.asObservable();
  }

  onCountryPathModified(): Observable<CountryPath> {
    return this.contryPathEventChannel.asObservable()
      .filter(path => {
        return path !== null && path !== undefined;
      });
  }
}
