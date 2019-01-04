import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorridaFormularioComponent } from './corrida-formulario.component';

describe('CorridaFormularioComponent', () => {
  let component: CorridaFormularioComponent;
  let fixture: ComponentFixture<CorridaFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorridaFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorridaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
