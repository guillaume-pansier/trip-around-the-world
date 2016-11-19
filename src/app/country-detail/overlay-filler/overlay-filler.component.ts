import { Directive, OnInit, Input, OnChanges } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AgmCoreModule, GoogleMapsAPIWrapper, LatLng, LatLngBounds  } from 'angular2-google-maps/core';
import * as mapTypes from 'angular2-google-maps/core/services/google-maps-types';

declare var google:any;

const worldLayer = `[[-180, -85],
                [-180, 85],
                [0, 85],
                [180, 85],
                [180, -85],
                [0, -85],
                [-180, -85]]`;

@Directive({
  selector: 'app-overlay-filler'
})
export class OverlayFillerComponent implements OnInit,  OnChanges {



  @Input() private countryId: string;

  constructor(private mapsAPILoaderWrapper:GoogleMapsAPIWrapper,
              private http:Http) {
  }

  ngOnInit() {
    this.http.get('assets/countryFeatures.json')
      .map((res:Response) => res.json())
      .subscribe((jsonFeatures) => {
          this.mapsAPILoaderWrapper.getNativeMap().then(
            map => {

              let data_layer = new google.maps.Data({map: map});
              data_layer.setStyle({ //using set style we can set styles for all boundaries at once
                fillColor: 'white',
                strokeWeight: 0.1,
                fillOpacity: 0.7
              });

              let countryLayer = jsonFeatures[this.countryId];
              if(countryLayer){
                let layer = '[' + worldLayer + ',' + countryLayer + ']';
                let geoJson = {"type":"Feature","id":"AFG","properties":{"name":"Afghanistan"},"geometry":{"type":"Polygon","coordinates": JSON.parse(layer)}};
                data_layer.addGeoJson(geoJson);
              }
              else console.error('layer not found for country: ' + this.countryId);

            }
          )
        },
        (error) => console.error('Could not find layer data: ' + error));
  }

  ngOnChanges(changes:any):void {

  }


}
