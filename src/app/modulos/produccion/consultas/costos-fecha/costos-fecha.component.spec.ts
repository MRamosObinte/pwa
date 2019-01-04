import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosFechaComponent } from './costos-fecha.component';

describe('CostosFechaComponent', () => {
  let component: CostosFechaComponent;
  let fixture: ComponentFixture<CostosFechaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostosFechaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostosFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
