import { InterestPoint } from './interest-point';

export class CountryPath {
    public linkedCountry: CountryPath;
    public countryid;

    constructor(countryidOrObject: any, public interestPoints?: Array<InterestPoint>) {
        if (interestPoints) {
            this.countryid = countryidOrObject;
        } else {
            this.countryid = countryidOrObject.countryid;
            this.interestPoints = countryidOrObject.interestPoints;
        }

    };

    public preceededBy(countryPath: CountryPath) {
        this.linkedCountry = countryPath;
    }

    public getPreviousCountry(): CountryPath {
        return this.linkedCountry;
    }

    public hasInterestPoints(): boolean {
        return this.interestPoints && this.interestPoints.length > 0;
    }
}
