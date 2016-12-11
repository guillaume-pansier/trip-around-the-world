import { Directive, OnInit, Input, OnChanges } from '@angular/core';
import { Http } from '@angular/http';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { OverlayRepositoryService } from '../overlay-repository/overlay-repository.service'

declare var google: any;

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
export class OverlayFillerDirective implements OnInit, OnChanges {



  @Input() private countryId: string;

  constructor(private mapsAPILoaderWrapper: GoogleMapsAPIWrapper,
    private http: Http,
    private overlayRepository: OverlayRepositoryService) {
  }

  ngOnInit() {
    this.overlayRepository.getOverlayForCountryId(this.countryId)
      .subscribe((countryLayer) => {
        if (!countryLayer) {
          console.error('layer not found for country: ' + this.countryId);
          return;
        }
        this.mapsAPILoaderWrapper.getNativeMap().then(
          map => {
            let data_layer = new google.maps.Data({ map: map });
            data_layer.setStyle({ // using set style we can set styles for all boundaries at once
              fillColor: 'white',
              strokeWeight: 0.1,
              fillOpacity: 0.7
            });

            let layer = '[' + worldLayer + ',' + countryLayer + ']';
            let geoJson = {
              'type': 'Feature',
              'id': this.countryId,
              'properties': { 'name': this.countryId }, 'geometry': { 'type': 'Polygon', 'coordinates': JSON.parse(layer) }
            };
            data_layer.addGeoJson(geoJson);

          }
        )
      },
      (error) => console.error('Could not find layer data: ' + error));
  }

  ngOnChanges(changes: any): void {

  }


}