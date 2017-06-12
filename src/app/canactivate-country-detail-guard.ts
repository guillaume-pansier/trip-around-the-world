import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { ApplicationStateHandler } from './application-state/application-state-handler';
import { STATE_HANDLER_TOKEN } from './constants';

@Injectable()
export class CanActivateCountryDetailGuard implements CanActivate {

  constructor( @Inject(STATE_HANDLER_TOKEN) private stateHandler: ApplicationStateHandler,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    this.stateHandler.onCountryClicked().first().filter(value => value === null).isEmpty().subscribe(
      canNavigate => {
        if (!canNavigate) {
          this.router.navigateByUrl('');
        }
      }
    );

    return true;
  }
}
