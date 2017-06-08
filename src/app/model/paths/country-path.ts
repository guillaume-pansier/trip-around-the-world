import { InterestPoint } from './interest-point';

export class CountryPath {
  public previousCountry: CountryPath;
  public nextCountry: CountryPath;
  public countryid;

  constructor(countryidOrObject: any, public interestPoints?: Array<InterestPoint>) {
    if (interestPoints) {
      this.countryid = countryidOrObject;
    } else {
      this.countryid = countryidOrObject.countryid;
      this.interestPoints = countryidOrObject.interestPoints;
    }

  };

  toJSON(): any {
    return {
      'countryid': this.countryid,
      'interestPoints': this.interestPoints
    };
  }

  preceededBy(countryPath: CountryPath) {
    this.previousCountry = countryPath;
  }

  followedBy(countryPath: CountryPath) {
    this.nextCountry = countryPath;
  }

  getPreviousCountry(): CountryPath {
    return this.previousCountry;
  }

  getNextCountry(): CountryPath {
    return this.nextCountry;
  }

  hasInterestPoints(): boolean {
    return this.interestPoints && this.interestPoints.length > 0;
  }

  removeFromLinkedList() {
    if (this.nextCountry) {
      this.nextCountry.preceededBy(this.previousCountry);
    }
    if (this.previousCountry) {
      this.previousCountry.followedBy(this.nextCountry);
    }
  }
}
