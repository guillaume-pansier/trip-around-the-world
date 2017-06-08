import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CountryRepository } from './country.repository';

// Import RxJs required methods
import { zip } from 'rxjs/observable/zip';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Country } from '../../model/country/country';
import { Config } from '../../config/config';

@Injectable()
export class CountryRepositoryService implements CountryRepository {

  private countries: Array<Country> = [];

  constructor(private http: Http, private config: Config) {

  };


  getCountry(countryId: string): Observable<Country> {

    return this.loadCountries().map((countryArray) => {

      for (let country of countryArray) {
        if (countryId === country.id) {
          return country;
        }
      }

      return undefined;
    });
  }

  loadCountries(): Observable<Array<Country>> {

    if (this.countries.length !== 0) {
      return Observable.of(this.countries);
    }

    return zip(this.fetchRawSVGContries(), this.fetchCountryCodes(),
      (xmlDocument, codeList) => {
        let xmlJsonConverter = require('xml-js');
        let countriesJson = xmlJsonConverter.xml2js(xmlDocument, {compact: false, spaces: 4});

        for (let countryJson of countriesJson.elements[0].elements) {

          if (countryJson.name !== 'g') {
            continue;
          }

          this.countries.push(this.parseCountry(countryJson, codeList, xmlJsonConverter));
        }

        return this.countries;
      }
    );
  }

  private parseCountry(countryJson, codeList, convert): Country {
    let countryId: string = countryJson.attributes.id.toUpperCase();
    let countryName = codeList[countryId];

    for (let subElement of countryJson.elements) {
      this.addSubElementTitle(subElement, countryId, codeList);
    }

    let countrySvgContent = '<title id="title_' + countryId + '">' + countryName + '</title>\n>';
    countrySvgContent += convert.js2xml(countryJson, {compact: false, spaces: 4});
    return new Country(countrySvgContent, countryId, countryName);

  };

  private addSubElementTitle(subElement, countryId, codeList) {
    let subElementId = subElement.attributes ? subElement.attributes.id.toUpperCase() : undefined;
    if (subElementId && subElementId !== countryId) {
      if (codeList[subElementId]) {
        subElement.elements.push(
          {
            name: 'title',
            type: 'element',
            elements: [
              {
                text: codeList[subElementId],
                type: 'text'
              }
            ]
          });
      }
    }
    return subElementId;
  };

  fetchRawSVGContries(): Observable<XMLDocument> {

    return this.http.get(this.config.get('svgUrl'))
      .map((res: Response) => res.text())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  fetchCountryCodes(): Observable<JSON> {

    return this.http.get(this.config.get('countryCodesUrl'))
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  saveCountry(country: Country): void {

  }

  saveCountryWithPath(country: Country, path: any): void {

  };
}
