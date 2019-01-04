import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptoBonosComponent } from './concepto-bonos.component';

describe('ConceptoBonosComponent', () => {
  let component: ConceptoBonosComponent;
  let fixture: ComponentFixture<ConceptoBonosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptoBonosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptoBonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
