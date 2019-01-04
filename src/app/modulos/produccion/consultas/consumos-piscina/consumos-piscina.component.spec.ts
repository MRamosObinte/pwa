import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumosPiscinaComponent } from './consumos-piscina.component';

describe('ConsumosPiscinaComponent', () => {
  let component: ConsumosPiscinaComponent;
  let fixture: ComponentFixture<ConsumosPiscinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumosPiscinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumosPiscinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
