import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilidadesPrecalculadasComponent } from './utilidades-precalculadas.component';

describe('UtilidadesPrecalculadasComponent', () => {
  let component: UtilidadesPrecalculadasComponent;
  let fixture: ComponentFixture<UtilidadesPrecalculadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilidadesPrecalculadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilidadesPrecalculadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
