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
import { InterestPoint } from '../model/paths/interest-point';



@Injectable()
export class DefaultApplicationStateHandlerService implements ApplicationStateHandler {

  private countryEventChannel: BehaviorSubject<Country> = new BehaviorSubject<Country>(null);
  private contryPathEventChannel: BehaviorSubject<Array<CountryPath>> = new BehaviorSubject<Array<CountryPath>>([]);
  private pathEventChannel: BehaviorSubject<Path> = new BehaviorSubject<Path>(null);

  private path: Path;
  private countryPaths: Array<CountryPath>;

  constructor(private router: Router,
    private pathRepositoryService: PathRepositoryService) { }

  clicCountry(country: Country): void {
    this.countryEventChannel.next(country);


    if (this.path) {
      let selectedCountryPaths = this.path.countries.filter(pathCountry => pathCountry.countryid === country.id);

      // first time in the country, init values
      if (!selectedCountryPaths || selectedCountryPaths.length === 0) {
        let newCountryPath = this.createNewCountryPath(country.id, []);
        selectedCountryPaths.push(newCountryPath);
        this.path.countries.push(newCountryPath);
      }

      this.countryPaths = selectedCountryPaths;
      this.contryPathEventChannel.next(selectedCountryPaths);
      this.router.navigateByUrl('/country/' + country.id + '(nav-section:country/' + country.id + ')');
    } else {
      alert('Please create a new trip :)');
    }
  }

  leaveCountry(country: Country): void {
    this.cleanStateIfCountryLeftUnchanged();
  }

  private cleanStateIfCountryLeftUnchanged() {
    if (this.countryPaths && this.countryPaths.length === 1 && !this.countryPaths[0].hasInterestPoints()) {
      this.countryPaths[0].removeFromLinkedList();
      this.countryPaths = undefined;
      this.path.countries.pop();
    }
  }

  modifyCountryPath(countryPathSingleOrArray: CountryPath[] | CountryPath, newInterestPoint?: InterestPoint): Observable<void> {

    if (newInterestPoint) {
      return this.addInterestPointToCountryPath(<CountryPath>countryPathSingleOrArray, newInterestPoint);
    } else if (countryPathSingleOrArray instanceof Array) {
      let countryId = countryPathSingleOrArray[0].countryid;
      let countryPathsToReplace = this.path.countries.filter(country => country.countryid === countryId);

      for (let i = 0; i < countryPathSingleOrArray.length; i++) {
        let indexOfToReplace = this.path.countries.indexOf(countryPathsToReplace[i]);
        if (!countryPathSingleOrArray[i].hasInterestPoints()) {
          countryPathsToReplace[i].removeFromLinkedList();
          this.path.countries.splice(indexOfToReplace, 1);
        } else {
          this.path.countries.splice(indexOfToReplace, 1, countryPathSingleOrArray[i]);
        }
      }

      return this.pathRepositoryService.savePath(this.path).map(
        returnedPath => {
          this.path = returnedPath;
          this.pathEventChannel.next(returnedPath);
          this.contryPathEventChannel.next(countryPathSingleOrArray);
        }
      );
    }

  }

  private addInterestPointToCountryPath(countryPath: CountryPath, newInterestPoint: InterestPoint): Observable<void> {

    let countryId = countryPath.countryid;
    let lastCountryPath = this.path.countries[this.path.countries.length - 1];
    if (countryId === lastCountryPath.countryid) {
      lastCountryPath.interestPoints.push(newInterestPoint);
    } else {
      let newCountryPath = this.createNewCountryPath(countryId, [newInterestPoint]);
      this.path.countries.push(newCountryPath);
    }

    return this.pathRepositoryService.savePath(this.path).map(
      returnedPath => {
        this.path = returnedPath;
        this.pathEventChannel.next(returnedPath);
        this.contryPathEventChannel.next(this.path.countries.filter(_countryPath => _countryPath.countryid === countryId));
      }
    );
  }

  private createNewCountryPath(countryId: string, newInterestPoints: InterestPoint[]): CountryPath {
    let newCountryPath = new CountryPath(countryId, newInterestPoints);
    if (this.path.countries[this.path.countries.length - 1]) {
      this.path.countries[this.path.countries.length - 1].followedBy(newCountryPath);
      newCountryPath.preceededBy(this.path.countries[this.path.countries.length - 1]);
    }
    return newCountryPath;
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
    this.router.navigateByUrl('/trips/' + path._id + '(nav-section:trips)');

    return of(null);
  }

  onActivePathModified(): Observable<Path> {
    return this.pathEventChannel.asObservable();
  }

  onCountryPathModified(): Observable<Array<CountryPath>> {
    return this.contryPathEventChannel.asObservable()
      .filter(paths => {
        return paths !== null && paths !== undefined;
      });
  }
}
