import { Directive, Inject, Input, AfterContentInit } from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import * as mapTypes from 'angular2-google-maps/core/services/google-maps-types';
import { Observable } from 'rxjs/Rx';
import { CountryPath } from '../../model/paths/country-path';
import { InterestPoint } from '../../model/paths/interest-point';

import { STATE_HANDLER_TOKEN } from '../../constants';
import { ApplicationStateHandler } from '../../application-state/application-state-handler';

declare var google: any;

const GMAPS_ADRS_TPE = ['point_of_interest',
    'neighborhood',
    'colloquial_area',
    'administrative_area_level_2',
    'administrative_area_level_1'];

@Directive({
  selector: 'app-event-handler'
})
export class EventHandlerDirective implements AfterContentInit {

  private path: CountryPath;


  constructor(private googleMapsAPIWrapper: GoogleMapsAPIWrapper,
    @Inject(STATE_HANDLER_TOKEN) private applicationStateHandler: ApplicationStateHandler) { }

  ngAfterContentInit(): void {

    this.initPath().take(1).subscribe(
      () => { this.populateMarkers(this.path); },
      error => alert('cannot retrieve paths.' + error),
      () => this.populateMarkers(this.path)
    );


    this.googleMapsAPIWrapper.subscribeToMapEvent('dblclick').subscribe(
      (event: any) => {
        if (!this.path) {
          this.initPath().take(1).subscribe(
            () => {
              this.populateMarkers(this.path);
              this.savePathAndAddMarker(event.latLng);
            },
            error => {
              alert('cannot retrieve paths.' + error);
              return;
            }
          );
        } else {
          this.savePathAndAddMarker(event.latLng);
        }
      },
      error => console.log(error)
    );
  }

  private initPath(): Observable<void> {
    return this.applicationStateHandler.onCountryPathModified().map(
      (path: CountryPath) => {
        this.path = path;
      }
    );
  }

  private populateMarkers(countryPath: CountryPath) {
    for (let pathPoint of countryPath.interestPoints) {
      this.googleMapsAPIWrapper.createMarker({ position: JSON.parse(pathPoint.coordinates) });
    }
  }

  private savePathAndAddMarker(position: any) {

    this.googleMapsAPIWrapper.getNativeMap().then((googleMap: mapTypes.GoogleMap) => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'location': position }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            this.enrichAndPopulateNewMarker.bind(this)(results, position);
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
    });
  }

  private enrichAndPopulateNewMarker(results: any, position: any) {
    let markerName = this.findCorrectMarkerName.bind(this)(results);
    this.path.interestPoints.push(new InterestPoint(markerName, JSON.stringify(position)));
    this.applicationStateHandler.modifyCountryPath(this.path).subscribe(
      () => this.googleMapsAPIWrapper.createMarker({ position: position }),
      error => {
        this.path.interestPoints.pop();
        console.log('Could not save interest point', error);
        alert('Could not save interest point, please retry later.');
      }
    );
  }

  private findCorrectMarkerName(results: any): string {
    let address = this.findCorrectAddress.bind(this)(results);
    if (address) {
      return address.long_name;
    } else {
      window.alert('No results found');
    }
  }


  private findCorrectAddress(results: any) {
    for (let type of GMAPS_ADRS_TPE) {
      let address = results.find(this.isInterestPointAddressOfType.bind(this)(type));
      if (!address) {
        address = results.find(this.isInterestPointResult.bind(this)(type));
      }

      if (address) {
        return address.address_components.find(this.isInterestPointAddressOfType.bind(this)(type));
      }
    }
  }

  private isInterestPointResult(type: string) {
    return (result: any) => result.address_components &&
      result.address_components.find(this.isInterestPointAddressOfType.bind(this)(type));
  }


  private isInterestPointAddressOfType(type: string) {
    return (address: any) => address.types && (address.types.includes(type));
  }
}
