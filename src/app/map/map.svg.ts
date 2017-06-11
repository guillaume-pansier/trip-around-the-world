import { Component, Inject, OnInit, AfterViewInit, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Country } from '../model/country/country';
import { Path } from '../model/paths/path';
import { STYLE_CLASS_NORMAL, STYLE_CLASS_HOVER, STYLE_CLASS_VISITED } from './country.svg';
import { CountryRepository } from '../model/country/country.repository';
import { CONTRY_REPO_TOKEN } from '../model/country/country.repository.constants';
import { Observable, Subscription } from 'rxjs/Rx';
import { STATE_HANDLER_TOKEN } from '../constants';
import { ApplicationStateHandler } from '../application-state/application-state-handler';
import { CountrySVGComponent } from './country.svg';



@Component({
  selector: 'app-map-svg',
  templateUrl: 'map.svg.html',
  styleUrls: ['map.svg.css']
})
export class MapSVGComponent implements OnInit, AfterViewInit {

  countries: Country[];
  private activePath: Path;
  @ViewChildren(CountrySVGComponent) svgCountries: QueryList<CountrySVGComponent>;

  constructor( @Inject(DOCUMENT) private document, @Inject(CONTRY_REPO_TOKEN) private countryRepository: CountryRepository,
    @Inject(STATE_HANDLER_TOKEN) private stateHandler: ApplicationStateHandler) {

  }

  ngOnInit(): void {

    this.countryRepository.loadCountries()
      .map((countries => {
        this.countries = countries;
        return this.countries;
      }))
      .subscribe(() => { },
      () => { },
      () => { });

  }

  ngAfterViewInit(): void {

    if (this.countries && this.countries.length > 0) {
      this.loadActivePath().subscribe(() => { },
        () => { },
        () => { });
    } else {
      this.svgCountries.changes
        .flatMap((countries) => this.loadActivePath())
        .subscribe(() => { },
        () => { },
        () => { });
    }
  }

  private loadActivePath(): Observable<void> {
    return this.stateHandler.onActivePathModified()
      .filter(path => path !== null)
      .map(path => {
        if (this.activePath) {
          this.removePreviousActivePath(this.activePath);
        }
        this.activePath = path;
        this.colorCountriesFromPath(path);
      });
  }

  onClickCountry(country: Country) {
    this.stateHandler.clicCountry(country);
  }

  onHoverCountry(country: Country) {
    this.changeCountryStyle(country.id, STYLE_CLASS_NORMAL, STYLE_CLASS_HOVER);
  }

  onLeaveCountry(country: Country) {
    this.changeCountryStyle(country.id, STYLE_CLASS_HOVER, STYLE_CLASS_NORMAL);
  }

  colorCountriesFromPath(path: Path) {
    if (path) {
      for (let countryPath of path.countries) {
        if (countryPath.interestPoints && countryPath.interestPoints.length > 0) {
          this.addCountryStyle(countryPath.countryid, STYLE_CLASS_VISITED);
        }
      }
    }
  }

  removePreviousActivePath(path: Path) {
    for (let countryPath of path.countries) {
      this.removeCountryStyle(countryPath.countryid, STYLE_CLASS_VISITED);
    }
  }

  private changeCountryStyle(countryId, initialState, goalState) {
    let countryContainer = this.document.getElementById(countryId);
    this.swapStyle(countryContainer, initialState, goalState);

    for (let child of countryContainer.children) {
      this.swapStyle(child, initialState, goalState);
    }
  }

  private swapStyle(element, styleToRemove, styleToAdd) {
    if (element.classList.contains(styleToRemove)) {
      element.classList.remove(styleToRemove);
      element.classList.add(styleToAdd);
    }
  }

  private addCountryStyle(countryId, style) {
    let countryContainer = this.document.getElementById(countryId);
    countryContainer.classList.add(style);
    for (let child of countryContainer.children) {
      child.classList.add(style);
    }
  }

  private removeCountryStyle(countryId, style) {
    let countryContainer = this.document.getElementById(countryId);
    countryContainer.classList.remove(style);
    for (let child of countryContainer.children) {
      child.classList.remove(style);
    }
  }
}
