import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Error0Component } from './error0.component';

describe('Error0Component', () => {
  let component: Error0Component;
  let fixture: ComponentFixture<Error0Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Error0Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Error0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
