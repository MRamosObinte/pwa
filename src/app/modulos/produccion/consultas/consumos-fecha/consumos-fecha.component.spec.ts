import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumosFechaComponent } from './consumos-fecha.component';

describe('ConsumosFechaComponent', () => {
  let component: ConsumosFechaComponent;
  let fixture: ComponentFixture<ConsumosFechaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumosFechaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumosFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
