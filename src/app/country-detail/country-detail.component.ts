import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader, LatLngBounds } from 'angular2-google-maps/core';
import { Observable } from 'rxjs/Rx';
import { Country } from '../model/country/country';
import { CountryPath } from '../model/paths/country-path';

import { STATE_HANDLER_TOKEN } from '../constants';
import { ApplicationStateHandler } from '../application-state/application-state-handler';

declare var google: any;


@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.css'],
})
export class CountryDetailComponent implements OnInit {
  lat: number;
  lng: number;
  bounds: LatLngBounds;
  country: Country;
  countryId: Observable<string>;
  zoomCanBeInitialized = false;
  private nbMarkers = 0;
  private markers: Array<any> = [];
  private polylinePoints: Array<any> = [];


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

    this.stateHandler.onCountryPathModified().share().subscribe(
      (latestPath) => {
        if (latestPath && this.nbMarkers !== latestPath.interestPoints.length) {
          this.nbMarkers = latestPath.interestPoints.length;
          this.markers = [];
          this.polylinePoints = [];
          this.populateMarkers(latestPath);
          this.connectMarkers(latestPath);
        }
      }
    );
  }

  private populateMarkers(countryPath: CountryPath) {
    for (let pathPoint of countryPath.interestPoints) {
      let position = JSON.parse(pathPoint.coordinates);
      let marker: any = {};
      marker.lat = position.lat;
      marker.lng = position.lng;
      this.markers.push(marker);
    }
  }

  private connectMarkers(countryPath: CountryPath) {
    for (let index = 0; index < countryPath.interestPoints.length; index++) {
      let polylinePoint: any = {};
      polylinePoint.lat = JSON.parse(countryPath.interestPoints[index].coordinates).lat;
      polylinePoint.lng = JSON.parse(countryPath.interestPoints[index].coordinates).lng;

      this.polylinePoints.push(polylinePoint);
      /*
       this.googleMapsAPIWrapper.createPolyline({
         path: [JSON.parse(this.path.interestPoints[index].coordinates), JSON.parse(this.path.interestPoints[index + 1].coordinates)]
       });*/
    }
  }
}
