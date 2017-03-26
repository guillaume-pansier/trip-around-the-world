import { CountryPath } from './country-path';

export class Path {

    public _id: string;

    constructor(public name: string, public countries: Array<CountryPath>) { };
}
