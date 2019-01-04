import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodegaFormularioComponent } from './bodega-formulario.component';

describe('BodegaFormularioComponent', () => {
  let component: BodegaFormularioComponent;
  let fixture: ComponentFixture<BodegaFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodegaFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodegaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
