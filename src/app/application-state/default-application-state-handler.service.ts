import { Injectable } from '@angular/core';
import { Country } from '../model/country/country';
import { Path } from '../model/paths/path';
import { CountryPath } from '../model/paths/country-path';
import { ApplicationStateHandler } from './application-state-handler';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/Rx';
import { PathRepositoryService } from '../model/paths/path-repository.service';



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


    this.pathRepositoryService.getPaths()
      .defaultIfEmpty(new Path([new CountryPath(country.id, [])]))
      .subscribe((path: Path) => {
        let resultPath = path;
        let countryPath = resultPath.countries.find(pathCountry => pathCountry.countryid === country.id);
        if (!countryPath) {
          countryPath = new CountryPath(country.id, []);
          resultPath.countries.push(countryPath);
        }

        this.path = resultPath;
        this.countryPath = countryPath;
        this.pathEventChannel.next(resultPath);
        this.contryPathEventChannel.next(countryPath);
      },
      error => {
        this.pathEventChannel.error(error);
        this.contryPathEventChannel.error(error);
      },
      () => this.router.navigateByUrl('/country/' + country.id + '(nav-section:country/' + country.id + ')')
      );

  }

  modifyCountryPath(countryPath: CountryPath): Observable<void> {

    let indexForReplace = this.path.countries.findIndex(country => country.countryid === countryPath.countryid);
    this.path.countries.splice(indexForReplace, 1, countryPath);
    return this.pathRepositoryService.savePath(this.path).map(
      returnedPath => {
        this.path = returnedPath;
        this.pathEventChannel.next(returnedPath);
        this.contryPathEventChannel.next(countryPath);
      }
    );
  }

  onCountryClicked(): Observable<Country> {
    return this.countryEventChannel;
  }

  modifyPath(path: Path): Observable<void> {

    return this.pathRepositoryService.savePath(path)
      .map(savedPath => this.pathEventChannel.next(savedPath));
  }

  onPathModified(): Observable<Path> {
    return this.pathEventChannel;
  }

  onCountryPathModified(): Observable<CountryPath> {
    return this.contryPathEventChannel;
  }
}
