import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumosMensualesComponent } from './consumos-mensuales.component';

describe('ConsumosMensualesComponent', () => {
  let component: ConsumosMensualesComponent;
  let fixture: ComponentFixture<ConsumosMensualesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumosMensualesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumosMensualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
