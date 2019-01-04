import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoporteContableBonosComponent } from './soporte-contable-bonos.component';

describe('SoporteContableBonosComponent', () => {
  let component: SoporteContableBonosComponent;
  let fixture: ComponentFixture<SoporteContableBonosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoporteContableBonosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoporteContableBonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
