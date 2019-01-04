import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosIndividualComponent } from './pagos-individual.component';

describe('PagosIndividualComponent', () => {
  let component: PagosIndividualComponent;
  let fixture: ComponentFixture<PagosIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagosIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagosIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
