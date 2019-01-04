import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoComprobacionComponent } from './estado-comprobacion.component';

describe('EstadoComprobacionComponent', () => {
  let component: EstadoComprobacionComponent;
  let fixture: ComponentFixture<EstadoComprobacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoComprobacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoComprobacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
