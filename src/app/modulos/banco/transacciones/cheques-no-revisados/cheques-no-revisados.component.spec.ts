import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequesNoRevisadosComponent } from './cheques-no-revisados.component';

describe('ChequesNoRevisadosComponent', () => {
  let component: ChequesNoRevisadosComponent;
  let fixture: ComponentFixture<ChequesNoRevisadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequesNoRevisadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequesNoRevisadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
