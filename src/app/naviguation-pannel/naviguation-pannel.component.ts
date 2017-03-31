import { Component, OnInit, Inject, ViewContainerRef, ViewChild } from '@angular/core';
import { Path } from '../model/paths/path';
import { PathRepositoryService } from '../model/paths/path-repository.service';
import { STATE_HANDLER_TOKEN } from '../constants';
import { ApplicationStateHandler } from '../application-state/application-state-handler';
import { ModalComponentComponent } from './modal-component/modal-component.component';
import { zip } from 'rxjs/observable/zip';


@Component({
  selector: 'app-naviguation-pannel',
  templateUrl: './naviguation-pannel.component.html',
  styleUrls: ['./naviguation-pannel.component.css']
})
export class NaviguationPannelComponent implements OnInit {

  @ViewChild('childModal') childModal: ModalComponentComponent;

  private otherPaths: Array<Path> = [];
  private activePath: Path;

  constructor(private pathRepositoryService: PathRepositoryService,
    @Inject(STATE_HANDLER_TOKEN) private applicationStateHandler: ApplicationStateHandler,
    private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {

    zip(this.applicationStateHandler.onActivePathModified(),
      this.pathRepositoryService.getPaths().toArray(),
      (activePath: Path, paths: Array<Path>) => {
        this.otherPaths = paths;
        return activePath;
      }
    ).flatMap((activePath: Path) => {
      if (!activePath) {
        return this.selectTrip(this.otherPaths[0]);
      } else {
        return this.selectTrip(activePath);
      }
    }).subscribe();
  }

  onNewTripAsked() {
    this.childModal.show();
  }

  onNewTripConfirmation(tripName) {
    this.applicationStateHandler.modifyPath(new Path(tripName, []))
      .flatMap(path => {
        this.otherPaths.push(this.activePath);
        return this.selectTrip(this.activePath);
      })
      .subscribe(
      () => { },
      (error) => console.error(error),
    );
  }

  selectTrip(path: Path) {

    if (this.activePath) {
      if (this.activePath._id === path._id) {
        let indexOfActivePath = this.otherPaths.findIndex(pathItem => pathItem._id === this.activePath._id);
        this.otherPaths.splice(indexOfActivePath, 1);
      } else {
        let indexOfActivePath = this.otherPaths.findIndex(pathItem => pathItem._id === path._id);
        this.otherPaths.splice(indexOfActivePath, 1, this.activePath);
      }
    } else {
      let indexOfActivePath = this.otherPaths.findIndex(pathItem => pathItem._id === path._id);
      this.otherPaths.splice(indexOfActivePath, 1);
    }
    this.activePath = path;
    return this.applicationStateHandler.selectPath(this.activePath);
  }
}
