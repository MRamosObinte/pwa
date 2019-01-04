import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarOrdenCompraComponent } from './aprobar-orden-compra.component';

describe('AprobarOrdenCompraComponent', () => {
  let component: AprobarOrdenCompraComponent;
  let fixture: ComponentFixture<AprobarOrdenCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobarOrdenCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarOrdenCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
