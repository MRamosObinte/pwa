import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabilidadComponent } from './contabilidad.component';

describe('ContabilidadComponent', () => {
  let component: ContabilidadComponent;
  let fixture: ComponentFixture<ContabilidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContabilidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
