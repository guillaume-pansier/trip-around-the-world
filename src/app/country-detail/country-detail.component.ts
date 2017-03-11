import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader, LatLngBounds } from 'angular2-google-maps/core';
import { Observable } from 'rxjs/Rx';
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
  countryId: Observable<string>;
  zoomCanBeInitialized = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    @Inject(STATE_HANDLER_TOKEN) private stateHandler: ApplicationStateHandler) { }

  ngOnInit() {

    let self = this;

    this.stateHandler.onCountryClicked()
      .find(country => country != null)
      .subscribe((country: Country) => {
        this.country = country;

        self.mapsAPILoader.load().then(() => {
          let geocoder = new google.maps.Geocoder();

          geocoder.geocode({ 'address': self.country.name, 'language': 'en', 'region': self.country.id }, function (results, status) {

            if (status === google.maps.GeocoderStatus.OK) {
              self.lat = results[0].geometry.location.lat();
              self.lng = results[0].geometry.location.lng();
              self.bounds = results[0].geometry.viewport;
              self.zoomCanBeInitialized = true;

            } else {
              alert('Could not find location: ' + self.country.name);
            }
          });
        });
      });

  }

}
