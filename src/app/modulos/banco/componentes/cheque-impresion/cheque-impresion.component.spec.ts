import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeImpresionComponent } from './cheque-impresion.component';

describe('ChequeImpresionComponent', () => {
  let component: ChequeImpresionComponent;
  let fixture: ComponentFixture<ChequeImpresionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeImpresionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeImpresionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
