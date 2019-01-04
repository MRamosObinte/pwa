import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoporteContableAnticipoComponent } from './soporte-contable-anticipo.component';

describe('SoporteContableAnticipoComponent', () => {
  let component: SoporteContableAnticipoComponent;
  let fixture: ComponentFixture<SoporteContableAnticipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoporteContableAnticipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoporteContableAnticipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
