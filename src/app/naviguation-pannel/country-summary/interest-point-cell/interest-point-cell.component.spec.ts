/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { InterestPoint } from '../../../model/paths/interest-point';

import { FormsModule } from '@angular/forms';

import { InterestPointCellComponent } from './interest-point-cell.component';

describe('InterestPointCellComponent', () => {
  let component: InterestPointCellComponent;
  let fixture: ComponentFixture<InterestPointCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ InterestPointCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestPointCellComponent);
    component = fixture.componentInstance;
    component.index = 0;
    component.interestPoints = [new InterestPoint('', '')];
    fixture.detectChanges();
  });

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));
});
