import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobrosIndividualComponent } from './cobros-individual.component';

describe('CobrosIndividualComponent', () => {
  let component: CobrosIndividualComponent;
  let fixture: ComponentFixture<CobrosIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobrosIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobrosIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
