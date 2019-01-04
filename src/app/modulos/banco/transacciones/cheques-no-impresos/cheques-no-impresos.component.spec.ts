import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequesNoImpresosComponent } from './cheques-no-impresos.component';

describe('ChequesNoImpresosComponent', () => {
  let component: ChequesNoImpresosComponent;
  let fixture: ComponentFixture<ChequesNoImpresosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequesNoImpresosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequesNoImpresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
