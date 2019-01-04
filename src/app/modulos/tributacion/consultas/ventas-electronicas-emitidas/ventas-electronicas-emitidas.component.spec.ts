import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasElectronicasEmitidasComponent } from './ventas-electronicas-emitidas.component';

describe('VentasElectronicasEmitidasComponent', () => {
  let component: VentasElectronicasEmitidasComponent;
  let fixture: ComponentFixture<VentasElectronicasEmitidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasElectronicasEmitidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasElectronicasEmitidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
