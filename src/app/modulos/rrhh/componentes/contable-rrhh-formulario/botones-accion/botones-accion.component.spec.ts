import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonesAccionComponent } from './botones-accion.component';

describe('BotonesAccionComponent', () => {
  let component: BotonesAccionComponent;
  let fixture: ComponentFixture<BotonesAccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotonesAccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotonesAccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
