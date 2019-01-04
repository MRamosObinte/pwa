import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoComprasComponent } from './listado-compras.component';

describe('ListadoComprasComponent', () => {
  let component: ListadoComprasComponent;
  let fixture: ComponentFixture<ListadoComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
