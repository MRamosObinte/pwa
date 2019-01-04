import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TallaPescaFormularioComponent } from './talla-pesca-formulario.component';

describe('TallaPescaFormularioComponent', () => {
  let component: TallaPescaFormularioComponent;
  let fixture: ComponentFixture<TallaPescaFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TallaPescaFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TallaPescaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
