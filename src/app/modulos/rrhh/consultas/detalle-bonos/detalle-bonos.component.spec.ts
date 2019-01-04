import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleBonosComponent } from './detalle-bonos.component';

describe('DetalleBonosComponent', () => {
  let component: DetalleBonosComponent;
  let fixture: ComponentFixture<DetalleBonosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleBonosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleBonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
