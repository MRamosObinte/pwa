import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorListadoComponent } from './sector-listado.component';

describe('SectorListadoComponent', () => {
  let component: SectorListadoComponent;
  let fixture: ComponentFixture<SectorListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectorListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
