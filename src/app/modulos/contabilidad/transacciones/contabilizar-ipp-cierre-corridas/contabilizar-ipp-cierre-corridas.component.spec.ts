import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabilizarIppCierreCorridasComponent } from './contabilizar-ipp-cierre-corridas.component';

describe('ContabilizarIppCierreCorridasComponent', () => {
  let component: ContabilizarIppCierreCorridasComponent;
  let fixture: ComponentFixture<ContabilizarIppCierreCorridasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContabilizarIppCierreCorridasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabilizarIppCierreCorridasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
