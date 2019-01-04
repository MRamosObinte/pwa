import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalonResumenComprasComponent } from './talon-resumen-compras.component';

describe('TalonResumenComprasComponent', () => {
  let component: TalonResumenComprasComponent;
  let fixture: ComponentFixture<TalonResumenComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalonResumenComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalonResumenComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
