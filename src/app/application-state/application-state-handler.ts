import { Country } from '../model/country/country';

export interface ApplicationStateHandler {
    countryClicked(country: Country);
}
