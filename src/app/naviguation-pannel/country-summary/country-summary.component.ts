import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { InterestPoint } from '../../model/paths/interest-point';
import { STATE_HANDLER_TOKEN } from '../../constants';
import { ApplicationStateHandler } from '../../application-state/application-state-handler';
import { CountryPath } from '../../model/paths/country-path';
import { CONTRY_REPO_TOKEN } from '../../model/country/country.repository.constants';
import { CountryRepository } from '../../model/country/country.repository';
import { Country } from '../../model/country/country';

@Component({
  selector: 'app-country-summary',
  templateUrl: './country-summary.component.html',
  styleUrls: ['./country-summary.component.css']
})
export class CountrySummaryComponent implements OnInit, OnDestroy {

  countryPaths: CountryPath[];
  private countryChangeObserver;

  constructor( @Inject(STATE_HANDLER_TOKEN) private applicationStateHandler: ApplicationStateHandler,
    @Inject(CONTRY_REPO_TOKEN) private countryRepository: CountryRepository,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.countryChangeObserver = this.applicationStateHandler.onCountryPathModified().subscribe(
      countryPaths => {
        this.countryPaths = countryPaths;
        this.ref.detectChanges();
      }
    );
  }

  onCountryPathChange(interestPoints: Array<InterestPoint>, countryPath: CountryPath) {
    countryPath.interestPoints = interestPoints;
    this.applicationStateHandler.modifyCountryPath(this.countryPaths)
      .subscribe(() => { },
      (error) => {
        console.error(error);
        alert('Your modification could not be saved. Please retry later.');
      });
  }

  onCountryPathSelected(countryPath: CountryPath) {
    this.getCountryOfCountryPath(this.countryPaths[0]).subscribe(
      (country: Country) => this.applicationStateHandler.leaveCountry(country),
      error => console.error(error)
    );
    this.getCountryOfCountryPath(countryPath).subscribe(
      (country: Country) => this.applicationStateHandler.clicCountry(country),
      error => console.error(error)
    );
  }

  getCountryOfCountryPath(countryPath: CountryPath){
    return this.countryRepository.getCountry(countryPath.countryid);
  }

  ngOnDestroy() {
    this.countryChangeObserver.unsubscribe();
    // here you need to cancel the changes that you make and cause the `this.ref.detectChanges()` to be called.
    this.ref.detach(); // try this
  }
}
