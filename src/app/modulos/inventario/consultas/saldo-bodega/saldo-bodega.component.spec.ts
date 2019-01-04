import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoBodegaComponent } from './saldo-bodega.component';

describe('SaldoBodegaComponent', () => {
  let component: SaldoBodegaComponent;
  let fixture: ComponentFixture<SaldoBodegaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldoBodegaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoBodegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
