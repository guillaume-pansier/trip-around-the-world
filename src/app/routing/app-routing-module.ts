import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { MapSVGComponent } from '../map/map.svg';
import { CountryDetailComponent } from '../country-detail/country-detail.component';
import { NaviguationPannelComponent } from '../naviguation-pannel/naviguation-pannel.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', outlet: 'test-name', component: NaviguationPannelComponent },
      { path: 'country/:id', outlet: 'test-name', component: NaviguationPannelComponent },
      { path: 'country/:id', component: CountryDetailComponent },
      { path: '', component: MapSVGComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
