import { Injectable } from '@angular/core';
import { Country } from '../model/country/country';
import { ApplicationStateHandler } from './application-state-handler';
import { Router } from '@angular/router';


@Injectable()
export class DefaultApplicationStateHandlerService implements ApplicationStateHandler {

  constructor(private router: Router) { }

  countryClicked(country: Country) {
        this.router.navigateByUrl('/country/' + country.id + '(test-name:country/' + country.id + ')');
  }
}
