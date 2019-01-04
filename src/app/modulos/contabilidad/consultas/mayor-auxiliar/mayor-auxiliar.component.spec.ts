import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MayorAuxiliarComponent } from './mayor-auxiliar.component';

describe('MayorAuxiliarComponent', () => {
  let component: MayorAuxiliarComponent;
  let fixture: ComponentFixture<MayorAuxiliarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MayorAuxiliarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MayorAuxiliarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
