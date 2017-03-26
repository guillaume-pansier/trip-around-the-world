import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AppRoutingModule } from './routing/app-routing-module';
import { ApplicationStateModule } from './application-state/application-state-module';
import { ModalModule } from 'ng2-bootstrap';
import { Config } from './config/config';
import { configFactory } from './config/config';
import { AppComponent } from './app.component';
import { MapSVGComponent } from './map/map.svg';
import { CountrySVGComponent } from './map/country.svg';
import { CountryRepositoryService } from './model/country/country.repository.service';
import { CountryDetailComponent } from './country-detail/country-detail.component';
import { PanControllerComponent } from './country-detail/boundaries-controller/boundaries-controller.component';
import { OverlayFillerDirective } from './country-detail/overlay-filler/overlay-filler.directive';
import { NaviguationPannelComponent } from './naviguation-pannel/naviguation-pannel.component';
import { OverlayRepositoryService } from './country-detail/overlay-repository/overlay-repository.service';
import { EventHandlerDirective } from './country-detail/event-handler/event-handler.directive';
import { PathRepositoryService } from './model/paths/path-repository.service';
import { CONTRY_REPO_TOKEN } from './model/country/country.repository.constants';
import { CountrySummaryComponent } from './naviguation-pannel/country-summary/country-summary.component';
import { InterestPointCellComponent } from './naviguation-pannel/country-summary/interest-point-cell/interest-point-cell.component';
import { FocusDirective } from './naviguation-pannel/country-summary/interest-point-cell/focus.directive';
import { ModalComponentComponent } from './naviguation-pannel/modal-component/modal-component.component';



@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    ModalModule.forRoot(),
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
    EventHandlerDirective,
    CountrySummaryComponent,
    InterestPointCellComponent,
    FocusDirective,
    ModalComponentComponent
  ],
  providers: [Config, {
    provide: APP_INITIALIZER,
    useFactory: configFactory,
    deps: [Config, Http],
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
