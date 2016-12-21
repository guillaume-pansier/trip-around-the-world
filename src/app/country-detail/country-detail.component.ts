import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader, LatLngBounds } from 'angular2-google-maps/core';

import { Country } from '../model/country/country';

import { STATE_HANDLER_TOKEN } from '../constants';
import { ApplicationStateHandler } from '../application-state/application-state-handler';

declare var google: any;

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.css']
})
export class CountryDetailComponent implements OnInit {
  lat: number;
  lng: number;
  bounds: LatLngBounds;
  country: Country;
  zoomCanBeInitialized = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    @Inject(STATE_HANDLER_TOKEN) private stateHandler: ApplicationStateHandler) { }

  ngOnInit() {
    this.stateHandler.onCountryClicked()
      .subscribe((country: Country) => this.country = country);


    let self = this;
    this.mapsAPILoader.load().then(() => {
      let geocoder = new google.maps.Geocoder();

      geocoder.geocode({ 'address': this.country.name, 'language': 'en', 'region': this.country.id }, function (results, status) {

        if (status === google.maps.GeocoderStatus.OK) {
          self.lat = results[0].geometry.location.lat();
          self.lng = results[0].geometry.location.lng();
          self.bounds = results[0].geometry.viewport;
          self.zoomCanBeInitialized = true;

        } else {
          alert('Could not find location: ' + location);
        }
      });
    });

  }

}
