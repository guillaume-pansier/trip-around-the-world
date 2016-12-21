import { Country } from '../model/country/country';
import { CountryPath } from '../model/paths/country-path';
import { Observable } from 'rxjs/Rx';
import { Path } from '../model/paths/path';



export interface ApplicationStateHandler {
    clicCountry(country: Country): void;

    onCountryClicked(): Observable<Country>;

    modifyPath(path: Path): Observable<void>;

    onPathModified(): Observable<Path>;

    modifyCountryPath(countryPath: CountryPath): Observable<void>;

    onCountryPathModified(): Observable<CountryPath>;
}
