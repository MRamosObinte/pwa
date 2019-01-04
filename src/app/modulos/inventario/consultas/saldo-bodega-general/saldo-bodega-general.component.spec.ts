import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoBodegaGeneralComponent } from './saldo-bodega-general.component';

describe('SaldoBodegaGeneralComponent', () => {
  let component: SaldoBodegaGeneralComponent;
  let fixture: ComponentFixture<SaldoBodegaGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldoBodegaGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoBodegaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
