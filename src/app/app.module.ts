import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AgmCoreModule, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { AppRoutingModule } from './routing/app-routing-module';


import { Config } from './config/config';
import { AppComponent } from './app.component';
import { MapSVGComponent } from './map/map.svg';
import { CountrySVGComponent } from './map/country.svg'
import { CountryRepositoryService } from "./map/repository/country.repository.service";
import { CONTRY_REPO_TOKEN } from "./map/repository/country.repository.constants";
import { CountryDetailComponent } from './country-detail/country-detail.component';
import { PanControllerComponent } from './country-detail/boundaries-controller/boundaries-controller.component';
import { OverlayFillerComponent } from './country-detail/overlay-filler/overlay-filler.component';
import { NaviguationPannelComponent } from './naviguation-pannel/naviguation-pannel.component';
import { OverlayRepositoryService } from './country-detail/overlay-repository/overlay-repository.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCbfov46Hk19QUCjXheiaFNkYn3k0id6Jc'
    }),
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    MapSVGComponent,
    CountrySVGComponent,
    CountryDetailComponent,
    NaviguationPannelComponent,
    PanControllerComponent,
    OverlayFillerComponent
  ],
  providers: [Config, {
    provide: APP_INITIALIZER,
    useFactory: (config:Config) => () => config.load(),
    deps: [Config],
    multi: true
  },
    {provide: CONTRY_REPO_TOKEN, useClass: CountryRepositoryService},
    OverlayRepositoryService
  ],
  bootstrap: [AppComponent ] 
})
export class AppModule {
}
