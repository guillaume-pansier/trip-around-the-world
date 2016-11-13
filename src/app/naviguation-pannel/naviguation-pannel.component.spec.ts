/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NaviguationPannelComponent } from './naviguation-pannel.component';

describe('NaviguationPannelComponent', () => {
  let component: NaviguationPannelComponent;
  let fixture: ComponentFixture<NaviguationPannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaviguationPannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaviguationPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
