import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoTransferenciasComponent } from './motivo-transferencias.component';

describe('MotivoTransferenciasComponent', () => {
  let component: MotivoTransferenciasComponent;
  let fixture: ComponentFixture<MotivoTransferenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoTransferenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoTransferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
