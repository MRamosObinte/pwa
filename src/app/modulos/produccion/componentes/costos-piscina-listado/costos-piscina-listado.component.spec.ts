import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosPiscinaListadoComponent } from './costos-piscina-listado.component';

describe('CostosPiscinaListadoComponent', () => {
  let component: CostosPiscinaListadoComponent;
  let fixture: ComponentFixture<CostosPiscinaListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostosPiscinaListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostosPiscinaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
