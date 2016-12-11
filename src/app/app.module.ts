import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AppRoutingModule } from './routing/app-routing-module';
import { ApplicationStateModule } from './application-state/application-state-module';


import { Config } from './config/config';
import { AppComponent } from './app.component';
import { MapSVGComponent } from './map/map.svg';
import { CountrySVGComponent } from './map/country.svg';
import { CountryRepositoryService } from './map/repository/country.repository.service';
import { CountryDetailComponent } from './country-detail/country-detail.component';
import { PanControllerComponent } from './country-detail/boundaries-controller/boundaries-controller.component';
import { OverlayFillerDirective } from './country-detail/overlay-filler/overlay-filler.directive';
import { NaviguationPannelComponent } from './naviguation-pannel/naviguation-pannel.component';
import { OverlayRepositoryService } from './country-detail/overlay-repository/overlay-repository.service';
import { EventHandlerDirective } from './country-detail/event-handler/event-handler.directive';
import { PathRepositoryService } from './paths/path-repository.service';


import { CONTRY_REPO_TOKEN } from './map/repository/country.repository.constants';



@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCbfov46Hk19QUCjXheiaFNkYn3k0id6Jc'
    }),
    AppRoutingModule,
    ApplicationStateModule
  ],
  declarations: [
    AppComponent,
    MapSVGComponent,
    CountrySVGComponent,
    CountryDetailComponent,
    NaviguationPannelComponent,
    PanControllerComponent,
    OverlayFillerDirective,
    EventHandlerDirective
  ],
  providers: [Config, {
    provide: APP_INITIALIZER,
    useFactory: (config: Config) => () => config.load(),
    deps: [Config],
    multi: true
  },
    { provide: CONTRY_REPO_TOKEN, useClass: CountryRepositoryService },
    OverlayRepositoryService,
    PathRepositoryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
