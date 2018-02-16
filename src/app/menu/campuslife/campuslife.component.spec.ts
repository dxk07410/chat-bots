/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CampuslifeComponent } from './campuslife.component';

describe('CampuslifeComponent', () => {
  let component: CampuslifeComponent;
  let fixture: ComponentFixture<CampuslifeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampuslifeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampuslifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
