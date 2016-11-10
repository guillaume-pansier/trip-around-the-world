import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Config } from './config/config';
import { AppComponent } from './app.component';
import { MapSVGComponent } from './map/map.svg';
import { CountrySVGComponent } from './map/country.svg'
import {CountryRepositoryService} from "./map/repository/country.repository.service.ts";
import {CONTRY_REPO_TOKEN} from "./map/repository/country.repository.constants";

@NgModule({
  declarations: [
    AppComponent,
    MapSVGComponent,
    CountrySVGComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: 'country/:id', component: CountrySVGComponent },
      { path: '', component: MapSVGComponent }
      /*{ path: '**', component: PageNotFoundComponent }*/
    ])
  ],
  providers: [Config, {
    provide: APP_INITIALIZER,
    useFactory: (config:Config) => () => config.load(),
    deps: [Config],
    multi: true
  },
    {provide: CONTRY_REPO_TOKEN, useClass: CountryRepositoryService}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
