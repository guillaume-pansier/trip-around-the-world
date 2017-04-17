import { CountryPath } from './country-path';

export class Path {

    public _id: string;
    public name;

    constructor(nameOrObject: any, public countries?: Array<CountryPath>) {
        if (countries) {
            this.name = nameOrObject;
            this.countries = countries;
        } else {
            this.name = nameOrObject.name;
            this.countries = [];
            for (let country of nameOrObject.countries) {
                this.countries.push(new CountryPath(country));
            }
            this._id = nameOrObject._id;
        }
    };

}
