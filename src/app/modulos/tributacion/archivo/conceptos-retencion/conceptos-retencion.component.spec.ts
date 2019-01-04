import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptosRetencionComponent } from './conceptos-retencion.component';

describe('ConceptosRetencionComponent', () => {
  let component: ConceptosRetencionComponent;
  let fixture: ComponentFixture<ConceptosRetencionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptosRetencionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptosRetencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
