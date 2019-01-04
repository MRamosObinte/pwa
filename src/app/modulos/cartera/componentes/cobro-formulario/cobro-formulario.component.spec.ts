import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobroFormularioComponent } from './cobro-formulario.component';

describe('CobroFormularioComponent', () => {
  let component: CobroFormularioComponent;
  let fixture: ComponentFixture<CobroFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobroFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobroFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
