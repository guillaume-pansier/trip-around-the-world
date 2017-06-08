import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { empty } from 'rxjs/observable/empty';

import { Path } from './path';

@Injectable()
export class PathRepositoryService {

  private headers: Headers;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Access-Control-Allow-Headers', 'origin, content-type, accept');
  }

  public getPaths(): Observable<Path> {
      return this.http.get('http://192.168.99.100:49160/paths', { headers: this.headers })
      .map((response: Response) => response.text())
      .map((json: string) => JSON.parse(json))
      .flatMap((paths: Array<Path>) => {
        if (paths.length === 0) {
          return empty<Path>();
        }
        paths = paths.map(path => this.linkCountries(new Path(path)));
        return from(paths);
      });
  }

  private linkCountries(path: Path): Path {
    for (let index = 0; index < path.countries.length - 1; index++) {
      path.countries[index + 1].preceededBy(path.countries[index]);
    }
    return path;
  }

  public savePath(path: Path): Observable<Path> {

    if (!path._id) {
      return this.http.post('http://192.168.99.100:49160/path', path, { headers: this.headers })
        .map((response: Response) => response.json());
    } else {
      return this.http.put('http://192.168.99.100:49160/path/' + path._id, path, { headers: this.headers })
        .map((response: Response) => path);
    }

  }
}
