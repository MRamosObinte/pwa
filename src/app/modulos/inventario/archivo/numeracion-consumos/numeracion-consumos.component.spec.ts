import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeracionConsumosComponent } from './numeracion-consumos.component';

describe('NumeracionConsumosComponent', () => {
  let component: NumeracionConsumosComponent;
  let fixture: ComponentFixture<NumeracionConsumosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionConsumosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionConsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
