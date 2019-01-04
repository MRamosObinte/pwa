import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivosFijosComponent } from './activos-fijos.component';

describe('ActivosFijosComponent', () => {
  let component: ActivosFijosComponent;
  let fixture: ComponentFixture<ActivosFijosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivosFijosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivosFijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
