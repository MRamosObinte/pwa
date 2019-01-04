import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoChequesVencimientoComponent } from './listado-cheques-vencimiento.component';

describe('ListadoChequesVencimientoComponent', () => {
  let component: ListadoChequesVencimientoComponent;
  let fixture: ComponentFixture<ListadoChequesVencimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoChequesVencimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoChequesVencimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
