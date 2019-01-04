import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabilizarIppCierreCorridasListadoComponent } from './contabilizar-ipp-cierre-corridas-listado.component';

describe('ContabilizarIppCierreCorridasListadoComponent', () => {
  let component: ContabilizarIppCierreCorridasListadoComponent;
  let fixture: ComponentFixture<ContabilizarIppCierreCorridasListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContabilizarIppCierreCorridasListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabilizarIppCierreCorridasListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
