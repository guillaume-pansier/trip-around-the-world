import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Country } from '../model/country/country';
import { CountryPath } from '../model/paths/country-path';
import { InterestPoint } from '../model/paths/interest-point';
import { STATE_HANDLER_TOKEN } from '../constants';
import { ApplicationStateHandler } from '../application-state/application-state-handler';
import { OverlayRepositoryService } from './overlay-repository/overlay-repository.service';
import { GeoCoder } from '@ngui/map';
import { Subscription } from 'rxjs';
import { of } from 'rxjs/observable/of';


declare var google: any;

const GMAPS_ADRS_TPE = ['point_of_interest',
  'neighborhood',
  'colloquial_area',
  'administrative_area_level_2',
  'administrative_area_level_1'];

const worldLayer = `[[-180, -85],
                [-180, 85],
                [0, 85],
                [180, 85],
                [180, -85],
                [0, -85],
                [-180, -85]]`;

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.css'],
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  initialized = false;
  country: Country;
  private countryPath: CountryPath;
  private positions: Array<any> = [];
  private polylinePaths: Array<any> = [];
  mapProps: any = {
    center: 'some-invalid-location',
  };
  countryChangeObserver: Subscription;

  constructor(private route: ActivatedRoute,
    private overlayRepository: OverlayRepositoryService,
    private router: Router,
    private geocoder: GeoCoder,
    @Inject(STATE_HANDLER_TOKEN) private stateHandler: ApplicationStateHandler,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {


    this.stateHandler.onCountryClicked()
      .map(country => {
        return country;
      })
      .find(country => country != null)
      .flatMap((country: Country) => {
        this.country = country;
        return this.geocoder.geocode({ 'address': country.name, 'region': country.id });
      })
      .map(locations => {
        return {
          'center': {
            'lat': locations[0].geometry.location.lat(),
            'lng': locations[0].geometry.location.lng()
          },
          'bounds': locations[0].geometry.viewport,
        };
      }).subscribe(
      (props) => {
        this.mapProps = props;
        this.initialized = true;
      });

    this.countryChangeObserver = this.stateHandler.onCountryPathModified().subscribe(
      (latestPath) => {
        if (latestPath) {
          this.countryPath = latestPath;
          this.positions = [];
          this.polylinePaths = [];
          this.populateMarkers(latestPath);
          this.connectMarkers(latestPath);
          this.ref.detectChanges();
        }
      }
    );
  }


  onMapReady(map) {
    this.fitBounds(map);
    map.addListener('dblclick', this.onMapDbClick.bind(this));
    let data_layer = new google.maps.Data({ map: map });
    data_layer.setStyle({ // using set style we can set styles for all boundaries at once
      fillColor: 'white',
      strokeWeight: 0.1,
      fillOpacity: 0.7
    });

    this.overlayRepository.getOverlayForCountryId(this.country.id)
      .subscribe((countryLayer) => {
        let layer = '[' + worldLayer + ',' + countryLayer + ']';
        let geoJson = {
          'type': 'Feature',
          'id': this.country.id,
          'properties': { 'name': this.country.id }, 'geometry': { 'type': 'Polygon', 'coordinates': JSON.parse(layer) }
        };
        data_layer.addGeoJson(geoJson);
      });

  }

  fitBounds(map) {
    if (this.initialized) {
      map.fitBounds(this.mapProps.bounds);
      this.ref.detectChanges();
    } else {
      setTimeout(() => this.fitBounds(map), 10);
    }
  }


  onMapDbClick(event) {
    this.geocoder.geocode({ 'location': event.latLng })
      .flatMap((results) => {
        if (results[1]) {
          return of(this.findCorrectMarkerName.bind(this)(results, event.latLng));
        } else {
          return Observable.throw(new Error('No results found'));
        }
      })
      .flatMap(name => {
        this.countryPath.interestPoints.push(new InterestPoint(name, JSON.stringify(event.latLng)));
        return this.stateHandler.modifyCountryPath(this.countryPath);
      })
      .subscribe(() => { },
      (error) => {
        alert('An error occured. Please try later');
        console.log(error);
      },
      () => { });

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


  onPolyLineReady(polyline) {
    polyline.setOptions({ icons: [{ icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW }, offset: '100%' }] });
  }

  private populateMarkers(countryPath: CountryPath) {
    for (let pathPoint of countryPath.interestPoints) {
      let position = JSON.parse(pathPoint.coordinates);
      this.positions.push([position.lat, position.lng]);
    }
  }

  private connectMarkers(countryPath: CountryPath) {
    // connect previous country to first interestPoint
    let previousCountry = this.countryPath.getPreviousCountry();
    if (previousCountry && previousCountry.hasInterestPoints() && this.countryPath.hasInterestPoints()) {
      console.log(previousCountry.countryid);
      let polylinePoint: any = {};
      polylinePoint.lat = JSON.parse(previousCountry.interestPoints[previousCountry.interestPoints.length - 1].coordinates).lat;
      polylinePoint.lng = JSON.parse(previousCountry.interestPoints[previousCountry.interestPoints.length - 1].coordinates).lng;

      let polylinePoint2: any = {};
      polylinePoint2.lat = JSON.parse(countryPath.interestPoints[0].coordinates).lat;
      polylinePoint2.lng = JSON.parse(countryPath.interestPoints[0].coordinates).lng;

      this.polylinePaths.push([polylinePoint, polylinePoint2]);
    }

    for (let index = 0; index < countryPath.interestPoints.length - 1; index++) {
      let polylinePoint: any = {};
      polylinePoint.lat = JSON.parse(countryPath.interestPoints[index].coordinates).lat;
      polylinePoint.lng = JSON.parse(countryPath.interestPoints[index].coordinates).lng;

      let polylinePoint2: any = {};
      polylinePoint2.lat = JSON.parse(countryPath.interestPoints[index + 1].coordinates).lat;
      polylinePoint2.lng = JSON.parse(countryPath.interestPoints[index + 1].coordinates).lng;

      this.polylinePaths.push([polylinePoint, polylinePoint2]);
    }
  }

  ngOnDestroy() {
    this.countryChangeObserver.unsubscribe();
    // here you need to cancel the changes that you make and cause the `this.ref.detectChanges()` to be called.
    this.ref.detach(); // try this
    // this.authObserver.unsubscribe(); // for me I was detect changes inside "subscribe" so was enough for me to just unsubscribe;
  }
}
