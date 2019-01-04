import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoVentasComponent } from './motivo-ventas.component';

describe('MotivoVentasComponent', () => {
  let component: MotivoVentasComponent;
  let fixture: ComponentFixture<MotivoVentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoVentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
