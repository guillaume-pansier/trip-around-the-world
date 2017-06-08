import { Country } from '../model/country/country';
import { CountryPath } from '../model/paths/country-path';
import { Observable } from 'rxjs/Rx';
import { Path } from '../model/paths/path';
import { InterestPoint } from '../model/paths/interest-point';



export interface ApplicationStateHandler {
    clicCountry(country: Country): void;

    onCountryClicked(): Observable<Country>;

    modifyPath(path: Path): Observable<Path>;

    selectPath(path: Path): Observable<void>;

    onActivePathModified(): Observable<Path>;

    modifyCountryPath(countryPaths: CountryPath[]): Observable<void>;
    modifyCountryPath(countryPaths: CountryPath, newInterestPoint: InterestPoint): Observable<void>;

    onCountryPathModified(): Observable<CountryPath[]>;
}
