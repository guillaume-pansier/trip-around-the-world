import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Path } from '../model/paths/path';
import { PathRepositoryService } from '../model/paths/path-repository.service';
import { STATE_HANDLER_TOKEN } from '../constants';
import { ApplicationStateHandler } from '../application-state/application-state-handler';
import { ModalComponentComponent } from './modal-component/modal-component.component';
import { zip } from 'rxjs/observable/zip';
import { empty } from 'rxjs/observable/empty';


@Component({
  selector: 'app-naviguation-pannel',
  templateUrl: './naviguation-pannel.component.html',
  styleUrls: ['./naviguation-pannel.component.css']
})
export class NaviguationPannelComponent implements OnInit {

  @ViewChild('childModal') childModal: ModalComponentComponent;

  paths: Array<Path> = [];
  activePath: Path;

  constructor(private pathRepositoryService: PathRepositoryService,
    @Inject(STATE_HANDLER_TOKEN) private applicationStateHandler: ApplicationStateHandler,
    private ref: ChangeDetectorRef) {
  }

  ngOnInit() {

    zip(this.applicationStateHandler.onActivePathModified(),
      this.pathRepositoryService.getPaths().toArray(),
      (activePath: Path, paths: Array<Path>) => {
        this.paths = paths;
        return activePath;
      }
    )
      .flatMap((activePath: Path) => {
        console.log('observableActivePath', activePath);
        if (!activePath && this.paths[0]) {
          console.log('observableActivePath null, set to', this.paths[0]);
          return this.selectTrip(this.paths[0]);
        } else if (activePath) {
          return this.selectTrip(activePath);
        } else {
          return empty<void>();
        }
      }).subscribe();
  }

  onNewTripAsked() {
    this.childModal.show();
  }

  onNewTripConfirmation(tripName) {
    this.applicationStateHandler.modifyPath(new Path(tripName, []))
      .flatMap(path => {
        this.paths.push(path);
        return this.selectTrip(path);
      })
      .subscribe(
      () => { },
      (error) => console.error(error),
    );
  }

  selectTrip(path: Path) {
    this.activePath = path;
    return this.applicationStateHandler.selectPath(this.activePath);
  }

  isActivePath(path: Path): boolean {
    return this.activePath && this.activePath._id === path._id;
  }
}
