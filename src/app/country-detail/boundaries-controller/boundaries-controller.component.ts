import { Directive, OnInit, Input, OnChanges } from '@angular/core';
import { GoogleMapsAPIWrapper, LatLng, LatLngBounds } from 'angular2-google-maps/core';
import * as mapTypes from 'angular2-google-maps/core/services/google-maps-types';

declare var google: any;

@Directive({
  selector: 'app-boundaries-controller'
})
export class PanControllerComponent implements OnInit, OnChanges {

  @Input() bounds: LatLngBounds;
  @Input() zoomCanBeInitialized: boolean;
  lastValidCenter: LatLng;

  constructor(private mapsAPILoaderWrapper: GoogleMapsAPIWrapper) { }

  ngOnInit() {

  }

  ngOnChanges(changes: any): void {
    if (changes.zoomCanBeInitialized && changes.zoomCanBeInitialized.currentValue) {
      this.mapsAPILoaderWrapper.getNativeMap().then((map: any) => {
        let initialZoom = map.getZoom();
        map.setOptions({ 'minZoom': initialZoom });
      });
    }

    if (changes.bounds && changes.bounds.currentValue) {
      this.mapsAPILoaderWrapper.subscribeToMapEvent('center_changed').subscribe(() => {
        this.mapsAPILoaderWrapper.getCenter()
          .then((center) => {
            if (this.bounds.contains(center)) {
              this.lastValidCenter = center;
            } else {
              this.mapsAPILoaderWrapper.panTo(this.lastValidCenter);
            }
          })
      });

    }
  }


}
