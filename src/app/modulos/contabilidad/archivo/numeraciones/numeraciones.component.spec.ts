import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeracionesComponent } from './numeraciones.component';

describe('NumeracionesComponent', () => {
  let component: NumeracionesComponent;
  let fixture: ComponentFixture<NumeracionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
