import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContableFormularioComponent } from './contable-formulario.component';

describe('ContableFormularioComponent', () => {
  let component: ContableFormularioComponent;
  let fixture: ComponentFixture<ContableFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContableFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContableFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
