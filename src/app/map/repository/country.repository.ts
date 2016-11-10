import { Observable } from 'rxjs/Rx';
import { Country } from '../model/country';

export interface CountryRepository {
  loadCountries(): Observable<Array<Country>>;
  saveCountry(country: Country): void;
  saveCountryWithPath(country: Country, path: any): void;
}
