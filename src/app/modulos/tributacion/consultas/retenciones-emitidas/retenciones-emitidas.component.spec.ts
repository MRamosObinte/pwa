import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesEmitidasComponent } from './retenciones-emitidas.component';

describe('RetencionesEmitidasComponent', () => {
  let component: RetencionesEmitidasComponent;
  let fixture: ComponentFixture<RetencionesEmitidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetencionesEmitidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionesEmitidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
