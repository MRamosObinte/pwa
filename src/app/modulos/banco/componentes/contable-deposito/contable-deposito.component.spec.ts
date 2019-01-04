import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContableDepositoComponent } from './contable-deposito.component';

describe('ContableDepositoComponent', () => {
  let component: ContableDepositoComponent;
  let fixture: ComponentFixture<ContableDepositoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContableDepositoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContableDepositoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
