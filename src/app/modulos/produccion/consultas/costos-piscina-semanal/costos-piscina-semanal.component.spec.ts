import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosPiscinaSemanalComponent } from './costos-piscina-semanal.component';

describe('CostosPiscinaSemanalComponent', () => {
  let component: CostosPiscinaSemanalComponent;
  let fixture: ComponentFixture<CostosPiscinaSemanalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostosPiscinaSemanalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostosPiscinaSemanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
