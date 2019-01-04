import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoConsumosComponent } from './motivo-consumos.component';

describe('MotivoConsumosComponent', () => {
  let component: MotivoConsumosComponent;
  let fixture: ComponentFixture<MotivoConsumosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoConsumosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoConsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
