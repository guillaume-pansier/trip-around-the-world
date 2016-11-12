import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { Country } from './model/country.ts';
import { STYLE_CLASS_NORMAL, STYLE_CLASS_HOVER } from './country.svg';
import { CountryRepository } from './repository/country.repository';
import { CONTRY_REPO_TOKEN } from './repository/country.repository.constants';
import { Observable } from 'rxjs/Rx';
/*import { ChangeDetectorRef } from '@angular/core';*/


@Component({
  selector: 'app-map-svg',
  templateUrl: 'map.svg.html',
  styleUrls: ['map.svg.css']
})
export class MapSVGComponent implements OnInit {

  private countriesObservable: Observable<Array<Country>>;

  constructor(@Inject(DOCUMENT) private document, @Inject(CONTRY_REPO_TOKEN) private countryRepository: CountryRepository,
              private router: Router) {

  }

  ngOnInit(): void {
    this.countriesObservable = this.countryRepository.loadCountries();
  }

  clickMe(country: Country) {
    this.router.navigate(['/country', country.id]);
  }

  onHoverCountry(country: Country) {
    this.changeCountryStyle(country.id, STYLE_CLASS_NORMAL, STYLE_CLASS_HOVER);
  }

  onLeaveCountry(country: Country) {
    this.changeCountryStyle(country.id, STYLE_CLASS_HOVER, STYLE_CLASS_NORMAL);
  }

  private changeCountryStyle(countryId, initialState, goalState) {
    let countryContainer = this.document.getElementById(countryId);
    this.swapStyle(countryContainer, initialState, goalState);

    for (let child of countryContainer.children) {
      this.swapStyle(child, initialState, goalState);
    }
  }

  private swapStyle(child, styleToRemove, styleToAdd) {
    if (child.classList.contains(styleToRemove)) {
      child.classList.remove(styleToRemove);
      child.classList.add(styleToAdd);
    }
  }
}
