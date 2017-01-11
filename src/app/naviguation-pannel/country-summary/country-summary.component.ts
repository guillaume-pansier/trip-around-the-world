import { Component, OnInit, Inject } from '@angular/core';
import { InterestPoint } from '../../model/paths/interest-point';
import { STATE_HANDLER_TOKEN } from '../../constants';
import { ApplicationStateHandler } from '../../application-state/application-state-handler';
import { CountryPath } from '../../model/paths/country-path';

@Component({
  selector: 'app-country-summary',
  templateUrl: './country-summary.component.html',
  styleUrls: ['./country-summary.component.css']
})
export class CountrySummaryComponent implements OnInit {

  private countryPath: CountryPath;

  constructor( @Inject(STATE_HANDLER_TOKEN) private applicationStateHandler: ApplicationStateHandler) { }

  ngOnInit() {
    this.applicationStateHandler.onCountryPathModified().subscribe(
      countryPath => {
        this.countryPath = countryPath;
      }
    );
  }

  onCountryPathChange(interestPoints: Array<InterestPoint>) {
    this.countryPath.interestPoints = interestPoints;
    this.applicationStateHandler.modifyCountryPath(this.countryPath)
    .subscribe(() => {},
    (error) => {
      console.error(error);
      alert('Your modification could not be saved. Please retry later.');
    });
  }

}
