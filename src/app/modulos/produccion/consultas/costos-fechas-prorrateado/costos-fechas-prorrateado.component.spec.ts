import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosFechasProrrateadoComponent } from './costos-fechas-prorrateado.component';

describe('CostosFechasProrrateadoComponent', () => {
  let component: CostosFechasProrrateadoComponent;
  let fixture: ComponentFixture<CostosFechasProrrateadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostosFechasProrrateadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostosFechasProrrateadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
