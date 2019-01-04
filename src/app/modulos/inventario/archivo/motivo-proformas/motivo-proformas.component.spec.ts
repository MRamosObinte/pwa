import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoProformasComponent } from './motivo-proformas.component';

describe('MotivoProformasComponent', () => {
  let component: MotivoProformasComponent;
  let fixture: ComponentFixture<MotivoProformasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoProformasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
