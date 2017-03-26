import { Component, OnInit, Inject, ViewContainerRef, ViewChild } from '@angular/core';
import { Path } from '../model/paths/path';
import { PathRepositoryService } from '../model/paths/path-repository.service';
import { STATE_HANDLER_TOKEN } from '../constants';
import { ApplicationStateHandler } from '../application-state/application-state-handler';
import { ModalComponentComponent } from './modal-component/modal-component.component';
import { zip } from 'rxjs/observable/zip';
import { of } from 'rxjs/observable/of';



@Component({
  selector: 'app-naviguation-pannel',
  templateUrl: './naviguation-pannel.component.html',
  styleUrls: ['./naviguation-pannel.component.css']
})
export class NaviguationPannelComponent implements OnInit {

  @ViewChild('childModal') childModal: ModalComponentComponent;

  private paths: Array<Path> = [];
  private activePath: Path;

  constructor(private pathRepositoryService: PathRepositoryService,
    @Inject(STATE_HANDLER_TOKEN) private applicationStateHandler: ApplicationStateHandler,
    private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
    zip(this.applicationStateHandler.onActivePathModified(),
      this.pathRepositoryService.getPaths().toArray(),
      (activePath: Path, paths: Array<Path>) => {
        this.paths = paths;
        return activePath;
      }
    ).flatMap((activePath: Path) => {
      if (!activePath) {
        this.activePath = this.paths[0];
        return this.applicationStateHandler.selectPath(this.activePath);
      } else {
        this.activePath = activePath;
        return of(null);
      }
    }).subscribe();
  }

  onNewTripAsked() {
    this.childModal.show();
  }

  onNewTripConfirmation(tripName) {
    this.applicationStateHandler.modifyPath(new Path(tripName, [])).subscribe(
      (path) => { this.activePath = path; },
      (error) => console.error(error),
      () => {
        this.paths.push(this.activePath);
        this.selectTrip(this.activePath);
      }
    );
  }

  selectTrip(path: Path) {
    this.activePath = path;
    this.applicationStateHandler.selectPath(this.activePath).subscribe();
  }

}
