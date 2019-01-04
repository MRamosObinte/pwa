import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContableCabeceraComponent } from './contable-cabecera.component';

describe('ContableCabeceraComponent', () => {
  let component: ContableCabeceraComponent;
  let fixture: ComponentFixture<ContableCabeceraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContableCabeceraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContableCabeceraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
