import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MayorAuxiliarMultipleComponent } from './mayor-auxiliar-multiple.component';

describe('MayorAuxiliarMultipleComponent', () => {
  let component: MayorAuxiliarMultipleComponent;
  let fixture: ComponentFixture<MayorAuxiliarMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MayorAuxiliarMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MayorAuxiliarMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
