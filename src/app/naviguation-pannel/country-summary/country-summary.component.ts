import { Component, OnInit, Inject } from '@angular/core';
import { InterestPoint } from '../../model/paths/interest-point';
import { Observable } from 'rxjs/Rx';
import { STATE_HANDLER_TOKEN } from '../../constants';
import { ApplicationStateHandler } from '../../application-state/application-state-handler';

@Component({
  selector: 'app-country-summary',
  templateUrl: './country-summary.component.html',
  styleUrls: ['./country-summary.component.css']
})
export class CountrySummaryComponent implements OnInit {

  private interestPoints: Observable<Array<InterestPoint>>;

  constructor( @Inject(STATE_HANDLER_TOKEN) private applicationStateHandler: ApplicationStateHandler) { }

  ngOnInit() {
    this.interestPoints = this.applicationStateHandler.onCountryPathModified().map(
      countryPath => countryPath.interestPoints
    );
  }

}
