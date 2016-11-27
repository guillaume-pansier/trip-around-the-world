import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MapsAPILoader, LatLngBounds  } from 'angular2-google-maps/core';

import { CONTRY_REPO_TOKEN } from '../map/repository/country.repository.constants';
import { CountryRepository } from '../map/repository/country.repository';
import { Country } from '../map/model/country';

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

  constructor( private route: ActivatedRoute,
               private router: Router,
               private mapsAPILoader: MapsAPILoader,
               @Inject(CONTRY_REPO_TOKEN) private countryRepository: CountryRepository) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let id = params['id'];
      this.countryRepository.getCountry(id).subscribe((country: Country) =>{
        this.country = country;
      });
    });

    let self = this;
    this.mapsAPILoader.load().then(() =>
    {
      let geocoder = new google.maps.Geocoder();

      geocoder.geocode( { 'address': this.country.name, 'language': 'en', 'region': this.country.id }, function(results, status) {

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
