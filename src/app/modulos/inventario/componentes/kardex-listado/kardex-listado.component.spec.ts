import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexListadoComponent } from './kardex-listado.component';

describe('KardexListadoComponent', () => {
  let component: KardexListadoComponent;
  let fixture: ComponentFixture<KardexListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KardexListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KardexListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
