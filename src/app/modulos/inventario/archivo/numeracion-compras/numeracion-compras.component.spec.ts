import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeracionComprasComponent } from './numeracion-compras.component';

describe('NumeracionComprasComponent', () => {
  let component: NumeracionComprasComponent;
  let fixture: ComponentFixture<NumeracionComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
