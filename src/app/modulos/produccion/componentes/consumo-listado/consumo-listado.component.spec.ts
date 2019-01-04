import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoListadoComponent } from './consumo-listado.component';

describe('ConsumoListadoComponent', () => {
  let component: ConsumoListadoComponent;
  let fixture: ComponentFixture<ConsumoListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumoListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumoListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
