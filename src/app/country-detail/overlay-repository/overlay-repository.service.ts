import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { Http, Response } from '@angular/http';


@Injectable()
export class OverlayRepositoryService {

  private overlaysObs: Observable<any>;

  private overlays: any;


  public getOverlayForCountryId(countryId: string): Observable<string> {
    if (this.overlays) {
      return of(this.overlays[countryId]);
    }

    console.dir(this.overlaysObs);
    return this.overlaysObs.map((jsonFeatures) => {
      console.dir(jsonFeatures[countryId]);
      return jsonFeatures[countryId];
    });
  }

  constructor(private http: Http) {
    this.overlaysObs = this.http.get('assets/countryFeatures.json')
      .map((res: Response) => res.json());

    console.dir(this.overlaysObs);

    this.overlaysObs.subscribe((jsonFeatures) => {
      this.overlays = jsonFeatures;
    },
      (error) => {
        console.error('could not retrieve overlays')
      });
  }

}
