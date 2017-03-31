import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { InterestPoint } from '../../model/paths/interest-point';
import { STATE_HANDLER_TOKEN } from '../../constants';
import { ApplicationStateHandler } from '../../application-state/application-state-handler';
import { CountryPath } from '../../model/paths/country-path';

@Component({
  selector: 'app-country-summary',
  templateUrl: './country-summary.component.html',
  styleUrls: ['./country-summary.component.css']
})
export class CountrySummaryComponent implements OnInit, OnDestroy {

  private countryPath: CountryPath;
  private countryChangeObserver;

  constructor( @Inject(STATE_HANDLER_TOKEN) private applicationStateHandler: ApplicationStateHandler,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.countryChangeObserver = this.applicationStateHandler.onCountryPathModified().subscribe(
      countryPath => {
        this.countryPath = countryPath;
        this.ref.detectChanges();
      }
    );
  }

  onCountryPathChange(interestPoints: Array<InterestPoint>) {
    this.countryPath.interestPoints = interestPoints;
    this.applicationStateHandler.modifyCountryPath(this.countryPath)
      .subscribe(() => { },
      (error) => {
        console.error(error);
        alert('Your modification could not be saved. Please retry later.');
      });
  }

  ngOnDestroy() {
    this.countryChangeObserver.unsubscribe();
    // here you need to cancel the changes that you make and cause the `this.ref.detectChanges()` to be called.
    this.ref.detach(); // try this
    // this.authObserver.unsubscribe(); // for me I was detect changes inside "subscribe" so was enough for me to just unsubscribe;
  }
}
