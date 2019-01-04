import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadroProvisionesComponent } from './cuadro-provisiones.component';

describe('CuadroProvisionesComponent', () => {
  let component: CuadroProvisionesComponent;
  let fixture: ComponentFixture<CuadroProvisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuadroProvisionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuadroProvisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
