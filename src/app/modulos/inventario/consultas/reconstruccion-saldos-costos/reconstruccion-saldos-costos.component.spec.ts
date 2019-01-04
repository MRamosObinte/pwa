import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconstruccionSaldosCostosComponent } from './reconstruccion-saldos-costos.component';

describe('ReconstruccionSaldosCostosComponent', () => {
  let component: ReconstruccionSaldosCostosComponent;
  let fixture: ComponentFixture<ReconstruccionSaldosCostosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconstruccionSaldosCostosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconstruccionSaldosCostosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
