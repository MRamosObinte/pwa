import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumosPiscinaMultipleComponent } from './consumos-piscina-multiple.component';

describe('ConsumosPiscinaMultipleComponent', () => {
  let component: ConsumosPiscinaMultipleComponent;
  let fixture: ComponentFixture<ConsumosPiscinaMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumosPiscinaMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumosPiscinaMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
