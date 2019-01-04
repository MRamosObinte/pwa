import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoResultadoIntegralComponent } from './estado-resultado-integral.component';

describe('EstadoResultadoIntegralComponent', () => {
  let component: EstadoResultadoIntegralComponent;
  let fixture: ComponentFixture<EstadoResultadoIntegralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoResultadoIntegralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoResultadoIntegralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
