import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { MapSVGComponent } from '../map/map.svg';
import { CountryDetailComponent } from '../country-detail/country-detail.component.ts';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'country/:id', component: CountryDetailComponent },
      { path: '', component: MapSVGComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
