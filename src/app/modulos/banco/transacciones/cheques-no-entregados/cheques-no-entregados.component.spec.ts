import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequesNoEntregadosComponent } from './cheques-no-entregados.component';

describe('ChequesNoEntregadosComponent', () => {
  let component: ChequesNoEntregadosComponent;
  let fixture: ComponentFixture<ChequesNoEntregadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequesNoEntregadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequesNoEntregadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
