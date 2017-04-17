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

  @Output() interestPointChange = new EventEmitter<Array<InterestPoint>>();

  constructor() {
    this.disabled = true;
  }

  ngOnInit() {
  }

  edit() {
    this.disabled = false;
    setTimeout(() => this.input.setFocus(), 0);
  }

  delete(index) {
    this.interestPoints.splice(index, 1);
    this.interestPointChange.emit(this.interestPoints);
  }

  save(value: string) {
    this.interestPointChange.emit(this.interestPoints);
    this.disabled = true;
  }

  swapDown(index: number) {
    if (index >= this.interestPoints.length - 1) {
      return;
    }
    this.swapInterestPointChange(index, index + 1);
    this.interestPointChange.emit(this.interestPoints);
    this.disabled = true;
  }

  swapUp(index: number) {
    if (index <= 0) {
      return;
    }
    this.swapInterestPointChange(index, index - 1);
    this.interestPointChange.emit(this.interestPoints);
    this.disabled = true;
  }

  private swapInterestPointChange(firstIndex: number, secondIndex: number) {
    let nextElement = this.interestPoints[secondIndex];
    this.interestPoints[secondIndex] = this.interestPoints[firstIndex];
    this.interestPoints[firstIndex] = nextElement;
  }


}
