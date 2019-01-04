import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCobrosListadoComponent } from './lista-cobros-listado.component';

describe('ListaCobrosListadoComponent', () => {
  let component: ListaCobrosListadoComponent;
  let fixture: ComponentFixture<ListaCobrosListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaCobrosListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCobrosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
