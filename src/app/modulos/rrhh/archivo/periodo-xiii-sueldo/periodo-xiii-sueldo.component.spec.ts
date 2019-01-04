import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodoXiiiSueldoComponent } from './periodo-xiii-sueldo.component';

describe('PeriodoXiiiSueldoComponent', () => {
  let component: PeriodoXiiiSueldoComponent;
  let fixture: ComponentFixture<PeriodoXiiiSueldoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodoXiiiSueldoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodoXiiiSueldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
