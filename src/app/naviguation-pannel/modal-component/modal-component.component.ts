import { Component, Output, ViewChild, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.css']
})
export class ModalComponentComponent {
  @ViewChild('childModal') public childModal: ModalDirective;
  @Output() newTrip = new EventEmitter<string>();
  private tripName: string;

  constructor() {
  }

  show() {
    this.childModal.show();
  }

  hide() {
    this.childModal.hide();
  }

  closeAndSubmitNewTrip() {
    if (this.tripName) {
      this.newTrip.next(this.tripName);
    }
    this.hide();
  }

}
