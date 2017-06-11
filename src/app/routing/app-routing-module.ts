import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { MapSVGComponent } from '../map/map.svg';
import { CountryDetailComponent } from '../country-detail-ng/country-detail.component';
import { NaviguationPannelComponent } from '../naviguation-pannel/naviguation-pannel.component';
import { CountrySummaryComponent } from '../naviguation-pannel/country-summary/country-summary.component';
import { CanActivateCountryDetailGuard } from '../country-detail/canactivate-country-detail-guard';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: '/trips(nav-section:/trips)', pathMatch: 'full'},
      { path: 'trips', outlet: 'nav-section', component: NaviguationPannelComponent },
      { path: 'country/:id', outlet: 'nav-section', component: CountrySummaryComponent, canActivate: [CanActivateCountryDetailGuard] },
      { path: 'country/:id', component: CountryDetailComponent, canActivate: [CanActivateCountryDetailGuard] },
      { path: 'trips', component: MapSVGComponent },
      { path: 'trips/:id', component: MapSVGComponent },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
