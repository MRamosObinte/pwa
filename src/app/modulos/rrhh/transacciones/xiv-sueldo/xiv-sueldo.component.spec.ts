import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XivSueldoComponent } from './xiv-sueldo.component';

describe('XivSueldoComponent', () => {
  let component: XivSueldoComponent;
  let fixture: ComponentFixture<XivSueldoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XivSueldoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XivSueldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
