import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabilizarIppListadoComponent } from './contabilizar-ipp-listado.component';

describe('ContabilizarIppListadoComponent', () => {
  let component: ContabilizarIppListadoComponent;
  let fixture: ComponentFixture<ContabilizarIppListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContabilizarIppListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabilizarIppListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
