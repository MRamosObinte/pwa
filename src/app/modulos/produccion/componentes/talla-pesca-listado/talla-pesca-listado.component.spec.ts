import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TallaPescaListadoComponent } from './talla-pesca-listado.component';

describe('TallaPescaListadoComponent', () => {
  let component: TallaPescaListadoComponent;
  let fixture: ComponentFixture<TallaPescaListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TallaPescaListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TallaPescaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
