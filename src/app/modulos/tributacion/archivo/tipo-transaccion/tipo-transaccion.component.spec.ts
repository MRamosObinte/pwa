import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoTransaccionComponent } from './tipo-transaccion.component';

describe('TipoTransaccionComponent', () => {
  let component: TipoTransaccionComponent;
  let fixture: ComponentFixture<TipoTransaccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoTransaccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoTransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
