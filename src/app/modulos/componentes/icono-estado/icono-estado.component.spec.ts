import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconoEstadoComponent } from './icono-estado.component';

describe('IconoEstadoComponent', () => {
  let component: IconoEstadoComponent;
  let fixture: ComponentFixture<IconoEstadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconoEstadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconoEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
