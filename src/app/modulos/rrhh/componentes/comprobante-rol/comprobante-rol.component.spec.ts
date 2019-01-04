import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteRolComponent } from './comprobante-rol.component';

describe('ComprobanteRolComponent', () => {
  let component: ComprobanteRolComponent;
  let fixture: ComponentFixture<ComprobanteRolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobanteRolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobanteRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
