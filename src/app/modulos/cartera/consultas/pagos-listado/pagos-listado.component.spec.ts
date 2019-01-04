import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosListadoComponent } from './pagos-listado.component';

describe('PagosListadoComponent', () => {
  let component: PagosListadoComponent;
  let fixture: ComponentFixture<PagosListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagosListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
