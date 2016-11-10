import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CountryRepository } from './country.repository';

// Import RxJs required methods
import { zip } from 'rxjs/observable/zip';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Country } from '../model/country';
import { Config } from '../../config/config';

@Injectable()
export class CountryRepositoryService implements CountryRepository {

  private countries:Array<Country> = [];

  constructor(private http:Http, private config:Config) {

  };


  loadCountries():Observable<Array<Country>> {

    if (this.countries.length !== 0) {
      return Observable.of(this.countries);
    }

    return zip(this.fetchRawSVGContries(), this.fetchCountryCodes(),
      (xmlDocument, codeList) =>{
        let convert = require('xml-js');
        let parsedResult = convert.xml2js(xmlDocument, {compact: false, spaces: 4});

        for (let countryJson of parsedResult.elements[0].elements) {

          if (countryJson.name !== 'g') {
            continue;
          }

          let countrySvgContent = convert.js2xml(countryJson, {compact: false, spaces: 4});
          let countryId: string = countryJson.attributes.id.toUpperCase();
          this.countries.push(new Country(countrySvgContent, countryId, codeList[countryId]));
        }
          return this.countries;
      }
    );
  }

  fetchRawSVGContries():Observable<XMLDocument> {

    return this.http.get(this.config.get('svgUrl'))
      .map((res:Response) => res.text())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  fetchCountryCodes():Observable<JSON> {

    return this.http.get(this.config.get('countryCodesUrl'))
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  saveCountry(country:Country):void {

  }

  saveCountryWithPath(country:Country, path:any):void {

  };
}
