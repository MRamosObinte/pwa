import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonosFormularioComponent } from './bonos-formulario.component';

describe('BonosFormularioComponent', () => {
  let component: BonosFormularioComponent;
  let fixture: ComponentFixture<BonosFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonosFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonosFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
