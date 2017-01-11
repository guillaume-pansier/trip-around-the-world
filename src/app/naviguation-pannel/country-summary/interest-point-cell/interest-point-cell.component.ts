import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { InterestPoint } from '../../../model/paths/interest-point';
import { FocusDirective } from './focus.directive';


@Component({
  selector: 'app-interest-point-cell',
  templateUrl: './interest-point-cell.component.html',
  styleUrls: ['./interest-point-cell.component.css'],
})
export class InterestPointCellComponent implements OnInit {

  @Input() interestPoints: Array<InterestPoint>;
  @Input() index: number;

  @ViewChild(FocusDirective) input;

  private disabled: boolean;

  @Output() interestPointNameChange = new EventEmitter<Array<InterestPoint>>();

  constructor() {
    this.disabled = true;
  }

  ngOnInit() {
  }

  edit() {
    this.disabled = false;
    setTimeout(() => this.input.setFocus(), 0);
  }

  save(value: string) {
    this.interestPointNameChange.emit(this.interestPoints);
    this.disabled = true;
  }
}
