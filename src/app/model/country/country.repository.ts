import { Observable } from 'rxjs/Rx';
import { Country } from '../../model/country/country';

export interface CountryRepository {
  loadCountries(): Observable<Array<Country>>;
  getCountry(countryId: string): Observable<Country>;
  saveCountry(country: Country): void;
  saveCountryWithPath(country: Country, path: any): void;
}
