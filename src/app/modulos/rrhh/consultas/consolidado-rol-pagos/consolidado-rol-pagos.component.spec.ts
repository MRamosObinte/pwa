import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidadoRolPagosComponent } from './consolidado-rol-pagos.component';

describe('ConsolidadoRolPagosComponent', () => {
  let component: ConsolidadoRolPagosComponent;
  let fixture: ComponentFixture<ConsolidadoRolPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidadoRolPagosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidadoRolPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
