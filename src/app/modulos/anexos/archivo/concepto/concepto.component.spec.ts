import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptoComponent } from './concepto.component';

describe('ConceptoComponent', () => {
  let component: ConceptoComponent;
  let fixture: ComponentFixture<ConceptoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
