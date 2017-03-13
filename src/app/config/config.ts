import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class Config {
  private config: Object;
  private env: Object;

  constructor(private http: Http) {
    this.env = environment.envName;
  }

  load() {
    return new Promise((resolve, reject) => {
      console.log(this.env);
      this.http.get('assets/conf/' + this.env + '.json')
        .map(res => res.json())
        .catch((error: any) => {
          console.error(error);
          return Observable.throw(error || 'Server error');
        })
        .subscribe((data) => {
          this.config = data;
          resolve(true);
        });
    });
  }

  getEnv(key: any) {
    return this.env[key];
  }

  get(key: any) {
    return this.config[key];
  }
}

export function configFactory(config: Config) {
  return () => config.load();
}
