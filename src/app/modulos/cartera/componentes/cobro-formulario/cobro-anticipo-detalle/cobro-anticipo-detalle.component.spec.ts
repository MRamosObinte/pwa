import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobroAnticipoDetalleComponent } from './cobro-anticipo-detalle.component';

describe('CobroAnticipoDetalleComponent', () => {
  let component: CobroAnticipoDetalleComponent;
  let fixture: ComponentFixture<CobroAnticipoDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobroAnticipoDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobroAnticipoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
