import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumosPiscinaPeriodoComponent } from './consumos-piscina-periodo.component';

describe('ConsumosPiscinaPeriodoComponent', () => {
  let component: ConsumosPiscinaPeriodoComponent;
  let fixture: ComponentFixture<ConsumosPiscinaPeriodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumosPiscinaPeriodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumosPiscinaPeriodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
