import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoPescaMotivoComponent } from './presupuesto-pesca-motivo.component';

describe('PresupuestoPescaMotivoComponent', () => {
  let component: PresupuestoPescaMotivoComponent;
  let fixture: ComponentFixture<PresupuestoPescaMotivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresupuestoPescaMotivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresupuestoPescaMotivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
