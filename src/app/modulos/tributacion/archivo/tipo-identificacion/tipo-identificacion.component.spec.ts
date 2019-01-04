import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoIdentificacionComponent } from './tipo-identificacion.component';

describe('TipoIdentificacionComponent', () => {
  let component: TipoIdentificacionComponent;
  let fixture: ComponentFixture<TipoIdentificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoIdentificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoIdentificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
