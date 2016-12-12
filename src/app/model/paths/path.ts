import { CountryPath } from './country-path';

export class Path {

    public _id: string;

    constructor(public countries: Array<CountryPath>) { };
}
