import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidadoBonosComponent } from './consolidado-bonos.component';

describe('ConsolidadoBonosComponent', () => {
  let component: ConsolidadoBonosComponent;
  let fixture: ComponentFixture<ConsolidadoBonosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidadoBonosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidadoBonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
