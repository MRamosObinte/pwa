import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaConciliacionBancariaCreditoComponent } from './tabla-conciliacion-bancaria-credito.component';

describe('TablaConciliacionBancariaCreditoComponent', () => {
  let component: TablaConciliacionBancariaCreditoComponent;
  let fixture: ComponentFixture<TablaConciliacionBancariaCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaConciliacionBancariaCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaConciliacionBancariaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
