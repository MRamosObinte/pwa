import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosFechaSimpleComponent } from './costos-fecha-simple.component';

describe('CostosFechaSimpleComponent', () => {
  let component: CostosFechaSimpleComponent;
  let fixture: ComponentFixture<CostosFechaSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostosFechaSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostosFechaSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
