import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosMensualesComponent } from './costos-mensuales.component';

describe('CostosMensualesComponent', () => {
  let component: CostosMensualesComponent;
  let fixture: ComponentFixture<CostosMensualesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostosMensualesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostosMensualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
