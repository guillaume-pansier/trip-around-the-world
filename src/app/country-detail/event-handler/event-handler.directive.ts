import { Directive, OnInit, Input, AfterContentInit } from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { PathRepositoryService } from '../../paths/path-repository.service';
import { Path } from '../../paths/path';
import { CountryPath } from '../../paths/country-path';


@Directive({
  selector: 'app-event-handler'
})
export class EventHandlerDirective implements AfterContentInit {

  @Input() private countryId: string;

  private path: Path;


  constructor(private googleMapsAPIWrapper: GoogleMapsAPIWrapper, private pathRepositoryService: PathRepositoryService) { }

  ngAfterContentInit(): void {

    this.pathRepositoryService.getPaths().subscribe(
      path => {
        if (!path) {
          this.path = new Path([new CountryPath(this.countryId, [])]);
          return;
        }

        this.path = path;

        if (!this.path.countries.find(country => country.countryid === this.countryId)) {
          this.path.countries.push(new CountryPath(this.countryId, []));
          return;
        }

        this.populateMarkers(this.path.countries.find(country => country.countryid === this.countryId));
      },
    );

    this.googleMapsAPIWrapper.subscribeToMapEvent('dblclick')
      .subscribe((event: any) => {
        this.savePathAndAddMarker(event.latLng);
      },
      (error) => {
        console.log(error);
      });
  }


  private populateMarkers(countryPath: CountryPath) {
    for (let pathPoint of countryPath.coordinates) {
      this.googleMapsAPIWrapper.createMarker({ position: JSON.parse(pathPoint) });
    }
  }

  private savePathAndAddMarker(position: any) {
    this.path.countries.find(countryPath => countryPath.countryid === this.countryId)
      .coordinates
      .push(JSON.stringify(position));

    this.pathRepositoryService.savePath(this.path).subscribe(
      (path) => {
        this.path =  path;
      },
      (error) => {
        this.path.countries.find(countryPath => countryPath.countryid === this.countryId)
          .coordinates
          .pop();
        console.log('Could not save interest point', error);
        alert('Could not save interest point, please retry later.');
      },
      () => {
        this.googleMapsAPIWrapper.createMarker({ position: position });
      });
  }

}
